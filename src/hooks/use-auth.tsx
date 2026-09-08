import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";

import { friendlyAuthError, isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * Sessão do painel.
 *
 * Quando o Supabase não está configurado, `precisaLogin` é false e o painel
 * segue funcionando no modo local — o mesmo comportamento de antes. Assim este
 * código pode ser publicado antes de a configuração terminar.
 */
export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!isSupabaseConfigured);
  const [signingIn, setSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }

    let ativo = true;

    void supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      setSession(data.session);
      setReady(true);
    });

    // Mantém a tela em dia se a sessão expirar ou o usuário sair em outra aba.
    const { data: inscricao } = supabase.auth.onAuthStateChange((_evento, nova) => {
      if (ativo) setSession(nova);
    });

    return () => {
      ativo = false;
      inscricao.subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return false;
    setSigningIn(true);
    setError(null);

    const { error: erro } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setSigningIn(false);
    if (erro) {
      setError(friendlyAuthError(erro.message));
      return false;
    }
    return true;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  return {
    session,
    email: session?.user?.email ?? null,
    ready,
    signingIn,
    error,
    signIn,
    signOut,
    /** Só exige login quando existe banco de verdade para proteger. */
    precisaLogin: isSupabaseConfigured,
    autenticado: !isSupabaseConfigured || session !== null,
  };
}
