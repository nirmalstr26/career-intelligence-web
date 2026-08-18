import { cn } from "@/lib/utils";

interface CareerReadinessRingProps {
  /** 0-100 */
  value: number;
  label?: string;
  caption?: string;
  size?: number;
  className?: string;
}

/**
 * Signature CareerAI readiness ring. Communicates status with number + label,
 * never color alone.
 */
export function CareerReadinessRing({
  value,
  label = "Career Readiness",
  caption,
  size = 96,
  className,
}: CareerReadinessRingProps) {
  const stroke = Math.max(6, Math.round(size * 0.09));
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label={`${label}: ${clamped} out of 100`}
        >
          <defs>
            <linearGradient id={`ring-${label.replace(/\s/g, "")}`} x1="0" y1="1" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--primary)" />
              <stop offset="100%" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--border-strong)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={`url(#ring-${label.replace(/\s/g, "")})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            className="animate-ring"
            style={{ ["--ring-circumference" as string]: `${circumference}` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="numeric text-lg font-bold leading-none">
            {clamped}
            <span className="text-[0.6em] text-muted-foreground">%</span>
          </span>
          {caption ? (
            <span className="mt-0.5 text-[10px] font-medium text-primary">{caption}</span>
          ) : null}
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">Updated today</p>
      </div>
    </div>
  );
}
