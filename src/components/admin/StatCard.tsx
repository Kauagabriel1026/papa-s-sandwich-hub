import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
  /** "hero" fica maior — use em um card só, o mais importante da tela. */
  size?: "normal" | "hero";
  tone?: "neutral" | "positive" | "negative";
}

const toneClass = {
  neutral: "text-foreground",
  positive: "text-foreground",
  negative: "text-destructive",
} as const;

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  size = "normal",
  tone = "neutral",
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {label}
      </div>
      <p
        className={`mt-2 font-bold tabular-nums ${
          size === "hero" ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
        } ${toneClass[tone]}`}
      >
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
