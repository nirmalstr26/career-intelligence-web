import type { ReactNode } from "react";

import { InlineSpinner } from "@/components/common/Loader";
import { cn } from "@/lib/utils";

/** Turn a CODE_LIKE_THIS into "Code Like This". */
export function humanizeCode(code: string): string {
  return code
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatDateTime(iso: string | null): string {
  if (iso === null) return "\u2014";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "\u2014";
  return date.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface SectionCardProps {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function SectionCard({ title, description, action, className, children }: SectionCardProps) {
  return (
    <section className={cn("surface-panel rounded-2xl p-5 sm:p-6", className)}>
      {title !== undefined || action !== undefined ? (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title !== undefined ? (
              <h2 className="font-display text-lg font-semibold">{title}</h2>
            ) : null}
            {description !== undefined ? (
              <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-border px-6 py-10 text-center",
        className,
      )}
    >
      {icon !== undefined ? (
        <span className="mb-3 grid size-12 place-items-center rounded-2xl bg-secondary text-primary">
          {icon}
        </span>
      ) : null}
      <h3 className="font-display text-base font-semibold">{title}</h3>
      {description !== undefined ? (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action !== undefined ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

interface MeterProps {
  label: string;
  value: number;
  caption?: string;
}

/** A labeled 0\u2013100 progress meter (number-first, not color-only). */
export function Meter({ label, value, caption }: MeterProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="numeric text-sm font-semibold text-foreground">{clamped}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
        <div className="h-full gradient-primary" style={{ width: `${clamped}%` }} />
      </div>
      {caption !== undefined ? (
        <p className="mt-1 text-xs text-muted-foreground">{caption}</p>
      ) : null}
    </div>
  );
}

export function Chip({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface/40 px-3 py-1 text-xs text-foreground",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PageLoading({ label = "Loading\u2026" }: { label?: string }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      <InlineSpinner className="mr-2" /> {label}
    </div>
  );
}

export function PageError({ onRetry }: { onRetry?: () => void }) {
  return (
    <SectionCard title="Something went wrong">
      <p className="text-sm text-muted-foreground">We couldn't load this page. Please try again.</p>
      {onRetry !== undefined ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-secondary"
        >
          Retry
        </button>
      ) : null}
    </SectionCard>
  );
}
