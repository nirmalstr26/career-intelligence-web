import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlacementReadinessProps {
  score: number;
  outOf?: number;
  delta?: number;
  className?: string;
}

export function PlacementReadiness({
  score,
  outOf = 100,
  delta,
  className,
}: PlacementReadinessProps) {
  return (
    <div className={cn("surface-panel hover-lift rounded-2xl p-4", className)}>
      <p className="numeric text-3xl font-bold leading-none">
        {score}
        <span className="ml-1 text-base font-medium text-muted-foreground">/{outOf}</span>
      </p>
      <p className="mt-2 text-xs font-medium text-muted-foreground">Placement Readiness</p>
      {typeof delta === "number" ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-success">
          <ArrowUp className="size-3.5" aria-hidden="true" />
          {delta} pts <span className="sr-only">improvement</span>
        </p>
      ) : null}
    </div>
  );
}
