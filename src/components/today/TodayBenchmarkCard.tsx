import React from "react";
import { Link } from "@tanstack/react-router";
import { TrendingUp, Users, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useStudentBenchmark } from "@/lib/careerai/hooks";

export const TodayBenchmarkCard: React.FC = () => {
  const benchmarkQuery = useStudentBenchmark();
  const data = benchmarkQuery.data;

  if (!data || data.insufficient_sample || !data.available) {
    return null;
  }

  const distToTop20 = data.thresholds?.distance_to_top_20 || 0;

  return (
    <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] p-5 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge className="bg-primary/20 text-primary border-none text-[10px] font-extrabold uppercase tracking-wider">
            Competitive Position
          </Badge>
          <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
            <Users className="size-3" /> {data.cohort_size} cohort learners
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
          ↑ Active Track
        </span>
      </div>

      <div className="flex items-baseline justify-between">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display font-extrabold text-3xl text-foreground">
              {data.percentile}
            </span>
            <span className="font-display font-bold text-lg text-primary">th</span>
            <span className="text-xs text-muted-foreground font-semibold ml-1">Percentile</span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {distToTop20 > 0
              ? `${distToTop20} readiness pts away from Top 20% benchmark`
              : "Reached Top 20% Placement Tier"}
          </p>
        </div>

        <Badge variant="outline" className="text-xs font-bold border-primary/40 text-primary px-3 py-1">
          {(data.competitive_band || "STRONG").replace("_", " ")}
        </Badge>
      </div>

      <p className="text-xs text-foreground/90 bg-muted/20 p-3 rounded-2xl border border-border/50 leading-relaxed">
        {data.competitive_gaps && data.competitive_gaps.length > 0
          ? `${data.competitive_gaps[0]} is your largest remaining gap holding you back from the Top 20% tier.`
          : "Your verified competencies meet or exceed all cohort benchmark thresholds."}
      </p>

      <div className="pt-1">
        <Button asChild variant="outline" size="sm" className="w-full text-xs font-bold gap-1 border-primary/30 text-primary hover:bg-primary/10">
          <Link to="/app/progress" search={{ tab: "benchmark" } as any}>
            View Detailed Benchmark Breakdown
            <ArrowRight className="size-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
