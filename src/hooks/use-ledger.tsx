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
