/**
 * Formas de pagamento aceitas.
 *
 * Esta lista é a fonte única: o carrinho usa para montar o seletor e o painel
 * de admin usa para agrupar os totais. Se um dia entrar "Vale-refeição", basta
 * acrescentar aqui.
 */

export const PAYMENT_METHODS = [
  "Pix",
  "Dinheiro",
  "Cartão de débito",
  "Cartão de crédito",
] as const;

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/** Só o pagamento em dinheiro precisa de troco. */
export function needsChange(method: PaymentMethod): boolean {
  return method === "Dinheiro";
}

/**
 * Converte o que o cliente digitou ("50", "50,00", "R$ 50.00") em número.
 * Retorna null quando não dá para entender o valor.
 */
export function parseAmount(input: string): number | null {
  const cleaned = input.replace(/[^\d,.-]/g, "").replace(",", ".");
  if (!cleaned) return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}
