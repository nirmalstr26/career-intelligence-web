import { Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CareerInsightProps {
  title: string;
  body: string;
  icon?: LucideIcon;
  className?: string;
}

export function CareerInsight({
  title,
  body,
  icon: Icon = Sparkles,
  className,
}: CareerInsightProps) {
  return (
    <div className={cn("flex items-start gap-4", className)}>
      <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-strong bg-surface text-primary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
