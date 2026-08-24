import type { PaymentMethod } from "@/lib/payment";
import type { ExpenseCategory } from "@/lib/finance";

/**
 * Cor de cada forma de pagamento. A cor segue a ENTIDADE, não a posição:
 * Pix é azul em todo lugar do painel, mesmo que num filtro ele apareça em
 * segundo lugar. Trocar a cor conforme a ordem é o jeito mais rápido de fazer
 * alguém ler o gráfico errado.
 */
export const METHOD_COLOR: Record<PaymentMethod, string> = {
  Pix: "var(--viz-pix)",
  Dinheiro: "var(--viz-dinheiro)",
  "Cartão de débito": "var(--viz-debito)",
  "Cartão de crédito": "var(--viz-credito)",
};

/** Rótulo curto, para caber na tela do celular. */
export const METHOD_SHORT: Record<PaymentMethod, string> = {
  Pix: "Pix",
  Dinheiro: "Dinheiro",
  "Cartão de débito": "Débito",
  "Cartão de crédito": "Crédito",
};

export const CATEGORY_EMOJI: Record<ExpenseCategory, string> = {
  Insumos: "Insumos",
  Contas: "Contas",
  Funcionários: "Funcionários",
  Outros: "Outros",
};

export const IN_COLOR = "var(--viz-entrada)";
export const OUT_COLOR = "var(--viz-saida)";
