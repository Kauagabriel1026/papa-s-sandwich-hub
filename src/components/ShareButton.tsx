import { useState } from "react";
import { Link2, Check } from "lucide-react";
import { toast } from "sonner";

interface ShareButtonProps {
  /** compact = só o ícone (para o cabeçalho) */
  compact?: boolean;
}

export function ShareButton({ compact = false }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = window.location.origin;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Fallback para navegadores sem clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    toast.success("Link do cardápio copiado! Envie para quem quiser.");
    window.setTimeout(() => setCopied(false), 2000);
  };

  if (compact) {
    return (
      <button
        onClick={handleCopy}
        aria-label="Copiar link do cardápio"
        title="Copiar link do cardápio"
        className="rounded-full border border-border bg-background p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-accent"
    >
      {copied ? <Check className="h-4 w-4 text-green-600" /> : <Link2 className="h-4 w-4" />}
      {copied ? "Link copiado!" : "Compartilhar cardápio"}
    </button>
  );
}
