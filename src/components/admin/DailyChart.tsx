import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { formatCents, formatCentsShort, formatDayLong, type DayTotal } from "@/lib/finance";
import { IN_COLOR, OUT_COLOR } from "@/lib/viz";

interface DailyChartProps {
  data: DayTotal[];
}

interface TooltipPayloadItem {
  payload: DayTotal;
}

/** Tooltip próprio: o padrão do recharts vem em inglês e sem formato de moeda. */
function ChartTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayloadItem[] }) {
  if (!active || !payload?.length) return null;
  const day = payload[0]!.payload;
  const balance = day.revenueCents - day.expenseCents;

  return (
    <div className="rounded-xl border border-border bg-popover p-3 text-sm shadow-lg">
      <p className="font-semibold text-popover-foreground">{formatDayLong(day.day)}</p>
      <dl className="mt-2 space-y-1">
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: IN_COLOR }} />
            Entradas
          </dt>
          <dd className="font-medium tabular-nums text-popover-foreground">
            {formatCents(day.revenueCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-6">
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: OUT_COLOR }} />
            Saídas
          </dt>
          <dd className="font-medium tabular-nums text-popover-foreground">
            {formatCents(day.expenseCents)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-6 border-t border-border pt-1">
          <dt className="text-muted-foreground">Saldo</dt>
          <dd
            className={`font-semibold tabular-nums ${
              balance < 0 ? "text-destructive" : "text-popover-foreground"
            }`}
          >
            {formatCents(balance)}
          </dd>
        </div>
      </dl>
    </div>
  );
}

export function DailyChart({ data }: DailyChartProps) {
  const hasData = data.some((d) => d.revenueCents > 0 || d.expenseCents > 0);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-card-foreground">Movimento por dia</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Toque numa barra para ver os valores do dia.
          </p>
        </div>
        {/* Legenda: com duas séries ela é obrigatória — a cor sozinha nunca
            pode ser a única forma de saber o que é o quê. */}
        <ul className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: IN_COLOR }} />
            Entradas
          </li>
          <li className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: OUT_COLOR }} />
            Saídas
          </li>
        </ul>
      </header>

      {!hasData ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhum lançamento neste período.
        </p>
      ) : (
        <div className="mt-4 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -12 }} barGap={2}>
              {/* Grade só na horizontal e bem discreta: ela ajuda a ler a
                  altura, não deve competir com as barras. */}
              <CartesianGrid vertical={false} stroke="var(--viz-grid)" strokeDasharray="0" />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--viz-axis)", fontSize: 11 }}
                interval="preserveStartEnd"
                minTickGap={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "var(--viz-axis)", fontSize: 11 }}
                tickFormatter={(value: number) => formatCentsShort(value)}
                width={64}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "var(--viz-grid)", fillOpacity: 0.45 }}
              />
              <Bar dataKey="revenueCents" name="Entradas" fill={IN_COLOR} radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenseCents" name="Saídas" fill={OUT_COLOR} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
