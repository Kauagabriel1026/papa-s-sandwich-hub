import { formatCents, type MethodTotal } from "@/lib/finance";
import { METHOD_COLOR, METHOD_SHORT } from "@/lib/viz";

interface PaymentBreakdownProps {
  totals: MethodTotal[];
}

/**
 * Barras horizontais em HTML puro — nada de biblioteca de gráfico aqui.
 * São quatro valores; uma biblioteca só acrescentaria peso e tiraria o
 * controle sobre os rótulos, que precisam ficar SEMPRE visíveis: duas destas
 * cores têm contraste baixo contra o fundo claro, então o número escrito ao
 * lado é o que garante a leitura de quem não distingue bem as cores.
 */
export function PaymentBreakdown({ totals }: PaymentBreakdownProps) {
  const hasData = totals.some((t) => t.cents > 0);

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header>
        <h2 className="text-base font-semibold text-card-foreground">
          Entradas por forma de pagamento
        </h2>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Quanto do faturamento veio de cada meio.
        </p>
      </header>

      {!hasData ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Nenhuma venda registrada neste período.
        </p>
      ) : (
        <ul className="mt-5 space-y-4">
          {totals.map((total) => (
            <li key={total.method}>
              <div className="flex items-baseline justify-between gap-3 text-sm">
                <span className="flex items-center gap-2 font-medium text-foreground">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: METHOD_COLOR[total.method] }}
                  />
                  {METHOD_SHORT[total.method]}
                </span>
                <span className="flex items-baseline gap-2 tabular-nums">
                  <span className="font-semibold text-foreground">{formatCents(total.cents)}</span>
                  <span className="w-9 text-right text-xs text-muted-foreground">
                    {Math.round(total.share * 100)}%
                  </span>
                </span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-secondary">
                {/* A largura é a FATIA DO TOTAL, não a fração do maior valor.
                    Como o número ao lado diz "40%", a barra precisa ocupar 40%
                    da linha — se ela fosse escalada pelo maior, o líder viraria
                    uma barra cheia e o gráfico contradiria o próprio rótulo. */}
                <div
                  className="h-full rounded-full transition-[width] duration-500"
                  style={{
                    width: `${Math.max(total.share * 100, total.cents > 0 ? 2 : 0)}%`,
                    backgroundColor: METHOD_COLOR[total.method],
                  }}
                />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {total.count === 0
                  ? "sem vendas"
                  : total.count === 1
                    ? "1 venda"
                    : `${total.count} vendas`}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
