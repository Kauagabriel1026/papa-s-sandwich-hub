import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Phone, MapPin, ChevronDown, CalendarClock } from "lucide-react";

import { menuItems, gratis, acaiAdicionais, sabores, type Category } from "@/data/menu";
import { useCart } from "@/hooks/use-cart";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartSheet } from "@/components/CartSheet";
import { ItemCustomizer } from "@/components/ItemCustomizer";
import { OpenStatusBadge } from "@/components/OpenStatusBadge";
import { ShareButton } from "@/components/ShareButton";
import { type MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { useWeekday } from "@/hooks/use-weekday";
import { isAvailableOn, nextAvailabilityLabel } from "@/lib/schedule";
import { PHONE_DISPLAY, STORE_NAME, TEL_URL, WHATSAPP_URL } from "@/lib/site";
import heroBurger from "@/assets/image-7.png.asset.json";
import mascote from "@/assets/image-17.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PapaLéguas Burguer — Cardápio Digital" },
      {
        name: "description",
        content:
          "Cardápio digital da PapaLéguas Burguer. Monte seu pedido e envie direto pelo WhatsApp.",
      },
      { property: "og:title", content: "PapaLéguas Burguer — Cardápio Digital" },
      {
        property: "og:description",
        content: "Sanduíches artesanais, combos, batatas e açaí. Peça agora pelo WhatsApp!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeCategory, setActiveCategory] = useState<Category>("promocoes");
  const [customizingItem, setCustomizingItem] = useState<MenuItem | null>(null);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const openCustomizer = (item: MenuItem) => {
    setCustomizingItem(item);
    setCustomizerOpen(true);
  };
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateObservation,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const weekday = useWeekday();

  /**
   * Separa os itens da categoria em dois grupos: os que estão à venda hoje e os
   * que têm dia marcado e não é hoje. Os de fora não somem em silêncio — eles
   * viram o aviso de "volta na segunda" logo abaixo da lista, que dá ao cliente
   * um motivo para voltar em vez de só uma ausência inexplicada.
   */
  const { availableItems, unavailableItems } = useMemo(() => {
    const ofCategory = menuItems.filter((item) => item.category === activeCategory);
    return {
      availableItems: ofCategory.filter((item) => isAvailableOn(item.availableWeekdays, weekday)),
      unavailableItems: ofCategory.filter(
        (item) => !isAvailableOn(item.availableWeekdays, weekday),
      ),
    };
  }, [activeCategory, weekday]);

  /** Agrupa por quando volta, para não repetir a mesma frase três vezes. */
  const returnGroups = useMemo(() => {
    const groups = new Map<string, number>();
    for (const item of unavailableItems) {
      const label = nextAvailabilityLabel(item.availableWeekdays, weekday);
      if (!label) continue;
      groups.set(label, (groups.get(label) ?? 0) + 1);
    }
    return [...groups.entries()];
  }, [unavailableItems, weekday]);

  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background sm:bg-background/80 sm:backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <img
              src={mascote.url}
              alt="Mascote PapaLéguas Burguer"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary"
            />
            <span className="text-lg font-bold tracking-tight text-foreground">
              PapaLéguas <span className="text-primary">Burguer</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ShareButton compact />
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-secondary/50 px-4 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-10 md:grid-cols-2">
          <div className="order-2 md:order-1">
            <span className="inline-flex items-center rounded-full bg-brand-subtle px-3 py-1 text-sm font-medium text-brand">
              Cardápio Digital
            </span>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Sanduíches artesanais do seu jeito
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted-foreground">
              Monte seu pedido na PapaLéguas Burguer e envie direto pelo WhatsApp. Rápido, fácil e
              sem complicação.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button
                onClick={scrollToMenu}
                size="lg"
                className="gap-2 rounded-full bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Ver cardápio
                <ChevronDown className="h-4 w-4" />
              </Button>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Phone className="h-4 w-4" />
                Falar no WhatsApp
              </a>
              <ShareButton />
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <OpenStatusBadge />
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Retirada ou entrega</span>
              </div>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              <div className="absolute -inset-4 hidden rounded-full bg-brand/10 blur-3xl sm:block" />
              <img
                src={mascote.url}
                alt="Mascote PapaLéguas Burguer"
                className="absolute -left-6 -top-8 z-20 hidden h-28 w-28 rounded-full border-4 border-background object-cover shadow-xl sm:block"
              />
              <img
                src={heroBurger.url}
                alt="Hambúrguer artesanal da PapaLéguas Burguer"
                className="relative z-10 w-full max-w-md rounded-3xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <main id="cardapio" className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Nosso cardápio</h2>
          <p className="mt-2 text-muted-foreground">Escolha seus favoritos e monte seu pedido.</p>
          <p className="mx-auto mt-3 max-w-md rounded-full bg-brand-subtle px-4 py-2 text-sm font-medium text-brand">
            Grátis em todos os sanduíches: {gratis.join(", ")}
          </p>
        </div>

        <div className="sticky top-[72px] z-30 -mx-4 bg-background px-4 py-3 sm:bg-background/95 sm:backdrop-blur-md">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        {activeCategory === "acai" && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground">Adicionais do açaí</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {acaiAdicionais.join(" • ")}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold text-card-foreground">Sabores de cremes e sucos</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {sabores.join(" • ")}
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {availableItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={addItem} onCustomize={openCustomizer} />
          ))}
        </div>

        {availableItems.length === 0 && returnGroups.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            Nenhum item encontrado nesta categoria.
          </div>
        )}

        {returnGroups.length > 0 && (
          <div
            className={`rounded-2xl border border-dashed border-border bg-secondary/40 p-5 text-center ${
              availableItems.length > 0 ? "mt-6" : "mt-8"
            }`}
          >
            <CalendarClock className="mx-auto h-5 w-5 text-primary" />
            <ul className="mt-2 space-y-1">
              {returnGroups.map(([label, count]) => (
                <li key={label} className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {count === 1 ? "1 promoção" : `${count} promoções`}
                  </span>{" "}
                  {count === 1 ? "volta" : "voltam"} {label}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-muted-foreground">
              Promoções com dia marcado só aparecem no dia em que valem.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 px-4 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2">
            <img
              src={mascote.url}
              alt="Mascote PapaLéguas Burguer"
              className="h-9 w-9 rounded-full object-cover ring-2 ring-primary"
            />
            <span className="text-lg font-bold text-foreground">
              PapaLéguas <span className="text-primary">Burguer</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Cardápio digital — Monte seu pedido e envie pelo WhatsApp.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <a
              href={TEL_URL}
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </a>
            <OpenStatusBadge />
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </footer>

      <ItemCustomizer
        item={customizingItem}
        open={customizerOpen}
        onOpenChange={setCustomizerOpen}
        onConfirm={(item, custom) => addItem(item, custom)}
      />

      {/* Floating cart */}
      <CartSheet
        items={items}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onUpdateQuantity={updateQuantity}
        onRemove={removeItem}
        onUpdateObservation={updateObservation}
        onClear={clearCart}
      />
    </div>
  );
}
