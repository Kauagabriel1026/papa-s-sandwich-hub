import imgLombo from "@/assets/image.png.asset.json";
import imgHamburguer from "@/assets/image-7.png.asset.json";
import imgCombo from "@/assets/image-5.png.asset.json";
import imgFrango from "@/assets/image-3.png.asset.json";
import imgAnel from "@/assets/image-2.png.asset.json";
import imgBatata from "@/assets/image-6.png.asset.json";

export type Category =
  | "promocoes"
  | "hamburguer"
  | "lombo"
  | "frango"
  | "porcoes"
  | "acai"
  | "bebidas"
  | "adicionais";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  popular?: boolean;
  badge?: string;
}

export const categories: { id: Category; label: string }[] = [
  { id: "promocoes", label: "Promoções" },
  { id: "hamburguer", label: "Hambúrguer" },
  { id: "lombo", label: "Lombo" },
  { id: "frango", label: "Filé de Frango" },
  { id: "porcoes", label: "Porções" },
  { id: "acai", label: "Açaí, Cremes e Sucos" },
  { id: "bebidas", label: "Bebidas" },
  { id: "adicionais", label: "Adicionais" },
];

/** Itens grátis em qualquer sanduíche */
export const gratis = ["Cheddar", "Cebola", "Abacaxi", "Catupiry"];

/** Adicionais de açaí (sem custo extra listado no cardápio) */
export const acaiAdicionais = [
  "Granola",
  "Leite condensado",
  "Leite em pó",
  "Bolacha Óreo",
  "Confeite (M&M's)",
  "Canudo de chocolate",
  "Morango",
  "Kiwi",
  "Banana",
  "Bis",
  "Coco ralado",
  "Paçoca",
];

/** Sabores de cremes e sucos de polpa */
export const sabores = [
  "Açaí",
  "Acabaxi",
  "Acerola",
  "Acabaxi c/ hortelã",
  "Cajá",
  "Caju",
  "Cupuaçu",
  "Uva",
  "Limão",
  "Tamarindo",
  "Morango",
  "Maracujá",
  "Graviola",
  "Manga",
];

const baseH = "Pão, salsicha, mussarela, presunto, milho, salada, batata e hambúrguer.";
const baseL = "Pão, salsicha, mussarela, presunto, milho, salada, batata e lombo.";
const baseF = "Pão, salsicha, mussarela, presunto, milho, salada, batata e filé de frango.";
const ovo = (b: string) => b.replace("salsicha,", "salsicha, ovo,");
const bacon = (b: string) => b.replace("salsicha,", "salsicha, bacon,");
const baconOvo = (b: string) => b.replace("salsicha,", "salsicha, bacon, ovo,");
const rango = (b: string) => b.replace("salsicha,", "salsicha, frango,");
const rangoOvo = (b: string) => b.replace("salsicha,", "salsicha, frango, ovo,");

