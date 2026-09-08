import { useRef } from "react";
import { Download, Upload, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { buildBackup, downloadFile, readBackup } from "@/lib/ledger-storage";
import { dayKey, formatTime, isSale, type Entry } from "@/lib/finance";

interface BackupPanelProps {
  entries: Entry[];
  /** Devolve quantos lançamentos realmente entraram. */
  onImport: (entries: Entry[]) => Promise<number> | number;
  /** true quando os lançamentos estão no banco, e não só no navegador. */
  noBanco?: boolean;
}

/** Monta um CSV que o Excel e o Google Planilhas abrem sem reclamar. */
function toCsv(entries: Entry[]): string {
  const header = ["Data", "Hora", "Tipo", "Categoria/Pagamento", "Valor (R$)", "Observação"];

  const rows = [...entries]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((entry) => [
      dayKey(entry.createdAt).split("-").reverse().join("/"),
      formatTime(entry.createdAt),
      isSale(entry) ? "Venda" : "Gasto",
      isSale(entry) ? entry.method : entry.category,
      // Vírgula decimal: é o que o Excel em português espera.
      (entry.amountCents / 100).toFixed(2).replace(".", ","),
      entry.note,
    ]);

  // Ponto e vírgula como separador, pelo mesmo motivo da vírgula decimal.
  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  return [header, ...rows].map((row) => row.map(escape).join(";")).join("\r\n");
}

export function BackupPanel({ entries, onImport, noBanco = false }: BackupPanelProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const today = dayKey(new Date());

  const handleExportBackup = () => {
    if (entries.length === 0) {
      toast.error("Não há nada para salvar ainda.");
      return;
    }
    downloadFile(
      `papaleguas-backup-${today}.json`,
      JSON.stringify(buildBackup(entries), null, 2),
      "application/json",
    );
    toast.success("Backup salvo", { description: "Guarde o arquivo fora do celular." });
  };

  const handleExportCsv = () => {
    if (entries.length === 0) {
      toast.error("Não há nada para exportar ainda.");
      return;
    }
    // BOM no começo: sem ele o Excel bagunça os acentos.
    downloadFile(`papaleguas-lancamentos-${today}.csv`, `\uFEFF${toCsv(entries)}`, "text/csv");
    toast.success("Planilha exportada");
  };

  const handleImport = async (file: File) => {
    const text = await file.text();
    const parsed = readBackup(text);

    if (parsed === null) {
      toast.error("Arquivo inválido", {
        description: "Escolha um backup .json gerado por este painel.",
      });
      return;
    }

    const added = await onImport(parsed);
    if (added === 0) {
      toast.info("Nada novo para importar", {
        description: "Todos os lançamentos do arquivo já estavam aqui.",
      });
    } else {
      toast.success(`${added} lançamento${added > 1 ? "s" : ""} importado${added > 1 ? "s" : ""}`);
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <header className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div>
          <h2 className="text-base font-semibold text-card-foreground">Backup dos dados</h2>
          {noBanco ? (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Os lançamentos estão no banco de dados, acessíveis de qualquer aparelho. O backup
              continua valendo a pena: banco não desfaz lançamento apagado por engano.
            </p>
          ) : (
            <p className="mt-0.5 text-sm text-muted-foreground">
              Os lançamentos ficam salvos <strong>só neste navegador</strong>. Se limpar os dados de
              navegação ou trocar de aparelho, eles somem. Exporte o backup toda semana e guarde o
              arquivo em outro lugar.
            </p>
          )}
        </div>
      </header>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <Button variant="outline" onClick={handleExportBackup} className="justify-start gap-2">
          <Download className="h-4 w-4" />
          Salvar backup
        </Button>
        <Button variant="outline" onClick={handleExportCsv} className="justify-start gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar planilha
        </Button>
        <Button
          variant="outline"
          onClick={() => fileInput.current?.click()}
          className="justify-start gap-2"
        >
          <Upload className="h-4 w-4" />
          Restaurar backup
        </Button>
      </div>

      <input
        ref={fileInput}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleImport(file);
          e.target.value = "";
        }}
      />
    </section>
  );
}
