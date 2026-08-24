import { Clock } from "lucide-react";
import { useOpenStatus, OPEN_TIME, CLOSE_TIME } from "@/lib/opening-hours";

interface OpenStatusBadgeProps {
  className?: string;
}

export function OpenStatusBadge({ className = "" }: OpenStatusBadgeProps) {
  const status = useOpenStatus();

  // Antes da hidratação, mostra apenas o horário (evita mismatch de SSR)
  if (!status) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-sm text-muted-foreground ${className}`}>
        <Clock className="h-4 w-4 text-primary" />
        Todos os dias · {OPEN_TIME} às {CLOSE_TIME}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-2 text-sm font-medium ${className}`}>
      <span className="relative flex h-2.5 w-2.5">
        {status.isOpen && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-60" />
        )}
        <span
          className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
            status.isOpen ? "bg-green-500" : "bg-red-500"
          }`}
        />
      </span>
      <span className={status.isOpen ? "text-green-600" : "text-red-500"}>{status.label}</span>
    </span>
  );
}