export const menuItems: MenuItem[] = [
  // ── Promoções ─────────────────────────────
  {
    id: "promo-xtudo-combo",
    name: "X-Tudo + Coca Lata + Batata P",
    description: "A combinação que todo mundo ama: X-Tudo, Coca-Cola lata 350ml e batata pequena.",
    price: 40.0,
    category: "promocoes",
    image: imgCombo.url,
    popular: true,
    badge: "Preço especial",
  },
  {
    id: "promo-xtudo-refri",
    name: "X-Tudo + Refrigerante Lata",
    description: "X-Tudo completo com refrigerante lata 350ml.",
    price: 28.0,
    category: "promocoes",
    image: imgHamburguer.url,
    popular: true,
    badge: "Promoção",
  },

  // ── Hambúrguer ─────────────────────────────
  { id: "hb-simples", name: "X-Simples", description: baseH, price: 19.5, category: "hamburguer", image: imgHamburguer.url },
  { id: "hb-especial", name: "X-Especial", description: ovo(baseH), price: 20.5, category: "hamburguer" },
  { id: "hb-bacon-simples", name: "X-Bacon Simples", description: bacon(baseH), price: 21.5, category: "hamburguer" },
  { id: "hb-bacon-especial", name: "X-Bacon Especial", description: baconOvo(baseH), price: 22.5, category: "hamburguer" },
  { id: "hb-rango-simples", name: "X-Rango Simples", description: rango(baseH), price: 20.5, category: "hamburguer" },
  { id: "hb-rango-especial", name: "X-Rango Especial", description: rangoOvo(baseH), price: 21.5, category: "hamburguer" },
  { id: "hb-tudo", name: "X-Tudo", description: baconOvo(baseH), price: 23.0, category: "hamburguer", popular: true },

  // ── Lombo ─────────────────────────────
  { id: "lb-simples", name: "X-Simples", description: baseL, price: 21.5, category: "lombo", image: imgLombo.url },
  { id: "lb-especial", name: "X-Especial", description: ovo(baseL), price: 22.5, category: "lombo" },
  { id: "lb-bacon-simples", name: "X-Bacon Simples", description: bacon(baseL), price: 23.5, category: "lombo" },
  { id: "lb-bacon-especial", name: "X-Bacon Especial", description: baconOvo(baseL), price: 24.5, category: "lombo" },
  { id: "lb-rango-simples", name: "X-Rango Simples", description: rango(baseL), price: 22.5, category: "lombo" },
  { id: "lb-rango-especial", name: "X-Rango Especial", description: rangoOvo(baseL), price: 24.5, category: "lombo" },
  { id: "lb-tudo", name: "X-Tudo", description: baconOvo(baseL), price: 25.0, category: "lombo", popular: true },

  // ── Filé de Frango ─────────────────────────────
  { id: "fr-simples", name: "X-Simples", description: baseF, price: 20.5, category: "frango", image: imgFrango.url },
  { id: "fr-especial", name: "X-Especial", description: ovo(baseF), price: 21.5, category: "frango" },
  { id: "fr-bacon-simples", name: "X-Bacon Simples", description: bacon(baseF), price: 22.5, category: "frango" },
  { id: "fr-bacon-especial", name: "X-Bacon Especial", description: baconOvo(baseF), price: 23.5, category: "frango" },
  { id: "fr-rango-simples", name: "X-Rango Simples", description: rango(baseF), price: 21.5, category: "frango" },
  { id: "fr-rango-especial", name: "X-Rango Especial", description: rangoOvo(baseF), price: 22.5, category: "frango" },
  { id: "fr-tudo", name: "X-Tudo", description: baconOvo(baseF), price: 24.0, category: "frango" },

  // ── Porções ─────────────────────────────
  { id: "bt-simples-p", name: "Batata Simples (P)", description: "Porção pequena de batata frita.", price: 16.0, category: "porcoes" },
  { id: "bt-recheada-p", name: "Batata Recheada (P)", description: "Acompanha cheddar, mussarela, bacon e calabresa.", price: 22.0, category: "porcoes", image: imgBatata.url, popular: true },
  { id: "bt-simples-m", name: "Batata Simples (M)", description: "Porção média de batata frita.", price: 19.0, category: "porcoes" },
  { id: "bt-recheada-m", name: "Batata Recheada (M)", description: "Acompanha cheddar, mussarela, bacon e calabresa.", price: 24.5, category: "porcoes" },
  { id: "bt-simples-g", name: "Batata Simples (G)", description: "Porção grande de batata frita.", price: 21.5, category: "porcoes" },
  { id: "bt-recheada-g", name: "Batata Recheada (G)", description: "Acompanha cheddar, mussarela, bacon e calabresa.", price: 27.0, category: "porcoes" },
  { id: "cebola-p", name: "Cebola Empanada (P)", description: "Porção pequena de anéis de cebola empanados.", price: 16.0, category: "porcoes", image: imgAnel.url },
  { id: "cebola-m", name: "Cebola Empanada (M)", description: "Porção média de anéis de cebola empanados.", price: 23.0, category: "porcoes" },
  { id: "nuggets-p", name: "Nuggets (P)", description: "Porção pequena de nuggets de frango.", price: 12.0, category: "porcoes" },

  // ── Açaí, cremes e sucos ─────────────────────────────
  { id: "acai-350", name: "Açaí 350ml", description: "Monte com os adicionais da casa.", price: 20.0, category: "acai" },
  { id: "acai-500", name: "Açaí 500ml", description: "Monte com os adicionais da casa.", price: 25.0, category: "acai", popular: true },
  { id: "creme-500", name: "Creme 500ml", description: "Escolha o sabor na observação do pedido.", price: 13.0, category: "acai" },
  { id: "suco-polpa-500", name: "Suco de Polpa 500ml", description: "Escolha o sabor na observação do pedido.", price: 10.5, category: "acai" },

  // ── Bebidas ─────────────────────────────
  { id: "coca-2l", name: "Coca-Cola 2L", description: "Refrigerante gelado.", price: 14.0, category: "bebidas" },
  { id: "coca-15", name: "Coca-Cola 1,5L", description: "Refrigerante gelado.", price: 12.0, category: "bebidas" },
  { id: "sukita-2l", name: "Sukita 2L", description: "Refrigerante gelado.", price: 10.0, category: "bebidas" },
  { id: "guarana-2l", name: "Guaraná 2L", description: "Refrigerante gelado.", price: 11.0, category: "bebidas" },
  { id: "guarana-15", name: "Guaraná 1,5L", description: "Refrigerante gelado.", price: 10.0, category: "bebidas" },
  { id: "refri-lata", name: "Refrigerante Lata 350ml", description: "Coca-Cola, Guaraná ou Fanta.", price: 6.0, category: "bebidas" },
  { id: "suco-lafruit", name: "Suco Lafruit", description: "Suco pronto gelado.", price: 9.0, category: "bebidas" },

  // ── Adicionais ─────────────────────────────
  { id: "ad-hamburguer", name: "Hambúrguer", description: "Adicional.", price: 4.0, category: "adicionais" },
  { id: "ad-presunto", name: "Presunto", description: "Adicional.", price: 3.0, category: "adicionais" },
  { id: "ad-calabresa", name: "Calabresa", description: "Adicional.", price: 4.0, category: "adicionais" },
  { id: "ad-mussarela", name: "Mussarela", description: "Adicional.", price: 3.5, category: "adicionais" },
  { id: "ad-salsicha", name: "Salsicha", description: "Adicional.", price: 3.0, category: "adicionais" },
  { id: "ad-frango", name: "Frango", description: "Adicional.", price: 4.0, category: "adicionais" },
  { id: "ad-lombo", name: "Lombo", description: "Adicional.", price: 5.0, category: "adicionais" },
  { id: "ad-bacon", name: "Bacon", description: "Adicional.", price: 4.5, category: "adicionais" },
  { id: "ad-ovo", name: "Ovo", description: "Adicional.", price: 2.0, category: "adicionais" },
];
