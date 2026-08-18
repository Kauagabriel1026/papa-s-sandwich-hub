import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Phone, Clock, MapPin, ChevronDown, Utensils } from "lucide-react";

import { menuItems, categories, type Category } from "@/data/menu";
import { useCart } from "@/hooks/use-cart";
import { CategoryTabs } from "@/components/CategoryTabs";
import { MenuItemCard } from "@/components/MenuItemCard";
import { CartSheet } from "@/components/CartSheet";
import { Button } from "@/components/ui/button";
import heroBurger from "@/assets/hero-burger.jpg";

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
        content:
          "Sanduíches artesanais, combos, batatas e açaí. Peça agora pelo WhatsApp!",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [activeCategory, setActiveCategory] = useState<Category>("hamburguer");
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

  const filteredItems = useMemo(
    () => menuItems.filter((item) => item.category === activeCategory),
    [activeCategory]
  );

  const scrollToMenu = () => {
    document.getElementById("cardapio")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              PapaLéguas <span className="text-primary">Burguer</span>
            </span>
          </div>
          <a
            href="https://wa.me/5562995513839"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <Phone className="h-4 w-4" />
            (62) 99551-3839
          </a>
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
                href="https://wa.me/5562995513839"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <Phone className="h-4 w-4" />
                Falar no WhatsApp
              </a>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" />
                <span>Aberto agora</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-primary" />
                <span>Retirada ou entrega</span>
              </div>
            </div>
          </div>

          <div className="order-1 flex justify-center md:order-2">
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-brand/10 blur-3xl" />
              <img
                src={heroBurger}
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
          <p className="mt-2 text-muted-foreground">
            Escolha seus favoritos e monte seu pedido.
          </p>
        </div>

        <div className="sticky top-[73px] z-30 -mx-4 bg-background/95 px-4 py-3 backdrop-blur-md">
          <CategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <MenuItemCard key={item.id} item={item} onAdd={addItem} />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            Nenhum item encontrado nesta categoria.
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 px-4 py-10">
        <div className="mx-auto max-w-6xl text-center">
          <div className="flex items-center justify-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Utensils className="h-3.5 w-3.5" />
            </div>
            <span className="text-lg font-bold text-foreground">
              PapaLéguas <span className="text-primary">Burguer</span>
            </span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Cardápio digital — Monte seu pedido e envie pelo WhatsApp.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <a
              href="tel:+5562995513839"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <Phone className="h-4 w-4" />
              (62) 99551-3839
            </a>
          </div>
          <p className="mt-6 text-xs text-muted-foreground">
            © {new Date().getFullYear()} PapaLéguas Burguer. Todos os direitos reservados.
          </p>
        </div>
      </footer>

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
