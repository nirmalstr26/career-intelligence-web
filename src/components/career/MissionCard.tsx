import { Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionCardProps {
  title: string;
  level: string;
  minutes: number;
  progress: number;
  icon?: LucideIcon;
  compact?: boolean;
  className?: string;
}

export function MissionCard({
  title,
  level,
  minutes,
  progress,
  icon: Icon,
  compact = false,
  className,
}: MissionCardProps) {
  return (
    <div
      className={cn(
        "surface-panel hover-lift flex items-center gap-3 rounded-2xl",
        compact ? "p-2.5" : "p-4",
        className,
      )}
    >
      {Icon ? (
        <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
          <Icon className="size-4" aria-hidden="true" />
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        <p className={cn("truncate font-semibold", compact ? "text-xs" : "text-sm")}>{title}</p>
        <p className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{level}</span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" aria-hidden="true" />
            {minutes} min
          </span>
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="numeric text-xs text-muted-foreground">{progress}%</span>
        <span className="rounded-lg bg-coral px-2 py-1 text-[10px] font-semibold text-coral-foreground">
          Continue
        </span>
      </div>
    </div>
  );
}
