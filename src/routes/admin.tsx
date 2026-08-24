import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, Receipt, TrendingUp, TrendingDown, Wallet, Trophy } from "lucide-react";

import { useLedger } from "@/hooks/use-ledger";
import {
  PERIODS,
  PERIOD_LABELS,
  bestDay,
  daysInPeriod,
  filterByPeriod,
  formatCents,
  formatDayLong,
  summarize,
  totalsByCategory,
  totalsByDay,
  totalsByMethod,
  type Period,
} from "@/lib/finance";
import { STORE_NAME } from "@/lib/site";
import { StatCard } from "@/components/admin/StatCard";
import { QuickEntry } from "@/components/admin/QuickEntry";
import { PaymentBreakdown } from "@/components/admin/PaymentBreakdown";
import { DailyChart } from "@/components/admin/DailyChart";
import { EntryList } from "@/components/admin/EntryList";
import { BackupPanel } from "@/components/admin/BackupPanel";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: `Painel — ${STORE_NAME}` },
      // Painel interno não deve aparecer em busca do Google.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const { entries, ready, storageFailed, addSale, addExpense, removeEntry, importEntries } =
    useLedger();
  const [period, setPeriod] = useState<Period>("hoje");

  const view = useMemo(() => {
    const filtered = filterByPeriod(entries, period);
    return {
      filtered,
      summary: summarize(filtered),
      methods: totalsByMethod(filtered),
      categories: totalsByCategory(filtered),
      days: totalsByDay(filtered, daysInPeriod(period)),
    };
  }, [entries, period]);

  const { summary, methods, categories, days, filtered } = view;
  const top = bestDay(days);
  const topExpense = [...categories].sort((a, b) => b.cents - a.cents)[0];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <h1 className="text-lg font-bold tracking-tight text-foreground">Painel de controle</h1>
            <p className="text-xs text-muted-foreground">{STORE_NAME}</p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-1.5 rounded-full border border-border px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Ver o site</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-4 px-4 py-5">
        {storageFailed && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
            Não foi possível salvar neste navegador. Verifique se ele não está em modo anônimo ou
            sem espaço — os lançamentos podem se perder ao fechar a página.
          </p>
        )}

        {/* Lançamento fica no topo: é a ação feita 30 vezes por noite. */}
        <QuickEntry onAddSale={addSale} onAddExpense={addExpense} />

        {/* Filtro de período, numa linha só, acima dos números. */}
        <div className="flex flex-wrap gap-2">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              aria-pressed={period === p}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                period === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>

        {!ready ? (
          <div className="space-y-4" aria-busy>
            <div className="h-28 animate-pulse rounded-2xl bg-secondary" />
            <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
          </div>
        ) : (
          <>
            {/* Saldo é o número herói: é o que responde "a noite foi boa?" */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="sm:col-span-2">
                <StatCard
                  label="Saldo do período"
                  value={formatCents(summary.balanceCents)}
                  hint={`${formatCents(summary.revenueCents)} em vendas − ${formatCents(summary.expenseCents)} em gastos`}
                  icon={Wallet}
                  size="hero"
                  tone={summary.balanceCents < 0 ? "negative" : "positive"}
                />
              </div>
              <StatCard
                label="Faturamento"
                value={formatCents(summary.revenueCents)}
                hint={summary.saleCount === 1 ? "1 venda" : `${summary.saleCount} vendas`}
                icon={TrendingUp}
              />
              <StatCard
                label="Gastos"
                value={formatCents(summary.expenseCents)}
                hint={
                  topExpense && topExpense.cents > 0
                    ? `maior: ${topExpense.category}`
                    : "nenhum gasto lançado"
                }
                icon={TrendingDown}
              />
              <StatCard
                label="Ticket médio"
                value={formatCents(summary.averageTicketCents)}
                hint="por venda registrada"
                icon={Receipt}
              />
              <StatCard
                label="Melhor dia"
                value={top ? formatCents(top.revenueCents) : "—"}
                hint={top ? formatDayLong(top.day) : "sem vendas no período"}
                icon={Trophy}
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <PaymentBreakdown totals={methods} />
              <DailyChart data={days} />
            </div>

            <EntryList entries={filtered} onRemove={removeEntry} />

            <BackupPanel entries={entries} onImport={importEntries} />
          </>
        )}
      </main>
    </div>
  );
}
