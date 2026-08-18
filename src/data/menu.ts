import imgLombo from "@/assets/image.png.asset.json";
import imgHamburguer from "@/assets/image-7.png.asset.json";
import imgCombo from "@/assets/image-5.png.asset.json";
import imgFrango from "@/assets/image-3.png.asset.json";
import imgAnel from "@/assets/image-2.png.asset.json";
import imgBatata from "@/assets/image-6.png.asset.json";

export type Category =
  | "hamburguer"
  | "lombo"
  | "frango"
  | "combos"
  | "porcoes"
  | "adicionais"
  | "bebidas";

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image?: string;
  popular?: boolean;
}

export const categories: { id: Category; label: string }[] = [
  { id: "hamburguer", label: "Hambúrguer" },
  { id: "lombo", label: "Lombo" },
  { id: "frango", label: "Filé de Frango" },
  { id: "combos", label: "Combos" },
  { id: "porcoes", label: "Porções" },
  { id: "adicionais", label: "Adicionais" },
  { id: "bebidas", label: "Bebidas" },
];

/** Itens grátis oferecidos em qualquer sanduíche */
export const gratis = ["Cheddar", "Cebola", "Abacaxi", "Catupiry"];

const baseHamburguer = "Pão, salsicha, mussarela, presunto, milho, salada, batata e hambúrguer.";
const baseLombo = "Pão, salsicha, mussarela, presunto, milho, salada, batata e lombo.";
const baseFrango = "Pão, salsicha, mussarela, presunto, milho, salada, batata e filé de frango.";

const withOvo = (base: string) => base.replace("salsicha,", "salsicha, ovo,");
const withBacon = (base: string) => base.replace("salsicha,", "salsicha, bacon,");
const withBaconOvo = (base: string) => base.replace("salsicha,", "salsicha, bacon, ovo,");
const withRango = (base: string) => base.replace("salsicha,", "salsicha, frango,");
const withRangoOvo = (base: string) => base.replace("salsicha,", "salsicha, frango, ovo,");

