import { TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressTrajectoryProps {
  points?: number[];
  label?: string;
  className?: string;
}

/** Compact sparkline showing readiness trajectory over time. */
export function ProgressTrajectory({
  points = [12, 20, 16, 30, 26, 42, 38, 56, 62],
  label = "Progress trajectory",
  className,
}: ProgressTrajectoryProps) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const d = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 30 - ((p - min) / span) * 26 - 2;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <TrendingUp className="size-3.5 shrink-0 text-success" aria-hidden="true" />
      <svg
        viewBox="0 0 100 30"
        preserveAspectRatio="none"
        className="h-6 w-full"
        role="img"
        aria-label={label}
      >
        <path
          d={d}
          fill="none"
          stroke="var(--primary)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
