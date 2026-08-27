import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Award,
  Layers,
  BookOpen,
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
import { humanizeCode } from "@/components/app/ui";
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
      void navigate({ to: "/app/plan" });
    }
  };

  const handleReturnPlan = () => {
    onOpenChange(false);
    void navigate({ to: "/app/plan" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-border/80 bg-surface/95 p-6 backdrop-blur shadow-2xl rounded-3xl">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-3 grid size-14 place-items-center rounded-2xl bg-success/20 text-success ring-8 ring-success/10 shadow-lg">
            <CheckCircle2 className="size-8" />
          </div>
          <DialogTitle className="font-display text-2xl font-bold tracking-tight text-foreground">
            Module Completed!
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {score !== null && score !== undefined ? (
              <span>
                You scored <strong className="text-foreground">{score}%</strong> on{" "}
                <span className="text-primary font-medium">{completedModule.title}</span>.
              </span>
            ) : (
              <span>
                Great job completing{" "}
                <span className="text-primary font-medium">{completedModule.title}</span>.
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Newly Unlocked Modules */}
        {newlyUnlocked.length > 0 ? (
          <div className="my-3 rounded-2xl border border-primary/30 bg-primary/[0.04] p-4 space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
              <Sparkles className="size-3.5" />
              Newly Unlocked Modules
            </div>
            <div className="space-y-2">
              {newlyUnlocked.map((mod) => (
                <div
                  key={mod.code}
                  className="flex items-center justify-between rounded-xl border border-border/60 bg-card/80 px-3 py-2 text-xs"
                >
                  <div className="min-w-0 pr-2">
                    <p className="font-semibold text-foreground truncate">{mod.title}</p>
                    <p className="text-[10px] text-muted-foreground">{mod.estimated_minutes} mins</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Available
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="my-2 rounded-xl border border-border/60 bg-card/50 p-3 text-center text-xs text-muted-foreground">
            Your learning plan progress has been updated!
          </div>
        )}

        <DialogFooter className="flex flex-col gap-2 sm:flex-col sm:space-x-0 mt-2">
          {nextRecommended ? (
            <Button
              size="lg"
              variant="hero"
              onClick={handleContinueNext}
              className="w-full font-semibold gap-2"
            >
              <span>Continue to {nextRecommended.title}</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : null}
          <Button
            variant="outline"
            size="lg"
            onClick={handleReturnPlan}
            className="w-full text-xs font-medium"
          >
            Return to Career Plan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
