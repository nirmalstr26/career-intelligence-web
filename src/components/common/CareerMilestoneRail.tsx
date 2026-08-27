import React from "react";
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Target,
  Award,
  Layers,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MilestoneStage {
  id: string;
  name: string;
  status: "COMPLETED" | "CURRENT" | "STARTING" | "UPCOMING" | "TARGET";
  progressText: string;
  description: string;
}

const STAGES: MilestoneStage[] = [
  { id: "discover", name: "Discover", status: "COMPLETED", progressText: "Completed", description: "Data Engineer pathway selected" },
  { id: "assess", name: "Assess", status: "COMPLETED", progressText: "Completed", description: "AI baseline diagnostic score 82%" },
  { id: "learn", name: "Learn", status: "CURRENT", progressText: "67% through Phase 2", description: "SQL & Python foundation modules" },
  { id: "practice", name: "Practice", status: "STARTING", progressText: "2 missions ready", description: "Hands-on data pipeline exercises" },
  { id: "demonstrate", name: "Demonstrate", status: "UPCOMING", progressText: "Project Verified", description: "Data Pipeline Rubric (88/100)" },
  { id: "placement", name: "Placement Ready", status: "TARGET", progressText: "85+ Verified Target", description: "Direct recruiter interview matching" },
];

export function CareerMilestoneRail({ className }: { className?: string }) {
  return (
    <div className={`surface-panel rounded-3xl p-6 sm:p-7 border border-border/80 bg-card space-y-6 shadow-sm ${className || ""}`}>
      <div>
        <h3 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Layers className="size-5 text-primary" />
          Career Journey Milestone Rail
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Your path from foundational competency to verified placement readiness.
        </p>
      </div>

      {/* Responsive Horizontal Stage Rail */}
      <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-1">
        {STAGES.map((st, i) => {
          const isCompleted = st.status === "COMPLETED";
          const isCurrent = st.status === "CURRENT";
          const isTarget = st.status === "TARGET";

          return (
            <div
              key={st.id}
              className={`p-3.5 rounded-2xl border transition-all text-xs space-y-1.5 ${
                isCurrent
                  ? "border-primary bg-primary/[0.06] shadow-sm ring-1 ring-primary/20"
                  : isCompleted
                  ? "border-emerald-500/25 bg-emerald-500/[0.03]"
                  : "border-border/60 bg-secondary/15 opacity-80"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                  Step 0{i + 1}
                </span>
                {isCompleted ? (
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                ) : isCurrent ? (
                  <span className="size-2 rounded-full bg-primary animate-pulse" />
                ) : isTarget ? (
                  <Target className="size-3.5 text-purple-600" />
                ) : (
                  <Clock className="size-3 text-muted-foreground" />
                )}
              </div>

              <strong className="font-bold text-foreground block">{st.name}</strong>

              <span
                className={`text-[11px] font-semibold block ${
                  isCurrent
                    ? "text-primary"
                    : isCompleted
                    ? "text-emerald-600"
                    : "text-muted-foreground"
                }`}
              >
                {st.progressText}
              </span>
            </div>
          );
        })}
      </div>

      {/* Next 3 Upcoming Milestones */}
      <div className="pt-2 border-t space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Zap className="size-3.5 text-primary" />
          Next 3 Priority Milestones
        </span>

        <div className="grid gap-2 sm:grid-cols-3 text-xs">
          <div className="p-3 rounded-2xl border border-primary/25 bg-primary/[0.03] space-y-1">
            <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold">1. Current</Badge>
            <span className="font-bold text-foreground block">Complete SQL Fundamentals</span>
            <span className="text-[11px] text-muted-foreground">Latest assessment: 82% · Est: ~25 mins</span>
          </div>

          <div className="p-3 rounded-2xl border bg-secondary/15 space-y-1">
            <Badge variant="outline" className="text-[9px] font-bold">2. Next</Badge>
            <span className="font-bold text-foreground block">Data Engineering Specialization</span>
            <span className="text-[11px] text-muted-foreground">Unlocks distributed pipeline track</span>
          </div>

          <div className="p-3 rounded-2xl border bg-secondary/15 space-y-1">
            <Badge variant="outline" className="text-[9px] font-bold">3. Upcoming</Badge>
            <span className="font-bold text-foreground block">Start Practical Pipeline Project</span>
            <span className="text-[11px] text-muted-foreground">Automated CSV quarantine & schema modeling</span>
          </div>
        </div>
      </div>
    </div>
  );
}
