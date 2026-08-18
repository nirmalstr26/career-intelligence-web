import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentStreakProps {
  days: number;
  /** 7 booleans, Monday first */
  week?: boolean[];
  className?: string;
}

const LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function StudentStreak({
  days,
  week = [true, true, true, true, true, false, false],
  className,
}: StudentStreakProps) {
  return (
    <div className={cn("surface-panel rounded-2xl p-3", className)}>
      <p className="text-[11px] font-medium text-muted-foreground">Your Streak</p>
      <p className="mt-1 flex items-center gap-1.5">
        <Flame className="size-4 text-warning" aria-hidden="true" />
        <span className="numeric text-xl font-bold leading-none">{days}</span>
        <span className="text-xs text-muted-foreground">days</span>
      </p>
      <ul className="mt-2.5 flex items-center justify-between gap-1">
        {LABELS.map((label, i) => (
          <li key={i} className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-muted-foreground">{label}</span>
            <span
              className={cn(
                "grid size-2.5 place-items-center rounded-full",
                week[i] ? "bg-success" : "border border-border-strong",
              )}
              aria-label={`${label}: ${week[i] ? "active" : "missed"}`}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
