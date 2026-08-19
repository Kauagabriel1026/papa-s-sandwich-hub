import { menuItems, gratis, type MenuItem } from "@/data/menu";

/** Extrai a lista de ingredientes a partir da descrição do sanduíche. */
export function parseIngredients(description: string): string[] {
  return description
    .replace(/\.$/, "")
    .split(/,| e /)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

export interface ExtraOption {
  name: string;
  price: number;
}

/** Adicionais pagos (categoria "adicionais" do cardápio). */
export const paidExtras: ExtraOption[] = menuItems
  .filter((i) => i.category === "adicionais")
  .map((i) => ({ name: i.name, price: i.price }));

/** Adicionais grátis dos sanduíches. */
export const freeExtras: ExtraOption[] = gratis.map((name) => ({ name, price: 0 }));

export const sandwichCategories = ["hamburguer", "lombo", "frango"] as const;

export function isSandwich(item: MenuItem) {
  return (sandwichCategories as readonly string[]).includes(item.category);
}

export function isAcai(item: MenuItem) {
  return item.category === "acai" && item.id.startsWith("acai");
}

export function needsFlavor(item: MenuItem) {
  return item.category === "acai" && !item.id.startsWith("acai");
}

export function isCustomizable(item: MenuItem) {
  return isSandwich(item) || item.category === "acai";
}
