import { useState } from "react";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Compass,
  Layers,
  MessageSquare,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { CareerComparisonModal } from "./CareerComparisonModal";
import type { CareerRecommendation } from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

interface Props {
  sessionId: string;
  recommendations: CareerRecommendation[];
  onSelectCareer: (careerCode: string) => void;
  onExploreOther: () => void;
  isSelecting: boolean;
}

export function RecommendationReveal({
  sessionId,
  recommendations,
  onSelectCareer,
  onExploreOther,
  isSelecting,
}: Props) {
  const [selectedForComparison, setSelectedForComparison] = useState<string | null>(null);
  const [comparisonTarget, setComparisonTarget] = useState<string | null>(null);

  const topRec = recommendations[0];
  const otherRecs = recommendations.slice(1);

  const handleOpenComparison = (codeA: string, codeB: string) => {
    setSelectedForComparison(codeA);
    setComparisonTarget(codeB);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          Discovery Analysis Complete
        </div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          I found a few directions worth exploring.
        </h2>
        <p className="mx-auto max-w-xl text-sm text-muted-foreground">
          Based on your background, problem-solving preferences, and goals, here are the career pathways where you could thrive.
        </p>
      </div>

      {/* Top Match Spotlight Card */}
      {topRec && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-primary/50 bg-gradient-to-b from-primary/5 via-card to-card p-6 shadow-md sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground">
                  #1 {topRec.fit_label}
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {Math.round(topRec.match_score * 100)}% fit signal
                </span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {topRec.career_title}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              {otherRecs.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs gap-1.5"
                  onClick={() => handleOpenComparison(topRec.career_code, otherRecs[0].career_code)}
                >
                  <Layers className="size-3.5" />
                  Compare with #{2}
                </Button>
              )}
              <Button
                size="sm"
                className="rounded-xl bg-primary text-xs font-semibold text-primary-foreground gap-1.5 hover:bg-primary/90"
                disabled={isSelecting}
                onClick={() => onSelectCareer(topRec.career_code)}
              >
                <Zap className="size-3.5 fill-current" />
                Choose {topRec.career_title}
              </Button>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <p className="text-sm text-foreground/90 leading-relaxed font-medium">
              {topRec.summary}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-primary">
                  Why SPAR thinks this fits:
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {topRec.why.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/90">
                      <CheckCircle2 className="size-3.5 text-primary shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-background/50 p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  What we will build first:
                </p>
                <ul className="space-y-1.5 text-xs text-muted-foreground">
                  {topRec.potential_challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-foreground/90">
                      <div className="size-1.5 rounded-full bg-primary/80 shrink-0 mt-1.5" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternative Recommendations Grid */}
      {otherRecs.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Other Strong Directions
          </h4>

          <div className="grid gap-4 sm:grid-cols-2">
            {otherRecs.map((rec) => (
              <div
                key={rec.career_code}
                className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm space-y-4 hover:border-primary/40 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-[10px] font-bold text-primary">
                      #{rec.rank} {rec.fit_label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {Math.round(rec.match_score * 100)}% fit
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground">
                      {rec.career_title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {rec.summary}
                    </p>
                  </div>

                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {rec.why.slice(0, 2).map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5 text-foreground/80">
                        <Check className="size-3 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl text-xs gap-1"
                    onClick={() => handleOpenComparison(topRec.career_code, rec.career_code)}
                  >
                    <Layers className="size-3" />
                    Compare
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-xl text-xs font-semibold gap-1"
                    disabled={isSelecting}
                    onClick={() => onSelectCareer(rec.career_code)}
                  >
                    <Zap className="size-3" />
                    Choose Path
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Explore Other Paths Fallback */}
      <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
        <div>
          <p className="text-xs font-semibold text-foreground">
            Want to explore another direction?
          </p>
          <p className="text-[11px] text-muted-foreground">
            Browse all supported careers across Data, AI, Software, and Cloud.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onExploreOther}
          className="rounded-xl text-xs gap-1.5"
        >
          <Compass className="size-3.5" />
          Browse Full Catalog
        </Button>
      </div>

      {/* Comparison Modal */}
      {selectedForComparison && comparisonTarget && (
        <CareerComparisonModal
          sessionId={sessionId}
          careerA={selectedForComparison}
          careerB={comparisonTarget}
          isOpen={Boolean(selectedForComparison && comparisonTarget)}
          onClose={() => {
            setSelectedForComparison(null);
            setComparisonTarget(null);
          }}
          onSelectCareer={onSelectCareer}
        />
      )}
    </div>
  );
}
