import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Conexão com o Supabase.
 *
 * As duas variáveis vêm das configurações do Lovable. Enquanto elas não
 * existirem, `supabase` é null e o painel continua funcionando no modo local
 * (localStorage) — de propósito. Assim dá para publicar este código antes de
 * terminar a configuração sem derrubar o que já está no ar.
 *
 * A chave "anon" aparece no navegador de qualquer visitante, e isso é normal:
 * ela foi feita para ser pública. Quem protege os dados são as políticas de
 * segurança da tabela, que só deixam cada usuário ver as próprias linhas.
 * A chave "service_role" NUNCA pode entrar aqui — ela ignora essas políticas.
 */

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * O cliente só é criado no navegador. Durante a renderização no servidor não
 * existe localStorage, e a biblioteca precisa dele para guardar a sessão.
 */
export const supabase: SupabaseClient | null =
  typeof window !== "undefined" && isSupabaseConfigured
    ? createClient(url!, anonKey!, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
      })
    : null;

/** Traduz os erros mais comuns do Supabase para algo que o usuário entenda. */
export function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Este e-mail ainda não foi confirmado.";
  if (m.includes("too many requests") || m.includes("rate limit")) {
    return "Muitas tentativas seguidas. Espere um minuto e tente de novo.";
  }
  if (m.includes("failed to fetch") || m.includes("network")) {
    return "Sem conexão com o servidor. Verifique a internet.";
  }
  return "Não foi possível entrar. Tente de novo.";
}
