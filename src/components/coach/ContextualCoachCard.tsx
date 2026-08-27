import { Link } from "@tanstack/react-router";
import { Sparkles, MessageSquare, ArrowRight, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContextualCoachCardProps {
  title?: string;
  subtitle?: string;
  prompts: string[];
  className?: string;
}

export function ContextualCoachCard({
  title = "Ask SPAR AI Coach",
  subtitle = "Get instant, personalized guidance tailored to your current progress.",
  prompts,
  className,
}: ContextualCoachCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/[0.06] via-card/70 to-surface p-4 sm:p-5 backdrop-blur shadow-sm",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-primary/20 text-primary">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h4 className="text-sm font-semibold text-foreground">{title}</h4>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 self-start sm:self-auto text-xs">
          <Link to="/app/coach">
            <Bot className="size-3.5 text-primary" />
            Open Full Coach
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {prompts.map((prompt, i) => (
          <Link
            key={i}
            to="/app/coach"
            search={{ prompt }}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-surface/80 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-foreground"
          >
            <MessageSquare className="size-3 text-primary/70" />
            <span>&ldquo;{prompt}&rdquo;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
