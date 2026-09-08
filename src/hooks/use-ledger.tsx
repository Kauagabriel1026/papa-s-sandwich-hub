import { useCallback, useEffect, useState } from "react";

import type { Entry, Expense, ExpenseCategory, Sale } from "@/lib/finance";
import type { PaymentMethod } from "@/lib/payment";
import { loadEntries, makeId, saveEntries } from "@/lib/ledger-storage";
import * as remoto from "@/lib/ledger-remote";
import { isSupabaseConfigured } from "@/lib/supabase";

/**
 * Estado do caixa, com dois destinos possíveis para os dados.
 *
 * Sem Supabase configurado, tudo continua no navegador, exatamente como antes.
 * Com Supabase, o navegador deixa de ser a fonte da verdade e vira só a tela:
 * cada lançamento vai para o banco e a lista é relida de lá.
 *
 * Quem usa este hook não muda: as funções têm a mesma assinatura nos dois modos.
 * Só `addSale` e `addExpense` passaram a ser assíncronas, porque agora podem
 * ter que esperar a rede.
 */
export function useLedger(habilitado = true) {
  const remotoAtivo = isSupabaseConfigured;

  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const carregar = useCallback(async () => {
    if (!remotoAtivo) {
      setEntries(loadEntries());
      setReady(true);
      return;
    }
    try {
      setError(null);
      setEntries(await remoto.fetchEntries());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Falha ao carregar os lançamentos.");
    } finally {
      setReady(true);
    }
  }, [remotoAtivo]);

  useEffect(() => {
    if (!habilitado) return;
    void carregar();
  }, [habilitado, carregar]);

  /** Grava a lista no navegador. Só faz sentido no modo local. */
  const commitLocal = useCallback((next: Entry[]) => {
    setEntries(next);
    setStorageFailed(!saveEntries(next));
  }, []);

  const adicionar = useCallback(
    async (entry: Entry) => {
      if (!remotoAtivo) {
        commitLocal([entry, ...entries]);
        return true;
      }
      setSaving(true);
      try {
        const salvo = await remoto.insertEntry(entry);
        // Só entra na tela depois de o banco confirmar — nada de mostrar uma
        // venda que na verdade não foi gravada.
        setEntries((prev) => [salvo, ...prev]);
        setError(null);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível salvar.");
        return false;
      } finally {
        setSaving(false);
      }
    },
    [remotoAtivo, commitLocal, entries],
  );

  const addSale = useCallback(
    (amountCents: number, method: PaymentMethod, note = "") => {
      const sale: Sale = {
        id: makeId(),
        kind: "venda",
        amountCents,
        method,
        note,
        createdAt: new Date().toISOString(),
      };
      return adicionar(sale);
    },
    [adicionar],
  );

  const addExpense = useCallback(
    (amountCents: number, category: ExpenseCategory, note = "") => {
      const expense: Expense = {
        id: makeId(),
        kind: "despesa",
        amountCents,
        category,
        note,
        createdAt: new Date().toISOString(),
      };
      return adicionar(expense);
    },
    [adicionar],
  );

  const removeEntry = useCallback(
    async (id: string) => {
      if (!remotoAtivo) {
        commitLocal(entries.filter((e) => e.id !== id));
        return;
      }
      const anterior = entries;
      // Some da tela na hora; se o banco recusar, volta como estava.
      setEntries((prev) => prev.filter((e) => e.id !== id));
      try {
        await remoto.deleteEntry(id);
      } catch (e) {
        setEntries(anterior);
        setError(e instanceof Error ? e.message : "Não foi possível excluir.");
      }
    },
    [remotoAtivo, commitLocal, entries],
  );

  const clearAll = useCallback(() => {
    if (!remotoAtivo) commitLocal([]);
  }, [remotoAtivo, commitLocal]);

  /** Restaurar backup. No modo remoto, sobe os que ainda não existem. */
  const importEntries = useCallback(
    async (incoming: Entry[]) => {
      if (!remotoAtivo) {
        const vistos = new Set(entries.map((e) => e.id));
        const novos = incoming.filter((e) => !vistos.has(e.id));
        if (novos.length > 0) {
          commitLocal(
            [...novos, ...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
          );
        }
        return novos.length;
      }

      // No banco o id é gerado lá, então a comparação é por data + valor:
      // duas vendas idênticas no mesmo segundo seriam mesmo a mesma venda.
      const assinatura = (e: Entry) => `${e.createdAt}|${e.amountCents}|${e.kind}`;
      const vistos = new Set(entries.map(assinatura));
      const novos = incoming.filter((e) => !vistos.has(assinatura(e)));

      try {
        const quantos = await remoto.insertMany(novos);
        await carregar();
        return quantos;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Não foi possível importar.");
        return 0;
      }
    },
    [remotoAtivo, commitLocal, entries, carregar],
  );

  return {
    entries,
    ready,
    saving,
    error,
    storageFailed,
    /** true = os dados estão no banco; false = só neste navegador. */
    noBanco: remotoAtivo,
    addSale,
    addExpense,
    removeEntry,
    clearAll,
    importEntries,
    recarregar: carregar,
  };
}
import { useCallback, useEffect, useState } from "react";

import type { Entry, Expense, ExpenseCategory, Sale } from "@/lib/finance";
import type { PaymentMethod } from "@/lib/payment";
import { loadEntries, makeId, saveEntries } from "@/lib/ledger-storage";

/**
 * Estado do caixa: lê do armazenamento, guarda em memória e grava de volta.
 *
 * Sobre o `ready`: o site é renderizado primeiro no servidor, onde não existe
 * localStorage. Se a gente já tentasse mostrar os dados na primeira renderização,
 * o HTML do servidor ("nenhum lançamento") não bateria com o do navegador
 * ("12 lançamentos") e o React reclamaria de hidratação. Por isso começamos
 * vazios, carregamos dentro do useEffect (que só roda no navegador) e a tela
 * mostra um esqueleto enquanto `ready` for false.
 */
export function useLedger() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [ready, setReady] = useState(false);
  const [storageFailed, setStorageFailed] = useState(false);

  useEffect(() => {
    setEntries(loadEntries());
    setReady(true);
  }, []);

  /** Toda alteração passa por aqui, então gravar nunca é esquecido. */
  const commit = useCallback((next: Entry[]) => {
    setEntries(next);
    const saved = saveEntries(next);
    setStorageFailed(!saved);
    return saved;
  }, []);

  const addSale = useCallback(
    (amountCents: number, method: PaymentMethod, note = "") => {
      const sale: Sale = {
        id: makeId(),
        kind: "venda",
        amountCents,
        method,
        note,
        createdAt: new Date().toISOString(),
      };
      commit([sale, ...entries]);
      return sale;
    },
    [commit, entries],
  );

  const addExpense = useCallback(
    (amountCents: number, category: ExpenseCategory, note = "") => {
      const expense: Expense = {
        id: makeId(),
        kind: "despesa",
        amountCents,
        category,
        note,
        createdAt: new Date().toISOString(),
      };
      commit([expense, ...entries]);
      return expense;
    },
    [commit, entries],
  );

  const removeEntry = useCallback(
    (id: string) => {
      commit(entries.filter((e) => e.id !== id));
    },
    [commit, entries],
  );

  const clearAll = useCallback(() => {
    commit([]);
  }, [commit]);

  /**
   * Junta um backup ao que já existe, sem duplicar (a chave é o id).
   * Devolve quantos lançamentos realmente entraram.
   */
  const importEntries = useCallback(
    (incoming: Entry[]) => {
      const seen = new Set(entries.map((e) => e.id));
      const fresh = incoming.filter((e) => !seen.has(e.id));
      if (fresh.length > 0) {
        const merged = [...fresh, ...entries].sort((a, b) =>
          b.createdAt.localeCompare(a.createdAt),
        );
        commit(merged);
      }
      return fresh.length;
    },
    [commit, entries],
  );

  return {
    entries,
    ready,
    storageFailed,
    addSale,
    addExpense,
    removeEntry,
    clearAll,
    importEntries,
  };
}
