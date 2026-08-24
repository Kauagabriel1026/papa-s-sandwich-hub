/**
 * Camada de armazenamento do painel.
 *
 * TUDO que toca "onde os dados moram" está isolado neste arquivo — de
 * propósito. Hoje os lançamentos ficam no localStorage do navegador. No dia em
 * que o projeto ganhar um backend (Lovable Cloud / Supabase), só estas quatro
 * funções mudam: as telas, as contas e os gráficos continuam iguais.
 *
 * Limitação que vem junto: localStorage vive num navegador só. Trocar de
 * celular, limpar o histórico ou usar a aba anônima = dados sumidos. Por isso o
 * painel tem exportar/importar backup — não é enfeite, é a rede de segurança.
 */

import type { Entry } from "@/lib/finance";

const STORAGE_KEY = "papaleguas.ledger.v1";

/** Durante o SSR não existe window; toda leitura precisa passar por aqui. */
const hasStorage = () => typeof window !== "undefined" && !!window.localStorage;

function isValidEntry(value: unknown): value is Entry {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    typeof e["id"] === "string" &&
    (e["kind"] === "venda" || e["kind"] === "despesa") &&
    typeof e["amountCents"] === "number" &&
    Number.isFinite(e["amountCents"]) &&
    typeof e["createdAt"] === "string"
  );
}

export function loadEntries(): Entry[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Filtra qualquer coisa corrompida em vez de deixar o painel quebrar, e
    // ordena do mais recente para o mais antigo. A tela de lançamentos conta
    // com essa ordem para mostrar "os últimos 15" — um backup restaurado de
    // outro aparelho pode vir em qualquer ordem.
    return parsed.filter(isValidEntry).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export function saveEntries(entries: Entry[]): boolean {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    return true;
  } catch {
    // Acontece quando o navegador está sem espaço ou bloqueia armazenamento.
    return false;
  }
}

export function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─────────────────────────────────────────────────────────
// Backup
// ─────────────────────────────────────────────────────────

export interface Backup {
  format: "papaleguas-ledger";
  version: 1;
  exportedAt: string;
  entries: Entry[];
}

export function buildBackup(entries: Entry[]): Backup {
  return {
    format: "papaleguas-ledger",
    version: 1,
    exportedAt: new Date().toISOString(),
    entries,
  };
}

/** Lê um backup. Devolve null quando o arquivo não é um backup válido. */
export function readBackup(text: string): Entry[] | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed !== "object" || parsed === null) return null;
    const backup = parsed as Partial<Backup>;
    if (backup.format !== "papaleguas-ledger") return null;
    if (!Array.isArray(backup.entries)) return null;
    return backup.entries.filter(isValidEntry);
  } catch {
    return null;
  }
}

/** Dispara o download de um arquivo gerado no próprio navegador. */
export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
