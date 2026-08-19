import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { acaiAdicionais, sabores, type MenuItem } from "@/data/menu";
import { formatCurrency } from "@/lib/format";
import {
  freeExtras,
  paidExtras,
  parseIngredients,
  isSandwich,
  isAcai,
  needsFlavor,
  type ExtraOption,
} from "@/lib/customize";
import { type CustomizationInput } from "@/hooks/use-cart";

interface ItemCustomizerProps {
  item: MenuItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (item: MenuItem, custom: CustomizationInput) => void;
}

export function ItemCustomizer({ item, open, onOpenChange, onConfirm }: ItemCustomizerProps) {
  const [removed, setRemoved] = useState<string[]>([]);
  const [added, setAdded] = useState<ExtraOption[]>([]);
  const [flavor, setFlavor] = useState<string>("");
  const [observation, setObservation] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Reinicia as escolhas sempre que abrir com outro item
  const [lastId, setLastId] = useState<string | null>(null);
  if (item && open && lastId !== item.id) {
    setLastId(item.id);
    setRemoved([]);
    setAdded([]);
    setFlavor("");
    setObservation("");
    setQuantity(1);
  }

  const ingredients = useMemo(
    () => (item && isSandwich(item) ? parseIngredients(item.description) : []),
    [item]
  );

  const acaiOptions: ExtraOption[] = useMemo(
    () => acaiAdicionais.map((name) => ({ name, price: 0 })),
    []
  );

  if (!item) return null;

  const unitPrice = item.price + added.reduce((sum, e) => sum + e.price, 0);

  const toggleRemoved = (name: string) =>
    setRemoved((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );

  const toggleAdded = (option: ExtraOption) =>
    setAdded((prev) =>
      prev.some((e) => e.name === option.name)
        ? prev.filter((e) => e.name !== option.name)
        : [...prev, option]
    );

  const handleConfirm = () => {
    onConfirm(item, { quantity, observation, removed, added, flavor: flavor || undefined });
    onOpenChange(false);
  };

  const ExtraRow = ({ option }: { option: ExtraOption }) => {
    const checked = added.some((e) => e.name === option.name);
    return (
      <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-accent">
        <span className="flex items-center gap-2">
          <Checkbox checked={checked} onCheckedChange={() => toggleAdded(option)} />
          {option.name}
        </span>
        <span className={option.price > 0 ? "font-medium text-foreground" : "text-brand"}>
          {option.price > 0 ? `+ ${formatCurrency(option.price)}` : "Grátis"}
        </span>
      </label>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Monte seu {item.name}</DialogTitle>
          <DialogDescription>{item.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="-mx-2 flex-1 px-2">
          <div className="space-y-5 py-1">
            {isSandwich(item) && ingredients.length > 0 && (
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Retirar ingredientes</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {ingredients.map((ing) => (
                    <label
                      key={ing}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <Checkbox
                        checked={removed.includes(ing)}
                        onCheckedChange={() => toggleRemoved(ing)}
                      />
                      <span className={removed.includes(ing) ? "line-through opacity-60" : ""}>
                        Sem {ing.toLowerCase()}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            )}

            {isSandwich(item) && (
              <>
                <Separator />
                <section className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Adicionais grátis</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {freeExtras.map((o) => (
                      <ExtraRow key={o.name} option={o} />
                    ))}
                  </div>
                </section>
                <section className="space-y-2">
                  <h4 className="text-sm font-semibold text-foreground">Adicionais pagos</h4>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {paidExtras.map((o) => (
                      <ExtraRow key={o.name} option={o} />
                    ))}
                  </div>
                </section>
              </>
            )}

            {isAcai(item) && (
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">
                  Adicionais do açaí (grátis)
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {acaiOptions.map((o) => (
                    <ExtraRow key={o.name} option={o} />
                  ))}
                </div>
              </section>
            )}

            {needsFlavor(item) && (
              <section className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Escolha o sabor</h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {sabores.map((s) => (
                    <label
                      key={s}
                      className="flex cursor-pointer items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
                    >
                      <input
                        type="radio"
                        name="sabor"
                        checked={flavor === s}
                        onChange={() => setFlavor(s)}
                        className="accent-[hsl(var(--primary))]"
                      />
                      {s}
                    </label>
                  ))}
                </div>
              </section>
            )}

            <section className="space-y-2">
              <Label htmlFor="obs" className="text-sm font-semibold">
                Observação
              </Label>
              <Textarea
                id="obs"
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Ex.: capricha na batata palha, maionese à parte..."
                className="min-h-[60px] resize-none text-sm"
                maxLength={200}
              />
            </section>
          </div>
        </ScrollArea>

        <Separator />

        <DialogFooter className="flex-row items-center justify-between gap-3 sm:justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="rounded-md border border-border p-1.5 transition-colors hover:bg-accent"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-medium tabular-nums">{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="rounded-md border border-border p-1.5 transition-colors hover:bg-accent"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={needsFlavor(item) && !flavor}
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingBag className="h-4 w-4" />
            Adicionar • {formatCurrency(unitPrice * quantity)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
