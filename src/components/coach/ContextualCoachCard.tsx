import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, MessageSquare, ArrowRight, Bot, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ContextualCoachCardProps {
  title?: string;
  subtitle?: string;
  prompts?: string[];
  ci?: any;
  className?: string;
}

const DEFAULT_PROMPTS = [
  "What should I focus on next?",
  "How do I close my biggest skill gap?",
  "Quiz me on SQL window functions.",
  "Am I ready for Data Engineering internships?",
];

export function ContextualCoachCard({
  title = "Ask SPAR AI Coach",
  subtitle = "Get instant, personalized guidance tailored to your current progress.",
  prompts = DEFAULT_PROMPTS,
  ci,
  className,
}: ContextualCoachCardProps) {
  const activePrompts = (Array.isArray(prompts) && prompts.length > 0) ? prompts : DEFAULT_PROMPTS;

  return (
    <div
      className={cn(
        "rounded-3xl border border-primary/30 bg-gradient-to-br from-primary/[0.05] via-card to-card p-5 sm:p-6 shadow-sm space-y-4",
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-2xl bg-primary/20 text-primary">
            <Sparkles className="size-4.5" />
          </span>
          <div>
            <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
              {title}
            </h4>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        <Button asChild variant="outline" size="sm" className="rounded-full gap-1.5 self-start sm:self-auto text-xs font-semibold">
          <Link to="/app/coach">
            <Bot className="size-3.5 text-primary" />
            Open Coach
            <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {activePrompts.map((prompt, i) => (
          <Link
            key={i}
            to="/app/coach"
            search={{ prompt }}
            className="flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/30 px-3 py-1.5 text-xs text-muted-foreground transition-all hover:border-primary/60 hover:bg-primary/10 hover:text-foreground"
          >
            <MessageSquare className="size-3 text-primary" />
            <span>&ldquo;{prompt}&rdquo;</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
