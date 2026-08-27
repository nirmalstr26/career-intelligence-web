import { Check, Compass, Target, BookOpen, Wrench, Award, Trophy } from "lucide-react";
import type { JourneyStageInfo } from "@/lib/careerai/journeyResolver";
import { cn } from "@/lib/utils";

interface JourneyStripProps {
  stages: JourneyStageInfo[];
  className?: string;
}

const STAGE_ICONS = {
  discover: Compass,
  assess: Target,
  learn: BookOpen,
  practice: Wrench,
  demonstrate: Award,
  placement_ready: Trophy,
};

export function JourneyStrip({ stages, className }: JourneyStripProps) {
  return (
    <div className={cn("surface-panel rounded-2xl p-4 sm:p-5 border border-border/70", className)}>
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            Student Journey
          </span>
          <span className="text-xs text-muted-foreground">· Your path to placement readiness</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-primary animate-ping" />
          <span className="text-[11px] font-semibold text-primary">You are here</span>
        </div>
      </div>

      <div className="relative">
        {/* Step Track Line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-border/60 -z-0 hidden md:block" />

        {/* Stages Grid / Flex */}
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-6 md:gap-2">
          {stages.map((stage) => {
            const Icon = STAGE_ICONS[stage.id] || BookOpen;

            return (
              <div
                key={stage.id}
                className={cn(
                  "relative flex flex-col items-center text-center p-2.5 rounded-xl transition-all",
                  stage.isCurrent
                    ? "bg-primary/10 border border-primary/40 ring-1 ring-primary/30 shadow-sm"
                    : stage.isCompleted
                      ? "bg-card/40 border border-border/40 opacity-80"
                      : "bg-surface/30 border border-transparent opacity-50",
                )}
              >
                {/* Node circle */}
                <div
                  className={cn(
                    "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5",
                    stage.isCurrent
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary/30"
                      : stage.isCompleted
                        ? "bg-success/20 text-success border border-success/30"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {stage.isCompleted ? (
                    <Check className="size-4 stroke-[2.5]" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                </div>

                {/* Stage Label */}
                <p
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    stage.isCurrent
                      ? "text-primary"
                      : stage.isCompleted
                        ? "text-foreground"
                        : "text-muted-foreground",
                  )}
                >
                  {stage.label}
                </p>

                {/* Micro description */}
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1 hidden sm:block">
                  {stage.description}
                </p>

                {/* Current Stage Indicator */}
                {stage.isCurrent && (
                  <span className="mt-1 inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-bold text-primary sm:hidden">
                    Current
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
