import { useState, useCallback, useMemo } from "react";
import { menuItems, type MenuItem } from "@/data/menu";
import { type ExtraOption } from "@/lib/customize";

export interface CartItem {
  lineId: string;
  item: MenuItem;
  quantity: number;
  observation: string;
  /** Ingredientes retirados do item */
  removed: string[];
  /** Adicionais escolhidos (grátis ou pagos) */
  added: ExtraOption[];
  /** Sabor escolhido (cremes/sucos) */
  flavor?: string;
  /** Preço unitário já com adicionais */
  unitPrice: number;
}

export interface CustomizationInput {
  quantity?: number;
  observation?: string;
  removed?: string[];
  added?: ExtraOption[];
  flavor?: string;
}

function makeLineId() {
  return `line-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sameCustomization(a: CartItem, item: MenuItem, c: CustomizationInput) {
  const added = c.added ?? [];
  const removed = c.removed ?? [];
  return (
    a.item.id === item.id &&
    a.flavor === c.flavor &&
    (a.observation || "") === (c.observation || "") &&
    a.removed.join("|") === removed.join("|") &&
    a.added.map((e) => e.name).join("|") === added.map((e) => e.name).join("|")
  );
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: MenuItem, custom: CustomizationInput = {}) => {
    const added = custom.added ?? [];
    const removed = custom.removed ?? [];
    const quantity = custom.quantity ?? 1;
    const unitPrice = item.price + added.reduce((sum, e) => sum + e.price, 0);

    setItems((prev) => {
      const existing = prev.find((i) => sameCustomization(i, item, custom));
      if (existing) {
        return prev.map((i) =>
          i.lineId === existing.lineId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          lineId: makeLineId(),
          item,
          quantity,
          observation: custom.observation ?? "",
          removed,
          added,
          flavor: custom.flavor,
          unitPrice,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const updateQuantity = useCallback(
    (lineId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(lineId);
        return;
      }
      setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i)));
    },
    [removeItem]
  );

  const updateObservation = useCallback((lineId: string, observation: string) => {
    setItems((prev) => prev.map((i) => (i.lineId === lineId ? { ...i, observation } : i)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
    [items]
  );

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    updateObservation,
    clearCart,
    totalItems,
    totalPrice,
  };
}

export function getItemById(id: string): MenuItem | undefined {
  return menuItems.find((item) => item.id === id);
}
