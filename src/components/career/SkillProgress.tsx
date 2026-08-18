import { cn } from "@/lib/utils";

interface SkillProgressProps {
  name: string;
  value: number;
  level?: string;
  className?: string;
}

export function SkillProgress({ name, value, level, className }: SkillProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-sm font-medium">{name}</span>
        <span className="numeric shrink-0 text-xs text-muted-foreground">
          {level ? `${level} · ` : ""}
          {clamped}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-secondary"
        role="progressbar"
        aria-label={name}
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="gradient-primary h-full rounded-full transition-[width] duration-slow"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
