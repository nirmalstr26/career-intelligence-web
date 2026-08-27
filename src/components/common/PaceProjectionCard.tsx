import React from "react";
import { Clock, Zap, Target, TrendingUp, CheckCircle2, Award, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function PaceProjectionCard({
  currentScore = 78,
  targetScore = 85,
  weeklyGrowth = 3.2,
  completedActivitiesCount = 3,
  hoursInvested = "4h 20m",
  readinessGain = 4,
}: {
  currentScore?: number;
  targetScore?: number;
  weeklyGrowth?: number;
  completedActivitiesCount?: number;
  hoursInvested?: string;
  readinessGain?: number;
}) {
  const pointsRemaining = Math.max(0, targetScore - currentScore);
  const weeksLow = Math.max(1, Math.round(pointsRemaining / (weeklyGrowth * 1.3)));
  const weeksHigh = Math.max(weeksLow + 1, Math.round(pointsRemaining / (weeklyGrowth * 0.8)));

  return (
    <div className="surface-panel rounded-3xl p-6 sm:p-7 border border-border/80 bg-card space-y-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <Clock className="size-5 text-primary" />
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground">
            At Your Current Pace
          </h3>
        </div>
        <Badge className="bg-primary/15 text-primary border-none text-[10px] font-bold">
          Estimated Projection
        </Badge>
      </div>

      {/* Target Range Anchor */}
      <div className="rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.06] via-card to-card p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-semibold">Placement-Ready Target (85%)</span>
          <span className="font-mono font-bold text-primary">
            {pointsRemaining} points remaining
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight flex items-baseline gap-2">
          <span>~{weeksLow}–{weeksHigh} weeks</span>
          <span className="text-xs font-normal text-muted-foreground">estimated time to target</span>
        </div>

        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Based on your average growth of <strong className="text-foreground">+{weeklyGrowth} points/week</strong> across verified milestones.
        </p>
      </div>

      {/* Momentum Stats */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Zap className="size-3.5 text-amber-500" />
          Weekly Momentum
        </span>

        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-2xl border bg-secondary/15">
            <span className="text-lg font-black text-foreground block">{completedActivitiesCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Activities</span>
          </div>

          <div className="p-3 rounded-2xl border bg-secondary/15">
            <span className="text-lg font-black text-foreground block">{hoursInvested}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Time Invested</span>
          </div>

          <div className="p-3 rounded-2xl border bg-emerald-500/10 border-emerald-500/20">
            <span className="text-lg font-black text-emerald-600 block">+{readinessGain}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-bold">Readiness Gain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