export const menuItems: MenuItem[] = [
  // ── Hambúrguer ─────────────────────────────
  {
    id: "hb-simples",
    name: "X-Simples",
    description: baseHamburguer,
    price: 17.5,
    category: "hamburguer",
    image: imgHamburguer.url,
  },
  {
    id: "hb-especial",
    name: "X-Especial",
    description: withOvo(baseHamburguer),
    price: 18.5,
    category: "hamburguer",
  },
  {
    id: "hb-bacon-simples",
    name: "X-Bacon Simples",
    description: withBacon(baseHamburguer),
    price: 19.5,
    category: "hamburguer",
    popular: true,
  },
  {
    id: "hb-bacon-especial",
    name: "X-Bacon Especial",
    description: withBaconOvo(baseHamburguer),
    price: 20.5,
    category: "hamburguer",
  },
  {
    id: "hb-rango-simples",
    name: "X-Rango Simples",
    description: withRango(baseHamburguer),
    price: 18.5,
    category: "hamburguer",
  },
  {
    id: "hb-rango-especial",
    name: "X-Rango Especial",
    description: withRangoOvo(baseHamburguer),
    price: 19.5,
    category: "hamburguer",
  },
  {
    id: "hb-tudo",
    name: "X-Tudo",
    description: withBaconOvo(baseHamburguer),
    price: 21.0,
    category: "hamburguer",
    popular: true,
  },

  // ── Lombo ─────────────────────────────
  {
    id: "lb-simples",
    name: "X-Simples",
    description: baseLombo,
    price: 19.5,
    category: "lombo",
    image: imgLombo.url,
  },
  {
    id: "lb-especial",
    name: "X-Especial",
    description: withOvo(baseLombo),
    price: 20.5,
    category: "lombo",
  },
  {
    id: "lb-bacon-simples",
    name: "X-Bacon Simples",
    description: withBacon(baseLombo),
    price: 21.5,
    category: "lombo",
  },
  {
    id: "lb-bacon-especial",
    name: "X-Bacon Especial",
    description: withBaconOvo(baseLombo),
    price: 22.5,
    category: "lombo",
  },
  {
    id: "lb-rango-simples",
    name: "X-Rango Simples",
    description: withRango(baseLombo),
    price: 20.5,
    category: "lombo",
  },
  {
    id: "lb-rango-especial",
    name: "X-Rango Especial",
    description: withRangoOvo(baseLombo),
    price: 22.5,
    category: "lombo",
  },
  {
    id: "lb-tudo",
    name: "X-Tudo",
    description: withBaconOvo(baseLombo),
    price: 23.0,
    category: "lombo",
    popular: true,
  },

  // ── Filé de Frango ─────────────────────────────
  {
    id: "fr-simples",
    name: "X-Simples",
    description: baseFrango,
    price: 18.5,
    category: "frango",
    image: imgFrango.url,
  },
  {
    id: "fr-especial",
    name: "X-Especial",
    description: withOvo(baseFrango),
    price: 19.5,
    category: "frango",
  },
  {
    id: "fr-bacon-simples",
    name: "X-Bacon Simples",
    description: withBacon(baseFrango),
    price: 20.5,
    category: "frango",
  },
  {
    id: "fr-bacon-especial",
    name: "X-Bacon Especial",
    description: withBaconOvo(baseFrango),
    price: 21.5,
    category: "frango",
  },
  {
    id: "fr-rango-simples",
    name: "X-Rango Simples",
    description: withRango(baseFrango),
    price: 19.5,
    category: "frango",
  },
  {
    id: "fr-rango-especial",
    name: "X-Rango Especial",
    description: withRangoOvo(baseFrango),
    price: 20.5,
    category: "frango",
  },
  {
    id: "fr-tudo",
    name: "X-Tudo",
    description: withBaconOvo(baseFrango),
    price: 22.0,
    category: "frango",
  },

  // ── Combos (confirmar preços) ─────────────────────────────
  {
    id: "combo-bacon",
    name: "Combo X-Bacon",
    description: "X-Bacon Simples + porção de batata frita + refrigerante lata 350ml.",
    price: 32.0,
    category: "combos",
    image: imgCombo.url,
    popular: true,
  },
  {
    id: "combo-tudo",
    name: "Combo X-Tudo",
    description: "X-Tudo + porção de batata frita + refrigerante lata 350ml.",
    price: 34.0,
    category: "combos",
  },

  // ── Porções ─────────────────────────────
  {
    id: "batata-cheddar",
    name: "Batata com Cheddar e Bacon",
    description: "Batata frita coberta com cheddar cremoso, bacon e maionese.",
    price: 25.0,
    category: "porcoes",
    image: imgBatata.url,
    popular: true,
  },
  {
    id: "anel-cebola",
    name: "Anéis de Cebola",
    description: "Porção de anéis de cebola empanados e crocantes.",
    price: 20.0,
    category: "porcoes",
    image: imgAnel.url,
  },
  {
    id: "batata-simples",
    name: "Batata Frita",
    description: "Porção de batata frita crocante.",
    price: 18.0,
    category: "porcoes",
  },

  // ── Adicionais ─────────────────────────────
  { id: "ad-hamburguer", name: "Hambúrguer", description: "Adicional.", price: 3.0, category: "adicionais" },
  { id: "ad-presunto", name: "Presunto", description: "Adicional.", price: 2.0, category: "adicionais" },
  { id: "ad-calabresa", name: "Calabresa", description: "Adicional.", price: 3.0, category: "adicionais" },
  { id: "ad-mussarela", name: "Mussarela", description: "Adicional.", price: 2.5, category: "adicionais" },
  { id: "ad-salsicha", name: "Salsicha", description: "Adicional.", price: 2.0, category: "adicionais" },
  { id: "ad-frango", name: "Frango", description: "Adicional.", price: 3.0, category: "adicionais" },
  { id: "ad-lombo", name: "Lombo", description: "Adicional.", price: 4.0, category: "adicionais" },
  { id: "ad-bacon", name: "Bacon", description: "Adicional.", price: 3.5, category: "adicionais" },
  { id: "ad-ovo", name: "Ovo", description: "Adicional.", price: 1.0, category: "adicionais" },

  // ── Bebidas (confirmar preços) ─────────────────────────────
  { id: "refri-lata", name: "Refrigerante Lata 350ml", description: "Coca-Cola, Guaraná, Fanta.", price: 6.0, category: "bebidas" },
  { id: "refri-2l", name: "Refrigerante 2L", description: "Coca-Cola, Guaraná, Fanta.", price: 14.0, category: "bebidas" },
  { id: "agua", name: "Água Mineral 500ml", description: "Com ou sem gás.", price: 4.0, category: "bebidas" },
];
