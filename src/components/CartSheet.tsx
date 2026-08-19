import { Minus, Plus, ShoppingBag, Trash2, Send, MapPin, User, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { type CartItem } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/format";
import { useState } from "react";

interface CartSheetProps {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  onUpdateObservation: (itemId: string, observation: string) => void;
  onClear: () => void;
}

const WHATSAPP_NUMBER = "5562995513839";

export function CartSheet({
  items,
  totalItems,
  totalPrice,
  onUpdateQuantity,
  onRemove,
  onUpdateObservation,
  onClear,
}: CartSheetProps) {
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Pix");
  const [open, setOpen] = useState(false);

  const handleSendOrder = () => {
    if (items.length === 0) return;

    const orderLines = items
      .map(
        (i) =>
          [
            `${i.quantity}x ${i.item.name} — ${formatCurrency(i.unitPrice * i.quantity)}`,
            i.flavor ? `   • Sabor: ${i.flavor}` : "",
            i.removed.length ? `   • Sem: ${i.removed.join(", ")}` : "",
            i.added.length
              ? `   • Adicionais: ${i.added
                  .map((e) => (e.price > 0 ? `${e.name} (+${formatCurrency(e.price)})` : e.name))
                  .join(", ")}`
              : "",
            i.observation ? `   • Obs.: ${i.observation}` : "",
          ]
            .filter(Boolean)
            .join("\n")
      )
      .join("\n");

    const message = [
      `Olá! Gostaria de fazer um pedido na PapaLéguas Burguer:`,
      "",
      orderLines,
      "",
      `*Total:* ${formatCurrency(totalPrice)}`,
      "",
      `*Nome:* ${customerName || "Não informado"}`,
      `*Endereço:* ${address || "Retirada no local"}`,
      `*Pagamento:* ${paymentMethod}`,
    ].join("\n");

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95">
          <ShoppingBag className="h-5 w-5" />
          Pedido
          {totalItems > 0 && (
            <Badge className="ml-1 bg-primary-foreground text-primary hover:bg-primary-foreground">
              {totalItems}
            </Badge>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Seu pedido
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Seu carrinho está vazio.</p>
            <p className="text-sm text-muted-foreground">
              Adicione itens do cardápio para começar.
            </p>
          </div>
        ) : (
          <>
            <ScrollArea className="my-4 flex-1 pr-2">
              <div className="space-y-4">
                {items.map((cartItem) => (
                  <div key={cartItem.lineId} className="rounded-xl border border-border bg-card p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground">
                          {cartItem.item.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {formatCurrency(cartItem.unitPrice)} cada
                        </p>
                        {cartItem.flavor && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            Sabor: {cartItem.flavor}
                          </p>
                        )}
                        {cartItem.removed.length > 0 && (
                          <p className="mt-1 text-xs text-destructive">
                            Sem: {cartItem.removed.join(", ")}
                          </p>
                        )}
                        {cartItem.added.length > 0 && (
                          <p className="mt-1 text-xs text-brand">
                            + {cartItem.added.map((e) => e.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onRemove(cartItem.lineId)}
                        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        aria-label="Remover item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(cartItem.lineId, cartItem.quantity - 1)}
                        className="rounded-md border border-border p-1.5 text-foreground transition-colors hover:bg-accent"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-6 text-center font-medium tabular-nums">
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(cartItem.lineId, cartItem.quantity + 1)}
                        className="rounded-md border border-border p-1.5 text-foreground transition-colors hover:bg-accent"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <span className="ml-auto font-semibold text-foreground">
                        {formatCurrency(cartItem.unitPrice * cartItem.quantity)}
                      </span>
                    </div>

                    <Textarea
                      value={cartItem.observation}
                      onChange={(e) => onUpdateObservation(cartItem.lineId, e.target.value)}
                      placeholder="Observação: sem cebola, ponto da carne..."
                      className="mt-3 min-h-[60px] resize-none text-sm"
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>

            <Separator />

            <div className="space-y-3 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="flex items-center gap-1.5 text-sm font-medium">
                  <User className="h-3.5 w-3.5" /> Nome
                </Label>
                <Input
                  id="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Seu nome"
                  maxLength={60}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="address" className="flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5" /> Endereço de entrega
                </Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Rua, número, bairro e ponto de referência"
                  maxLength={300}
                  className="min-h-[60px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  Deixe em branco para retirada no local.
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="payment" className="flex items-center gap-1.5 text-sm font-medium">
                  <CreditCard className="h-3.5 w-3.5" /> Forma de pagamento
                </Label>
                <Input
                  id="payment"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  placeholder="Pix, dinheiro, cartão..."
                  maxLength={30}
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatCurrency(totalPrice)}</span>
              </div>

              <Button
                onClick={handleSendOrder}
                className="w-full gap-2 bg-[#25D366] text-white hover:bg-[#1DA851]"
                size="lg"
              >
                <Send className="h-4 w-4" />
                Enviar pedido pelo WhatsApp
              </Button>

              <Button
                variant="ghost"
                onClick={onClear}
                className="w-full text-muted-foreground hover:text-destructive"
              >
                Limpar pedido
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
