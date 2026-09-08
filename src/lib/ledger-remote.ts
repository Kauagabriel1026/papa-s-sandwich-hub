/**
 * Leitura e escrita dos lançamentos no banco.
 *
 * Este arquivo é o par remoto do `ledger-storage.ts` (que guarda no navegador).
 * Os dois falam a mesma linguagem — entram e saem objetos `Entry` — então quem
 * usa não precisa saber de onde o dado veio.
 *
 * As colunas do banco têm nomes em português e formato diferente do que a tela
 * usa. A tradução acontece toda aqui, nas funções `paraEntry` e `paraLinha`,
 * e em nenhum outro lugar do projeto.
 */

import { supabase } from "@/lib/supabase";
import type { Entry, ExpenseCategory } from "@/lib/finance";
import type { PaymentMethod } from "@/lib/payment";

const TABELA = "lancamentos";

interface Linha {
  id: string;
  tipo: "venda" | "despesa";
  valor_centavos: number;
  forma_pagamento: string | null;
  categoria: string | null;
  observacao: string;
  criado_em: string;
}

function paraEntry(linha: Linha): Entry {
  const base = {
    id: linha.id,
    amountCents: linha.valor_centavos,
    note: linha.observacao ?? "",
    createdAt: linha.criado_em,
  };

  return linha.tipo === "venda"
    ? { ...base, kind: "venda", method: linha.forma_pagamento as PaymentMethod }
    : { ...base, kind: "despesa", category: linha.categoria as ExpenseCategory };
}

/** O id não vai: quem gera é o banco. O user_id também não — vem do RLS. */
function paraLinha(entry: Entry) {
  return entry.kind === "venda"
    ? {
        tipo: "venda" as const,
        valor_centavos: entry.amountCents,
        forma_pagamento: entry.method,
        categoria: null,
        observacao: entry.note,
        criado_em: entry.createdAt,
      }
    : {
        tipo: "despesa" as const,
        valor_centavos: entry.amountCents,
        forma_pagamento: null,
        categoria: entry.category,
        observacao: entry.note,
        criado_em: entry.createdAt,
      };
}

function exigirCliente() {
  if (!supabase) throw new Error("Supabase não está configurado neste site.");
  return supabase;
}

/** Todos os lançamentos do usuário logado, do mais recente para o mais antigo. */
export async function fetchEntries(): Promise<Entry[]> {
  const { data, error } = await exigirCliente()
    .from(TABELA)
    .select("id, tipo, valor_centavos, forma_pagamento, categoria, observacao, criado_em")
    .order("criado_em", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Linha[]).map(paraEntry);
}

/**
 * Grava um lançamento. O `user_id` é preenchido aqui com o dono da sessão —
 * a política de segurança do banco recusa qualquer linha com outro dono, então
 * mesmo que este código tivesse um bug, ninguém escreveria no caixa alheio.
 */
export async function insertEntry(entry: Entry): Promise<Entry> {
  const cliente = exigirCliente();
  const { data: sessao } = await cliente.auth.getUser();
  const userId = sessao.user?.id;
  if (!userId) throw new Error("Sessão expirada. Entre de novo.");

  const { data, error } = await cliente
    .from(TABELA)
    .insert({ ...paraLinha(entry), user_id: userId })
    .select("id, tipo, valor_centavos, forma_pagamento, categoria, observacao, criado_em")
    .single();

  if (error) throw new Error(error.message);
  return paraEntry(data as Linha);
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await exigirCliente().from(TABELA).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

/**
 * Envia vários de uma vez — usado na migração do que já estava no navegador.
 * Devolve quantos entraram.
 */
export async function insertMany(entries: Entry[]): Promise<number> {
  if (entries.length === 0) return 0;

  const cliente = exigirCliente();
  const { data: sessao } = await cliente.auth.getUser();
  const userId = sessao.user?.id;
  if (!userId) throw new Error("Sessão expirada. Entre de novo.");

  const linhas = entries.map((e) => ({ ...paraLinha(e), user_id: userId }));
  const { data, error } = await cliente.from(TABELA).insert(linhas).select("id");

  if (error) throw new Error(error.message);
  return data?.length ?? 0;
}
