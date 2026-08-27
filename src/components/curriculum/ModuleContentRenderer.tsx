import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Code2,
  Lightbulb,
  Terminal,
  HelpCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionCard } from "@/components/app/ui";
import { cn } from "@/lib/utils";
import type { CurriculumModule, ModuleContentSection, KnowledgeQuestion } from "@/lib/careerai/types";

interface ModuleContentRendererProps {
  module: CurriculumModule;
  onSubmitAssessment: (score: number, timeSpentMinutes: number) => void;
  isSubmitting?: boolean;
}

export function ModuleContentRenderer({
  module,
  onSubmitAssessment,
  isSubmitting = false,
}: ModuleContentRendererProps) {
  const sections = module.content?.sections ?? [];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [openExercises, setOpenExercises] = useState<Record<number, boolean>>({});

  // Collect knowledge check questions
  const knowledgeSections = sections.filter(
    (s): s is ModuleContentSection & { questions: KnowledgeQuestion[] } =>
      s.type === "knowledge_check" && Array.isArray(s.questions) && s.questions.length > 0,
  );
  const allQuestions = knowledgeSections.flatMap((s) => s.questions);

  const handleSelectAnswer = (questionId: string, choice: string) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choice,
    }));
  };

  const handleCopyCode = (codeText: string, index: number) => {
    void navigator.clipboard.writeText(codeText);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const toggleExercise = (index: number) => {
    setOpenExercises((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Evaluate quiz
  const handleScoreAndSubmit = () => {
    if (allQuestions.length === 0) {
      onSubmitAssessment(100, module.estimated_minutes);
      return;
    }

    let correctCount = 0;
    allQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct) {
        correctCount += 1;
      }
    });

    const scorePct = Math.round((correctCount / allQuestions.length) * 100);
    setQuizSubmitted(true);
    onSubmitAssessment(scorePct, module.estimated_minutes);
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isAllAnswered = allQuestions.length > 0 && answeredCount >= allQuestions.length;

  return (
    <div className="space-y-8">
      {/* 1. Why This Matters Section */}
      {module.why_it_matters ? (
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 backdrop-blur">
          <div className="flex items-start gap-3.5">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
              <Lightbulb className="size-5" />
            </span>
            <div>
              <h3 className="font-display text-base font-bold text-foreground">
                Why this matters for your career
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                {module.why_it_matters}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* 2. Core Learning Sections */}
      {sections.length > 0 ? (
        <div className="space-y-6">
          {sections.map((section, idx) => {
            if (section.type === "text") {
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/70 bg-card/50 p-6 backdrop-blur space-y-3"
                >
                  {section.heading ? (
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {section.heading}
                    </h3>
                  ) : null}
                  {section.body ? (
                    <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                      {section.body}
                    </p>
                  ) : null}
                </div>
              );
            }

            if (section.type === "code") {
              return (
                <div
                  key={idx}
                  className="overflow-hidden rounded-2xl border border-border/80 bg-zinc-950 p-0 shadow-lg font-mono"
                >
                  <div className="flex items-center justify-between border-b border-border/40 bg-zinc-900/80 px-4 py-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5 text-zinc-300">
                      <Terminal className="size-3.5" />
                      {section.language ?? "python"}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(section.code ?? "", idx)}
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100 transition-colors"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="size-3.5 text-success" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="p-4 text-xs leading-relaxed text-zinc-200 overflow-x-auto">
                    <code>{section.code}</code>
                  </pre>
                </div>
              );
            }

            if (section.type === "exercise") {
              const isOpen = openExercises[idx] ?? false;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-warning/30 bg-warning/[0.02] p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-warning font-semibold text-sm">
                      <Code2 className="size-4" />
                      Hands-on Practice Activity
                    </div>
                    {section.solution ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExercise(idx)}
                        className="text-xs text-muted-foreground gap-1"
                      >
                        {isOpen ? "Hide solution" : "Show solution"}
                        {isOpen ? <ChevronUp className="size-3.5" /> : <ChevronDown className="size-3.5" />}
                      </Button>
                    ) : null}
                  </div>
                  <p className="text-sm text-foreground font-medium">{section.prompt}</p>
                  {isOpen && section.solution ? (
                    <div className="rounded-xl border border-border/60 bg-zinc-950 p-4 font-mono text-xs text-zinc-300">
                      <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">
                        Sample Solution
                      </p>
                      <pre className="whitespace-pre-wrap">{section.solution}</pre>
                    </div>
                  ) : null}
                </div>
              );
            }

            return null;
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
          <BookOpen className="mx-auto size-8 text-primary/60 mb-2" />
          <h3 className="font-display text-base font-semibold">Interactive Learning Material</h3>
          <p className="mt-1 text-sm text-muted-foreground max-w-md mx-auto">
            {module.learning_objective ?? "Review the concepts and take the knowledge check below to verify your mastery."}
          </p>
        </div>
      )}

      {/* 3. Knowledge Check Assessment Section */}
      {allQuestions.length > 0 ? (
        <section
          aria-label="Knowledge Check"
          className="rounded-3xl border border-border bg-surface p-6 sm:p-8 backdrop-blur space-y-6"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="grid size-7 place-items-center rounded-lg bg-primary/20 text-primary">
                  <HelpCircle className="size-4" />
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">
                  Knowledge Check
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Answer the questions below. Pass threshold: {module.min_pass_score ?? 60}% to complete this module.
              </p>
            </div>
            <Badge variant="outline" className="self-start sm:self-center font-mono text-xs">
              {answeredCount} of {allQuestions.length} answered
            </Badge>
          </div>

          {/* Question List */}
          <div className="space-y-6">
            {allQuestions.map((q, qIndex) => {
              const selected = selectedAnswers[q.id];
              const isCorrect = selected === q.correct;

              return (
                <div
                  key={q.id}
                  className="rounded-2xl border border-border/60 bg-card/50 p-5 space-y-3"
                >
                  <p className="text-sm font-semibold text-foreground">
                    <span className="mr-2 text-primary font-mono">{qIndex + 1}.</span>
                    {q.text}
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {q.choices.map((choice) => {
                      const isChoiceSelected = selected === choice;
                      let choiceClasses = "border-border/60 hover:bg-secondary/60 text-muted-foreground";

                      if (quizSubmitted) {
                        if (choice === q.correct) {
                          choiceClasses = "border-success/60 bg-success/15 text-success font-semibold";
                        } else if (isChoiceSelected && !isCorrect) {
                          choiceClasses = "border-destructive/60 bg-destructive/15 text-destructive font-medium";
                        }
                      } else if (isChoiceSelected) {
                        choiceClasses = "border-primary bg-primary/15 text-foreground font-medium ring-1 ring-primary/40";
                      }

                      return (
                        <button
                          key={choice}
                          type="button"
                          disabled={quizSubmitted}
                          onClick={() => handleSelectAnswer(q.id, choice)}
                          className={cn(
                            "flex items-center justify-between rounded-xl border p-3 text-left text-xs transition-all",
                            choiceClasses,
                          )}
                        >
                          <span>{choice}</span>
                          {quizSubmitted && choice === q.correct ? (
                            <CheckCircle2 className="size-4 shrink-0 text-success" />
                          ) : quizSubmitted && isChoiceSelected && !isCorrect ? (
                            <XCircle className="size-4 shrink-0 text-destructive" />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Submit Action */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              {quizSubmitted
                ? "Assessment recorded! Check your result above."
                : "Submit when you've answered all questions to unlock the next module."}
            </p>
            <Button
              size="lg"
              variant="hero"
              disabled={(!isAllAnswered && allQuestions.length > 0) || isSubmitting}
              onClick={handleScoreAndSubmit}
              className="font-semibold gap-2"
            >
              {isSubmitting ? (
                <>Submitting...</>
              ) : quizSubmitted ? (
                <>
                  <CheckCircle2 className="size-4" />
                  Re-submit Assessment
                </>
              ) : (
                <>
                  Complete Module
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </section>
      ) : (
        /* Standalone module completion button if no quiz questions exist */
        <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground">
              Ready to complete this module?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Mark this module complete to update your learning plan and unlock dependent topics.
            </p>
          </div>
          <Button
            size="lg"
            variant="hero"
            disabled={isSubmitting}
            onClick={() => onSubmitAssessment(100, module.estimated_minutes)}
            className="font-semibold gap-2 self-start sm:self-center"
          >
            <CheckCircle2 className="size-4" />
            {isSubmitting ? "Completing..." : "Mark as Completed"}
          </Button>
        </div>
      )}
    </div>
  );
}
