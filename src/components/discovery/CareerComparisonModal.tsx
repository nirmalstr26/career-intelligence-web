import { useState } from "react";
import { Check, Code2, Database, HelpCircle, Layers, Sparkles, X, Zap } from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { compareCareerPaths } from "@/lib/careerai/client";
import type { CareerComparisonResponse } from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

interface Props {
  sessionId: string;
  careerA: string;
  careerB: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectCareer: (careerCode: string) => void;
}

export function CareerComparisonModal({
  sessionId,
  careerA,
  careerB,
  isOpen,
  onClose,
  onSelectCareer,
}: Props) {
  const [data, setData] = useState<CareerComparisonResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Fetch comparison when opened
  if (isOpen && !hasLoaded && !isLoading) {
    setIsLoading(true);
    setHasLoaded(true);
    compareCareerPaths(sessionId, careerA, careerB)
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to compare:", err);
        setIsLoading(false);
      });
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-xl sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkles className="size-3.5" />
            Side-by-Side Comparison
          </div>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground">
            {data ? `${data.career_a.title} vs ${data.career_b.title}` : "Comparing Career Paths"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Understand how these roles differ in everyday engineering, math depth, and career growth.
          </p>
        </div>

        {isLoading && (
          <div className="flex min-h-[300px] flex-col items-center justify-center space-y-3">
            <InlineSpinner className="size-8 text-primary" />
            <p className="text-sm text-muted-foreground">Analyzing career metrics…</p>
          </div>
        )}

        {data && !isLoading && (
          <div className="space-y-6">
            {/* Takeaway banner */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-foreground leading-relaxed">
              <span className="font-semibold text-primary">SPAR AI Takeaway: </span>
              {data.spar_takeaway}
            </div>

            {/* Comparison Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {[data.career_a, data.career_b].map((c) => (
                <div
                  key={c.career_code}
                  className="rounded-xl border border-border bg-background p-5 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                        {c.category}
                      </span>
                      <h3 className="font-display text-lg font-bold text-foreground">{c.title}</h3>
                    </div>
                    <Button
                      size="sm"
                      className="rounded-xl text-xs gap-1.5"
                      onClick={() => {
                        onSelectCareer(c.career_code);
                        onClose();
                      }}
                    >
                      <Check className="size-3.5" />
                      Choose Path
                    </Button>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-2 text-xs">
                    <div>
                      <p className="text-muted-foreground font-medium mb-0.5">What you build:</p>
                      <p className="text-foreground leading-relaxed">{c.what_you_build}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground font-medium mb-0.5">Typical work:</p>
                      <p className="text-foreground leading-relaxed">{c.typical_day}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                      <div className="rounded-lg bg-secondary/50 p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Coding</p>
                        <p className="font-bold text-foreground">{c.coding_intensity}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Math</p>
                        <p className="font-bold text-foreground">{c.math_intensity}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-2 text-center">
                        <p className="text-[10px] text-muted-foreground">Data Focus</p>
                        <p className="font-bold text-foreground">{c.data_focus}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-muted-foreground font-medium mb-1.5">Common Tools:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.common_tools.map((t) => (
                          <span
                            key={t}
                            className="rounded-md bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-foreground"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-muted-foreground font-medium mb-1.5">Where this leads:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {c.where_it_leads.map((w) => (
                          <span
                            key={w}
                            className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] text-primary"
                          >
                            {w}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
