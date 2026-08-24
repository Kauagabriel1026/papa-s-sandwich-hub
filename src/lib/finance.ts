/**
 * Modelo de dados e contas do painel financeiro.
 *
 * DECISÃO IMPORTANTE — dinheiro é guardado em CENTAVOS (número inteiro).
 * Se guardássemos em reais com vírgula, somas repetidas dariam erro:
 * em JavaScript, 0.1 + 0.2 === 0.30000000000000004. Com centavos, tudo é
 * conta de número inteiro e o resultado é exato. A conversão para reais
 * acontece só na hora de mostrar na tela.
 *
 * Este arquivo só tem funções puras (entra dado, sai resultado, não mexe em
 * nada de fora). Isso é de propósito: dá para testar cada conta isoladamente
 * e nenhuma delas depende de onde os dados estão salvos.
 */

import type { PaymentMethod } from "@/lib/payment";
import { PAYMENT_METHODS } from "@/lib/payment";

// ─────────────────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────────────────

export const EXPENSE_CATEGORIES = ["Insumos", "Contas", "Funcionários", "Outros"] as const;

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];

export interface Sale {
  id: string;
  kind: "venda";
  amountCents: number;
  method: PaymentMethod;
  note: string;
  /** ISO 8601, sempre em UTC. O fuso é aplicado só na exibição. */
  createdAt: string;
}

export interface Expense {
  id: string;
  kind: "despesa";
  amountCents: number;
  category: ExpenseCategory;
  note: string;
  createdAt: string;
}

export type Entry = Sale | Expense;

export const isSale = (entry: Entry): entry is Sale => entry.kind === "venda";
export const isExpense = (entry: Entry): entry is Expense => entry.kind === "despesa";

// ─────────────────────────────────────────────────────────
// Dinheiro
// ─────────────────────────────────────────────────────────

export function toCents(reais: number): number {
  return Math.round(reais * 100);
}

export function formatCents(cents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(cents / 100);
}

/** Versão curta para eixo de gráfico: 1250 -> "R$ 12,50", 250000 -> "R$ 2,5 mil". */
export function formatCentsShort(cents: number): string {
  const reais = cents / 100;
  if (Math.abs(reais) >= 1000) {
    return `R$ ${(reais / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mil`;
  }
  return `R$ ${reais.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}`;
}

// ─────────────────────────────────────────────────────────
// Datas
// ─────────────────────────────────────────────────────────

const TIME_ZONE = "America/Sao_Paulo";

/**
 * Devolve a data no formato "AAAA-MM-DD" no fuso do Brasil.
 * Usamos o fuso explícito para que uma venda das 22h não caia no dia seguinte
 * caso o aparelho esteja com o fuso configurado errado.
 */
export function dayKey(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

/** "2026-08-24" -> "24/08" */
export function formatDayShort(key: string): string {
  const [, month, day] = key.split("-");
  return `${day}/${month}`;
}

/** "2026-08-24" -> "seg, 24/08" */
export function formatDayLong(key: string): string {
  const [year, month, day] = key.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  const weekday = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "UTC",
    weekday: "short",
  }).format(date);
  return `${weekday.replace(".", "")}, ${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`;
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

// ─────────────────────────────────────────────────────────
// Períodos
// ─────────────────────────────────────────────────────────

export const PERIODS = ["hoje", "7dias", "mes", "tudo"] as const;
export type Period = (typeof PERIODS)[number];

export const PERIOD_LABELS: Record<Period, string> = {
  hoje: "Hoje",
  "7dias": "7 dias",
  mes: "Este mês",
  tudo: "Tudo",
};

/**
 * Lista de dias (mais antigo primeiro) que o período cobre.
 * Para "tudo", devolve null — quem chamar deve derivar os dias dos lançamentos.
 */
