import { useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAYMENT_METHODS, parseAmount, type PaymentMethod } from "@/lib/payment";
import { EXPENSE_CATEGORIES, formatCents, toCents, type ExpenseCategory } from "@/lib/finance";
import { METHOD_COLOR, METHOD_SHORT } from "@/lib/viz";

interface QuickEntryProps {
  /** Devolve true quando o lançamento foi mesmo gravado. */
  onAddSale: (amountCents: number, method: PaymentMethod, note: string) => Promise<boolean>;
  onAddExpense: (amountCents: number, category: ExpenseCategory, note: string) => Promise<boolean>;
  salvando?: boolean;
}

type Mode = "venda" | "despesa";

/**
 * Lançamento rápido. Esta é a tela que vai ser usada em pé, atrás do balcão,
 * com o celular numa mão só — por isso os alvos de toque são grandes, a forma
 * de pagamento são botões (não uma lista escondida) e o campo de valor já vem
 * com o teclado numérico.
 */
export function QuickEntry({ onAddSale, onAddExpense, salvando = false }: QuickEntryProps) {
  const [mode, setMode] = useState<Mode>("venda");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>("Pix");
  const [category, setCategory] = useState<ExpenseCategory>("Insumos");
  const [note, setNote] = useState("");

  const parsed = parseAmount(amount);
  const isValid = parsed !== null && parsed > 0 && !salvando;

  /**
   * Só avisa "registrada" e limpa o formulário DEPOIS de o lançamento ser
   * confirmado. Se a internet cair no meio, o valor continua na tela para o
   * seu pai tentar de novo, em vez de sumir com a impressão de que foi salvo.
   */
  const handleSubmit = async () => {
    if (!isValid) return;
    const cents = toCents(parsed);

    const ok =
      mode === "venda"
        ? await onAddSale(cents, method, note.trim())
        : await onAddExpense(cents, category, note.trim());

    if (!ok) {
      toast.error("Não foi possível registrar", {
        description: "O valor continua aqui. Confira a internet e tente de novo.",
      });
      return;
    }

    if (mode === "venda") {
      toast.success(`Venda de ${formatCents(cents)} registrada`, {
        description: METHOD_SHORT[method],
      });
    } else {
      toast.success(`Gasto de ${formatCents(cents)} registrado`, { description: category });
    }

    setAmount("");
    setNote("");
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      {/* Venda ou gasto */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setMode("venda")}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
            mode === "venda"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-accent"
          }`}
        >
          <Plus className="h-4 w-4" />
          Entrou
        </button>
        <button
          onClick={() => setMode("despesa")}
          className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors ${
            mode === "despesa"
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-border bg-background text-muted-foreground hover:bg-accent"
          }`}
        >
          <Minus className="h-4 w-4" />
          Saiu
        </button>
      </div>

      {/* Valor */}
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="amount" className="text-sm font-medium">
          Valor
        </Label>
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
            R$
          </span>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") void handleSubmit();
            }}
            placeholder="0,00"
            inputMode="decimal"
            maxLength={10}
            autoComplete="off"
            className="h-14 pl-12 text-2xl font-bold tabular-nums"
          />
        </div>
      </div>

      {/* Forma de pagamento (venda) ou categoria (gasto) */}
      {mode === "venda" ? (
        <div className="mt-4 space-y-1.5">
          <Label className="text-sm font-medium">Forma de pagamento</Label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((m) => {
              const active = method === m;
              return (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  aria-pressed={active}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "border-foreground bg-accent text-foreground"
                      : "border-border bg-background text-muted-foreground hover:bg-accent"
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: METHOD_COLOR[m] }}
                  />
                  {METHOD_SHORT[m]}
                  {active && <Check className="ml-auto h-4 w-4" />}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-1.5">
          <Label htmlFor="category" className="text-sm font-medium">
            Categoria do gasto
          </Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ExpenseCategory)}>
            <SelectTrigger id="category" className="h-12">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {EXPENSE_CATEGORIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Observação */}
      <div className="mt-4 space-y-1.5">
        <Label htmlFor="note" className="text-sm font-medium">
          Observação <span className="font-normal text-muted-foreground">(opcional)</span>
        </Label>
        <Input
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") void handleSubmit();
          }}
          placeholder={mode === "venda" ? "Ex.: mesa 3, delivery..." : "Ex.: caixa de pão"}
          maxLength={60}
        />
      </div>

      <Button
        onClick={() => void handleSubmit()}
        disabled={!isValid}
        size="lg"
        className="mt-4 h-14 w-full text-base font-semibold"
      >
        {salvando ? "Salvando..." : mode === "venda" ? "Registrar venda" : "Registrar gasto"}
        {isValid && <span className="ml-1 tabular-nums">· {formatCents(toCents(parsed))}</span>}
      </Button>
    </div>
  );
}
