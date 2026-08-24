import { useState } from "react";
import { Trash2 } from "lucide-react";

import { formatCents, formatDayLong, formatTime, dayKey, isSale, type Entry } from "@/lib/finance";
import { METHOD_COLOR, METHOD_SHORT, OUT_COLOR } from "@/lib/viz";

interface EntryListProps {
  entries: Entry[];
  onRemove: (id: string) => void;
}

const PAGE_SIZE = 15;

/** Agrupa os lançamentos por dia, do mais recente para o mais antigo. */
function groupByDay(entries: Entry[]) {
  const groups = new Map<string, Entry[]>();
  for (const entry of entries) {
    const key = dayKey(entry.createdAt);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(entry);
  }
  return [...groups.entries()].sort(([a], [b]) => b.localeCompare(a));
}

export function EntryList({ entries, onRemove }: EntryListProps) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = entries.slice(0, visible);
  const groups = groupByDay(shown);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="text-base font-semibold text-card-foreground">Lançamentos</h2>
        <span className="text-sm tabular-nums text-muted-foreground">
          {entries.length} no período
        </span>
      </header>

      {entries.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nada lançado ainda. Use o formulário acima para registrar a primeira venda.
        </p>
      ) : (
        <>
          <div className="mt-4 space-y-5">
            {groups.map(([day, dayEntries]) => {
              const dayRevenue = dayEntries
                .filter(isSale)
                .reduce((sum, e) => sum + e.amountCents, 0);

              return (
                <div key={day}>
                  <div className="flex items-baseline justify-between gap-3 border-b border-border pb-1.5">
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {formatDayLong(day)}
                    </h3>
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {formatCents(dayRevenue)} em vendas
                    </span>
                  </div>

                  <ul className="divide-y divide-border">
                    {dayEntries.map((entry) => {
                      const sale = isSale(entry);
                      const color = sale ? METHOD_COLOR[entry.method] : OUT_COLOR;
                      const label = sale ? METHOD_SHORT[entry.method] : entry.category;

                      return (
                        <li key={entry.id} className="flex items-center gap-3 py-2.5">
                          <span
                            className="h-8 w-1 shrink-0 rounded-full"
                            style={{ backgroundColor: color }}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-foreground">
                              {label}
                              {entry.note && (
                                <span className="font-normal text-muted-foreground">
                                  {" "}
                                  · {entry.note}
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatTime(entry.createdAt)} · {sale ? "venda" : "gasto"}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 text-sm font-semibold tabular-nums ${
                              sale ? "text-foreground" : "text-destructive"
                            }`}
                          >
                            {sale ? "+" : "−"} {formatCents(entry.amountCents)}
                          </span>
                          <button
                            onClick={() => onRemove(entry.id)}
                            aria-label={`Excluir lançamento de ${formatCents(entry.amountCents)}`}
                            className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>

          {visible < entries.length && (
            <button
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
              className="mt-4 w-full rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Ver mais ({entries.length - visible} restantes)
            </button>
          )}
        </>
      )}
    </section>
  );
}
