import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  BookOpen,
  TrendingUp,
  Sun,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CurriculumModule } from "@/lib/careerai/types";

interface ModuleCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  completedModule: CurriculumModule;
  newlyUnlocked: CurriculumModule[];
  score?: number | null;
}

export function ModuleCompletionModal({
  open,
  onOpenChange,
  completedModule,
  newlyUnlocked,
  score,
}: ModuleCompletionModalProps) {
  const navigate = useNavigate();

  const nextRecommended =
    newlyUnlocked.find((m) => m.state === "RECOMMENDED" || m.state === "AVAILABLE") ??
    newlyUnlocked[0];

  const handleContinueNext = () => {
    onOpenChange(false);
    if (nextRecommended) {
      void navigate({
        to: "/app/learn/$moduleCode",
        params: { moduleCode: nextRecommended.code },
      });
    } else {
      void navigate({ to: "/app/today" });
    }
  };

  const handleReturnToday = () => {
    onOpenChange(false);
    void navigate({ to: "/app/today" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-surface/95 p-6 backdrop-blur shadow-2xl rounded-3xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-success/20 text-success ring-8 ring-success/10 shadow-lg">
            <CheckCircle2 className="size-8" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
            Nice Progress!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            <strong className="text-foreground">{completedModule.title}</strong> completed successfully.
          </DialogDescription>
        </DialogHeader>

        {/* Score & Skill Improvement Summary */}
        <div className="my-2 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl border border-border/70 bg-card/80 p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-muted-foreground block">Assessment Score</span>
            <span className="font-display text-2xl font-bold text-foreground">
              {score !== null && score !== undefined ? `${score}%` : "Passed"}
            </span>
          </div>

          <div className="rounded-2xl border border-success/30 bg-success/[0.08] p-3.5 text-center">
            <span className="text-[10px] uppercase font-bold text-success block">Skill Signal</span>
            <span className="font-display text-base font-bold text-success flex items-center justify-center gap-1 mt-1">
              <TrendingUp className="size-4" />
              Verified & Updated
            </span>
          </div>
        </div>

        {/* Newly Unlocked Modules */}
        {newlyUnlocked.length > 0 ? (
          <div className="my-2 rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <span className="flex items-center gap-1.5">
                <Sparkles className="size-3.5" />
                Unlocked Next Step:
              </span>
              <Badge className="bg-primary text-primary-foreground text-[10px]">Ready to Start</Badge>
            </div>

            <div className="space-y-2">
              {newlyUnlocked.map((mod) => (
                <div
                  key={mod.code}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/90 px-3.5 py-2.5 text-xs shadow-sm"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-bold text-foreground truncate">{mod.title}</p>
                    <p className="text-[10px] text-muted-foreground">Phase: {mod.phase_name} · ~{mod.estimated_minutes} mins</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/20 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                    Unlocked
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="my-2 rounded-xl border border-border/60 bg-card/50 p-3 text-center text-xs text-muted-foreground">
            Your learning plan progress and Career Readiness have been updated!
          </div>
        )}

        {/* Footer CTAs */}
        <DialogFooter className="flex flex-col gap-2.5 sm:flex-col sm:space-x-0 mt-3">
          {nextRecommended ? (
            <Button
              size="lg"
              variant="hero"
              onClick={handleContinueNext}
              className="w-full font-bold gap-2 text-sm shadow-lg"
            >
              <span>Continue My Journey ({nextRecommended.title})</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              size="lg"
              variant="hero"
              onClick={handleReturnToday}
              className="w-full font-bold gap-2 text-sm"
            >
              <span>Continue My Journey</span>
              <ArrowRight className="size-4" />
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={handleReturnToday}
            className="w-full text-xs font-semibold gap-1.5"
          >
            <Sun className="size-3.5 text-primary" />
            Back to Today Dashboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