export function daysInPeriod(period: Period, today = new Date()): string[] | null {
  const todayKey = dayKey(today);

  if (period === "hoje") return [todayKey];

  if (period === "7dias") {
    const keys: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      keys.push(dayKey(d));
    }
    return keys;
  }

  if (period === "mes") {
    const [year, month] = todayKey.split("-").map(Number);
    const lastDay = new Date(Date.UTC(year!, month!, 0)).getUTCDate();
    const currentDay = Number(todayKey.split("-")[2]);
    const keys: string[] = [];
    for (let d = 1; d <= Math.min(lastDay, currentDay); d++) {
      keys.push(`${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
    }
    return keys;
  }

  return null;
}

export function filterByPeriod(entries: Entry[], period: Period, today = new Date()): Entry[] {
  const days = daysInPeriod(period, today);
  if (days === null) return entries;
  const allowed = new Set(days);
  return entries.filter((e) => allowed.has(dayKey(e.createdAt)));
}

// ─────────────────────────────────────────────────────────
// Agregações
// ─────────────────────────────────────────────────────────

export interface Summary {
  revenueCents: number;
  expenseCents: number;
  balanceCents: number;
  saleCount: number;
  averageTicketCents: number;
}

export function summarize(entries: Entry[]): Summary {
  let revenueCents = 0;
  let expenseCents = 0;
  let saleCount = 0;

  for (const entry of entries) {
    if (isSale(entry)) {
      revenueCents += entry.amountCents;
      saleCount++;
    } else {
      expenseCents += entry.amountCents;
    }
  }

  return {
    revenueCents,
    expenseCents,
    balanceCents: revenueCents - expenseCents,
    saleCount,
    averageTicketCents: saleCount > 0 ? Math.round(revenueCents / saleCount) : 0,
  };
}

export interface MethodTotal {
  method: PaymentMethod;
  cents: number;
  count: number;
  /** Fatia do faturamento, de 0 a 1. */
  share: number;
}

export function totalsByMethod(entries: Entry[]): MethodTotal[] {
  const totals = new Map<PaymentMethod, { cents: number; count: number }>();
  for (const method of PAYMENT_METHODS) totals.set(method, { cents: 0, count: 0 });

  let grandTotal = 0;
  for (const entry of entries) {
    if (!isSale(entry)) continue;
    const bucket = totals.get(entry.method);
    if (!bucket) continue;
    bucket.cents += entry.amountCents;
    bucket.count++;
    grandTotal += entry.amountCents;
  }

  return PAYMENT_METHODS.map((method) => {
    const bucket = totals.get(method)!;
    return {
      method,
      cents: bucket.cents,
      count: bucket.count,
      share: grandTotal > 0 ? bucket.cents / grandTotal : 0,
    };
  });
}

export interface CategoryTotal {
  category: ExpenseCategory;
  cents: number;
  count: number;
}

export function totalsByCategory(entries: Entry[]): CategoryTotal[] {
  const totals = new Map<ExpenseCategory, { cents: number; count: number }>();
  for (const category of EXPENSE_CATEGORIES) totals.set(category, { cents: 0, count: 0 });

  for (const entry of entries) {
    if (!isExpense(entry)) continue;
    const bucket = totals.get(entry.category);
    if (!bucket) continue;
    bucket.cents += entry.amountCents;
    bucket.count++;
  }

  return EXPENSE_CATEGORIES.map((category) => ({ category, ...totals.get(category)! }));
}

export interface DayTotal {
  day: string;
  label: string;
  revenueCents: number;
  expenseCents: number;
}

/**
 * Totais por dia. Dias sem movimento entram zerados para o gráfico não
 * "encolher" o eixo e dar a impressão de que a semana foi mais curta.
 */
export function totalsByDay(entries: Entry[], days: string[] | null): DayTotal[] {
  const buckets = new Map<string, { revenueCents: number; expenseCents: number }>();

  const ensure = (day: string) => {
    if (!buckets.has(day)) buckets.set(day, { revenueCents: 0, expenseCents: 0 });
    return buckets.get(day)!;
  };

  if (days) for (const day of days) ensure(day);

  for (const entry of entries) {
    const bucket = ensure(dayKey(entry.createdAt));
    if (isSale(entry)) bucket.revenueCents += entry.amountCents;
    else bucket.expenseCents += entry.amountCents;
  }

  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, totals]) => ({ day, label: formatDayShort(day), ...totals }));
}

/** Dia de maior faturamento no conjunto — null quando não houve venda. */
export function bestDay(dayTotals: DayTotal[]): DayTotal | null {
  const withRevenue = dayTotals.filter((d) => d.revenueCents > 0);
  if (withRevenue.length === 0) return null;
  return withRevenue.reduce((best, day) => (day.revenueCents > best.revenueCents ? day : best));
}
