import React from "react";
import { Compass, CheckCircle2, TrendingUp, Sparkles } from "lucide-react";

export function StatsFloatingCard() {
  return (
    <div className="w-full max-w-lg rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 p-3.5 backdrop-blur-xl shadow-xl space-y-3 transition-colors">
      {/* 3 Core Pilot Pillars */}
      <div className="rounded-xl border border-border/60 bg-secondary/40 dark:bg-card/40 p-2.5">
        <div className="grid grid-cols-3 divide-x divide-border/60 text-center">
          {/* Pillar 1 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400 mb-0.5">
              <Compass className="size-3.5" />
              <span className="font-display text-xs sm:text-sm font-bold text-foreground">Personalized</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Career Pathways</span>
          </div>

          {/* Pillar 2 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 mb-0.5">
              <CheckCircle2 className="size-3.5" />
              <span className="font-display text-xs sm:text-sm font-bold text-foreground">Verified</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Hands-On Practice</span>
          </div>

          {/* Pillar 3 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 mb-0.5">
              <TrendingUp className="size-3.5" />
              <span className="font-display text-xs sm:text-sm font-bold text-foreground">Continuous</span>
            </div>
            <span className="text-[10px] text-muted-foreground font-medium">Readiness Tracking</span>
          </div>
        </div>
      </div>

      {/* Trust & Capability Badge */}
      <div className="flex items-center justify-between px-1 text-left">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-500">
            <Sparkles className="size-3" />
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            Full-stack career intelligence operating system
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 rounded-full px-2 py-0.5 border border-cyan-500/20">
          Pilot Active
        </span>
      </div>
    </div>
  );
}
