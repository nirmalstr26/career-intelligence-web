import { Link } from "@tanstack/react-router";
import {
  Clock,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  ArrowRight,
  BookOpen,
  Award,
  Layers,
  HelpCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { humanizeCode } from "@/components/app/ui";
import { cn } from "@/lib/utils";
import type { CurriculumModule, ModuleState } from "@/lib/careerai/types";

interface ModuleCardProps {
  module: CurriculumModule;
  onStart?: (moduleCode: string) => void;
  isStarting?: boolean;
  compact?: boolean;
}

export function getModuleStateBadge(state: ModuleState) {
  switch (state) {
    case "RECOMMENDED":
      return {
        label: "Recommended",
        icon: Sparkles,
        className: "bg-primary/20 text-primary border-primary/40",
      };
    case "IN_PROGRESS":
      return {
        label: "In Progress",
        icon: Play,
        className: "bg-warning/20 text-warning border-warning/40",
      };
    case "COMPLETED":
      return {
        label: "Completed",
        icon: CheckCircle2,
        className: "bg-success/20 text-success border-success/40",
      };
    case "AVAILABLE":
      return {
        label: "Available",
        icon: BookOpen,
        className: "bg-secondary text-foreground border-border",
      };
    case "NEEDS_IMPROVEMENT":
      return {
        label: "Needs Review",
        icon: AlertCircle,
        className: "bg-destructive/20 text-destructive border-destructive/40",
      };
    case "SKIPPED_BY_ASSESSMENT":
      return {
        label: "Tested Out",
        icon: Award,
        className: "bg-violet/20 text-violet border-violet/40",
      };
    case "LOCKED":
    default:
      return {
        label: "Locked",
        icon: Lock,
        className: "bg-muted/40 text-muted-foreground border-border/40",
      };
  }
}

export function ModuleCard({
  module,
  onStart,
  isStarting = false,
  compact = false,
}: ModuleCardProps) {
  const isLocked = module.state === "LOCKED";
  const isCompleted =
    module.state === "COMPLETED" || module.state === "SKIPPED_BY_ASSESSMENT";
  const isInProgress = module.state === "IN_PROGRESS";
  const isRecommended = module.state === "RECOMMENDED";
  const stateBadge = getModuleStateBadge(module.state);
  const StateIcon = stateBadge.icon;

  const difficultyColors: Record<string, string> = {
    BEGINNER: "text-success border-success/30 bg-success/10",
    INTERMEDIATE: "text-primary border-primary/30 bg-primary/10",
    ADVANCED: "text-violet border-violet/30 bg-violet/10",
  };

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between rounded-2xl border bg-card/60 p-5 transition-all backdrop-blur",
        isRecommended &&
          "border-primary/50 shadow-[0_0_24px_-4px_rgba(34,211,238,0.15)] ring-1 ring-primary/30",
        isInProgress && "border-warning/50 ring-1 ring-warning/30",
        isCompleted && "border-success/30 bg-success/[0.02]",
        isLocked && "opacity-75 border-border/50 bg-card/30",
        !isLocked && "hover:border-border-strong hover:bg-card/90 hover:shadow-lg",
      )}
    >
      <div>
        {/* Top Badges & Time */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide",
                stateBadge.className,
              )}
            >
              <StateIcon className="size-3" />
              {stateBadge.label}
            </span>
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] uppercase font-mono tracking-wider",
                difficultyColors[module.difficulty] ?? "text-muted-foreground",
              )}
            >
              {module.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3.5" />
            <span>{module.estimated_minutes} mins</span>
          </div>
        </div>

        {/* Title & Description */}
        <h3
          className={cn(
            "font-display text-base font-bold tracking-tight text-foreground transition-colors",
            !isLocked && "group-hover:text-primary",
          )}
        >
          {module.title}
        </h3>

        {module.description ? (
          <p
            className={cn(
              "mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2",
              compact && "line-clamp-1",
            )}
          >
            {module.description}
          </p>
        ) : null}

        {/* Skills Developed */}
        {module.skill_codes && module.skill_codes.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1">
            {module.skill_codes.map((sk) => (
              <span
                key={sk}
                className="rounded-md bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-secondary-foreground"
              >
                {humanizeCode(sk)}
              </span>
            ))}
          </div>
        ) : null}

        {/* Locked Reason */}
        {isLocked && module.prerequisite_module_codes.length > 0 ? (
          <div className="mt-3 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5 font-medium text-foreground/80">
              <Lock className="size-3 text-muted-foreground" />
              Prerequisites required:
            </div>
            <p className="mt-0.5 text-xs">
              Complete {module.prerequisite_module_codes.map(humanizeCode).join(", ")} to unlock.
            </p>
          </div>
        ) : null}

        {/* In Progress progress bar */}
        {isInProgress && module.content_progress_pct > 0 ? (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{module.content_progress_pct}%</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full bg-warning transition-all duration-500"
                style={{ width: `${module.content_progress_pct}%` }}
              />
            </div>
          </div>
        ) : null}

        {/* Score if completed */}
        {isCompleted && module.assessment_score !== null ? (
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-success">
            <CheckCircle2 className="size-4" />
            <span>Passed with {Math.round(module.assessment_score)}% score</span>
          </div>
        ) : null}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-border/40">
        {isLocked ? (
          <Button variant="ghost" size="sm" className="w-full text-muted-foreground cursor-not-allowed" disabled>
            <Lock className="mr-1.5 size-3.5" />
            Locked
          </Button>
        ) : isInProgress ? (
          <Button asChild size="sm" className="w-full bg-warning text-warning-foreground hover:bg-warning/90 font-semibold shadow-sm">
            <Link to="/app/learn/$moduleCode" params={{ moduleCode: module.code }}>
              <Play className="mr-1.5 size-3.5 fill-current" />
              Continue Learning
            </Link>
          </Button>
        ) : isCompleted ? (
          <Button asChild variant="outline" size="sm" className="w-full border-success/40 text-success hover:bg-success/10">
            <Link to="/app/learn/$moduleCode" params={{ moduleCode: module.code }}>
              <BookOpen className="mr-1.5 size-3.5" />
              Review Content
            </Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant={isRecommended ? "hero" : "default"} className="w-full font-semibold">
            <Link to="/app/learn/$moduleCode" params={{ moduleCode: module.code }}>
              {isRecommended ? (
                <>
                  <Sparkles className="mr-1.5 size-3.5" />
                  Start Recommended
                </>
              ) : (
                <>
                  Start Module
                  <ArrowRight className="ml-1.5 size-3.5" />
                </>
              )}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
