import React from "react";
import { Award, CheckCircle2, Lock, ShieldCheck, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface AchievementItem {
  id: string;
  title: string;
  category: string;
  earnedDate?: string | null;
  isUnlocked: boolean;
  whyItMatters: string;
  iconColor: string;
}

const ACHIEVEMENTS: AchievementItem[] = [
  {
    id: "foundations",
    title: "Foundation Builder",
    category: "Curriculum",
    earnedDate: "Aug 2026",
    isUnlocked: true,
    whyItMatters: "Completed Core Technology & Computer Science Fundamentals with verified diagnostic mastery.",
    iconColor: "text-emerald-500 bg-emerald-500/15",
  },
  {
    id: "sql_verified",
    title: "SQL Verified",
    category: "Assessment",
    earnedDate: "Aug 2026",
    isUnlocked: true,
    whyItMatters: "Demonstrated 92% mastery on advanced SQL aggregations and window functions.",
    iconColor: "text-primary bg-primary/15",
  },
  {
    id: "project_builder",
    title: "Project Builder",
    category: "Practical Project",
    earnedDate: "Aug 2026",
    isUnlocked: true,
    whyItMatters: "Built 'Simple Data Pipeline' with verified automated error quarantine handling (Score: 88/100).",
    iconColor: "text-purple-500 bg-purple-500/15",
  },
  {
    id: "interview_growth",
    title: "Interview Growth (+12 pts)",
    category: "Mock Interview",
    earnedDate: "Aug 2026",
    isUnlocked: true,
    whyItMatters: "Demonstrated strong technical project defense and error-recovery explanation (Score: 68.5/100).",
    iconColor: "text-amber-500 bg-amber-500/15",
  },
  {
    id: "profile_ready",
    title: "Career Profile Ready",
    category: "Professional Profile",
    earnedDate: "Aug 2026",
    isUnlocked: true,
    whyItMatters: "Structured evidence-backed resume and LinkedIn profile reached 82% readiness.",
    iconColor: "text-blue-500 bg-blue-500/15",
  },
  {
    id: "placement_ready",
    title: "Placement Ready (85+)",
    category: "Career Milestone",
    earnedDate: null,
    isUnlocked: false,
    whyItMatters: "Crosses the verified 85% placement benchmark for direct recruiter interview matching.",
    iconColor: "text-muted-foreground bg-secondary",
  },
];

export function AchievementShowcase({
  compact = false,
  className,
}: {
  compact?: boolean;
  className?: string;
}) {
  const items = compact ? ACHIEVEMENTS.slice(0, 4) : ACHIEVEMENTS;

  return (
    <div className={`surface-panel rounded-3xl p-6 sm:p-7 border border-border/80 bg-card space-y-4 shadow-sm ${className || ""}`}>
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
            <Award className="size-5 text-amber-500" />
            Verified Career Milestones & Achievements
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Earned through verified skill tests, project code rubrics, and technical mock interviews.
          </p>
        </div>

        <Badge className="bg-amber-500/15 text-amber-600 border-none font-bold text-xs">
          5 / 6 Unlocked
        </Badge>
      </div>

      <div className={`grid gap-3 ${compact ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {items.map((ach) => (
          <div
            key={ach.id}
            className={`p-4 rounded-2xl border transition-all space-y-2 text-xs ${
              ach.isUnlocked
                ? "bg-card hover:border-primary/40 shadow-sm"
                : "bg-secondary/15 border-dashed border-border/60 opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className={`size-8 rounded-xl flex items-center justify-center font-bold ${ach.iconColor}`}>
                {ach.isUnlocked ? <Award className="size-4" /> : <Lock className="size-4" />}
              </div>

              {ach.isUnlocked ? (
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-3" /> {ach.earnedDate}
                </span>
              ) : (
                <Badge variant="outline" className="text-[9px]">Locked</Badge>
              )}
            </div>

            <div>
              <strong className="font-bold text-foreground block text-sm">{ach.title}</strong>
              <span className="text-[10px] text-primary font-semibold uppercase tracking-wider block">
                {ach.category}
              </span>
            </div>

            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {ach.whyItMatters}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
