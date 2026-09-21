import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Home, Sparkles, Zap, X, Clock } from "lucide-react";

import { Chip, EmptyState, SectionCard, humanizeCode } from "@/components/app/ui";
import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { careerai } from "@/lib/careerai/client";
import { useStudentId } from "@/lib/careerai/hooks";
import type {
  AssessmentSummary,
  AttemptQuestion,
  AttemptResult,
  StartedAttempt,
} from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/app/diagnostic")({
  component: DiagnosticPage,
});

type Phase = "intro" | "in_progress" | "results";

function DiagnosticPage() {
  const studentId = useStudentId();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const assessmentsQuery = useQuery({
    queryKey: ["assessments"],
    queryFn: () => careerai.listAssessments(),
  });

  const [phase, setPhase] = useState<Phase>("intro");
  const [pulseMode, setPulseMode] = useState<"pulse" | "full">("pulse");
  const [attempt, setAttempt] = useState<StartedAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function begin(assessment: AssessmentSummary, mode: "pulse" | "full" = pulseMode) {
    setError(null);
    setBusy(true);
    try {
      const started = await careerai.startAttempt(studentId, assessment.id);
      let ordered = [...started.questions].sort((a, b) => a.display_order - b.display_order);

      if (mode === "pulse" && ordered.length > 5) {
        // Select 5 core representative questions across different domains:
        const targetSkills = ["PROGRAMMING", "SQL", "DATA_STRUCTURES", "SYSTEM_DESIGN", "ANALYTICAL_REASONING"];
        const selectedQuestions: AttemptQuestion[] = [];

        for (const skill of targetSkills) {
          const found = ordered.find((q) => q.skill_code === skill && !selectedQuestions.some(sq => sq.id === q.id));
          if (found) {
            selectedQuestions.push(found);
          }
        }

        // If fewer than 5 found, backfill from remaining
        if (selectedQuestions.length < 5) {
          for (const q of ordered) {
            if (selectedQuestions.length >= 5) break;
            if (!selectedQuestions.some(sq => sq.id === q.id)) {
              selectedQuestions.push(q);
            }
          }
        }

        ordered = selectedQuestions;
      }

      setAttempt({
        ...started,
        assessment: {
          ...started.assessment,
          name: mode === "pulse" ? "Career Foundation Skill Pulse" : started.assessment.name,
        },
        questions: ordered,
      });
      setAnswers({});
      setIndex(0);
      setResult(null);
      setPhase("in_progress");
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not start the assessment.");
    } finally {
      setBusy(false);
    }
  }

  function setSelection(question: AttemptQuestion, selected: string[]) {
    setAnswers((prev) => ({ ...prev, [question.id]: selected }));
  }

  async function saveCurrent(question: AttemptQuestion): Promise<boolean> {
    if (attempt === null) return false;
    const selected = answers[question.id] ?? [];
    if (selected.length === 0) return true; // nothing to save
    try {
      await careerai.saveResponse(attempt.attempt_id, question.id, selected);
      return true;
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not save your answer.");
      return false;
    }
  }

  async function next(question: AttemptQuestion) {
    setError(null);
    setBusy(true);
    const ok = await saveCurrent(question);
    setBusy(false);
    if (ok) setIndex((i) => i + 1);
  }

  async function finish(question: AttemptQuestion) {
    if (attempt === null) return;
    setError(null);
    setBusy(true);
    const ok = await saveCurrent(question);
    if (!ok) {
      setBusy(false);
      return;
    }
    try {
      const scored = await careerai.completeAttempt(attempt.attempt_id);
      setResult(scored);
      setPhase("results");
      // Career intelligence changed — force the dashboard to refetch.
      await queryClient.invalidateQueries({ queryKey: ["career-intelligence", studentId] });
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : "Could not submit the assessment.");
    } finally {
      setBusy(false);
    }
  }

  function restart() {
    setPhase("intro");
    setAttempt(null);
    setAnswers({});
    setIndex(0);
    setResult(null);
    setError(null);
  }

  if (phase === "results" && result !== null) {
    return <ResultsView result={result} onRestart={restart} />;
  }

  if (phase === "in_progress" && attempt !== null) {
    const question = attempt.questions[index];
    if (question === undefined) {
      return (
        <SectionCard title="No questions">
          <p className="text-sm text-muted-foreground">This assessment has no questions.</p>
          <Button variant="outline" className="mt-4" onClick={restart}>
            Back
          </Button>
        </SectionCard>
      );
    }
    return (
      <QuestionView
        assessmentName={attempt.assessment.name}
        question={question}
        index={index}
        total={attempt.questions.length}
        selected={answers[question.id] ?? []}
        onSelect={(sel) => setSelection(question, sel)}
        onBack={() => setIndex((i) => Math.max(0, i - 1))}
        onNext={() => void next(question)}
        onFinish={() => void finish(question)}
        onExit={() => void navigate({ to: "/app/today" })}
        busy={busy}
        error={error}
      />
    );
  }

  // intro
  return (
    <div className="mx-auto max-w-[760px] space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void navigate({ to: "/app/today" })}
          className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          Back to Career Cockpit
        </Button>
      </div>

      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
          <Sparkles className="size-3.5" />
          <span>Baseline Technical Calibration</span>
        </div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Skill Diagnostic</h1>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
          Quickly calibrate your starting placement readiness score so SPAR can personalize your curriculum and avoid repeating topics you already know.
        </p>
      </header>

      {error !== null ? (
        <p role="alert" className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      {/* Mode Selector Card */}
      <div className="grid gap-3.5 sm:grid-cols-2">
        <div
          onClick={() => setPulseMode("pulse")}
          className={cn(
            "relative cursor-pointer rounded-2xl border p-5 transition-all",
            pulseMode === "pulse"
              ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
              : "border-border bg-card hover:border-border/80 hover:bg-surface"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              <Zap className="size-3 fill-current" />
              Recommended · ~3 Mins
            </span>
            <div className={cn("size-4 rounded-full border flex items-center justify-center", pulseMode === "pulse" ? "border-primary bg-primary" : "border-muted-foreground/30")}>
              {pulseMode === "pulse" && <div className="size-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <h3 className="font-display text-base font-bold text-foreground">5-Question Skill Pulse</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            Fast, high-impact check across Programming, SQL, Data Structures, Systems, and Logic. Perfect for day-1 setup.
          </p>
        </div>

        <div
          onClick={() => setPulseMode("full")}
          className={cn(
            "relative cursor-pointer rounded-2xl border p-5 transition-all",
            pulseMode === "full"
              ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/40"
              : "border-border bg-card hover:border-border/80 hover:bg-surface"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <Clock className="size-3" />
              Comprehensive · ~15 Mins
            </span>
            <div className={cn("size-4 rounded-full border flex items-center justify-center", pulseMode === "full" ? "border-primary bg-primary" : "border-muted-foreground/30")}>
              {pulseMode === "full" && <div className="size-1.5 rounded-full bg-white" />}
            </div>
          </div>
          <h3 className="font-display text-base font-bold text-foreground">Full Foundation Diagnostic</h3>
          <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
            In-depth 22-question assessment across all foundational engineering competencies for an exhaustive benchmark.
          </p>
        </div>
      </div>

      {assessmentsQuery.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
          <InlineSpinner /> Loading assessment details&hellip;
        </div>
      ) : assessmentsQuery.data === undefined || assessmentsQuery.data.length === 0 ? (
        <SectionCard>
          <EmptyState
            icon={<ClipboardList className="size-6" />}
            title="No assessments available"
            description="There are no active assessments right now. Check back soon."
            action={
              <Button asChild variant="outline">
                <Link to="/app/today">
                  <Home className="size-4 mr-2" />
                  Back to Cockpit
                </Link>
              </Button>
            }
          />
        </SectionCard>
      ) : (
        <div>
          {assessmentsQuery.data.slice(0, 1).map((assessment) => (
            <div key={assessment.id} className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-bold">
                    {pulseMode === "pulse" ? "Career Foundation Skill Pulse" : assessment.name}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {pulseMode === "pulse" ? "5 high-signal questions · ~3 minutes" : "22 questions · ~15 minutes"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Chip>{pulseMode === "pulse" ? "5 Questions" : "22 Questions"}</Chip>
                  <Chip>{pulseMode === "pulse" ? "~3 min" : "~15 min"}</Chip>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  size="lg"
                  className="w-full gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-md"
                  disabled={busy}
                  onClick={() => void begin(assessment, pulseMode)}
                >
                  {busy ? <InlineSpinner /> : <Zap className="size-4 fill-current" />}
                  {pulseMode === "pulse" ? "Begin 3-Min Skill Pulse" : "Begin Full Diagnostic"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface QuestionViewProps {
  assessmentName: string;
  question: AttemptQuestion;
  index: number;
  total: number;
  selected: string[];
  onSelect: (selected: string[]) => void;
  onBack: () => void;
  onNext: () => void;
  onFinish: () => void;
  onExit?: () => void;
  busy: boolean;
  error: string | null;
}

function QuestionView({
  assessmentName,
  question,
  index,
  total,
  selected,
  onSelect,
  onBack,
  onNext,
  onFinish,
  onExit,
  busy,
  error,
}: QuestionViewProps) {
  const isMulti = question.question_type === "MULTI_SELECT";
  const isLast = index === total - 1;
  const hasOptions = question.options.length > 0;
  const answered = selected.length > 0 && selected.some((s) => s.trim() !== "");
  const progress = Math.round(((index + 1) / total) * 100);

  function toggle(key: string) {
    if (isMulti) {
      onSelect(selected.includes(key) ? selected.filter((k) => k !== key) : [...selected, key]);
    } else {
      onSelect([key]);
    }
  }

  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            {assessmentName}
          </p>
          {onExit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExit}
              className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-7 px-2"
            >
              <X className="size-3.5" />
              Save & Exit to Cockpit
            </Button>
          )}
        </div>
        <div className="mt-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Question {index + 1} of {total}
          </span>
          <span>{progress}%</span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div className="h-full gradient-primary" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <SectionCard>
        <h2 className="font-display text-lg font-semibold">{question.question_text}</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {humanizeCode(question.difficulty)}
          {isMulti ? " \u00b7 Select all that apply" : ""}
        </p>

        <div className="mt-5 space-y-2.5">
          {hasOptions ? (
            question.options.map((option) => {
              const active = selected.includes(option.key);
              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => toggle(option.key)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                    active
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border hover:border-primary/50 hover:bg-surface",
                  )}
                  aria-pressed={active}
                >
                  <span
                    className={cn(
                      "grid size-5 shrink-0 place-items-center rounded-full border text-[10px] font-semibold",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border",
                    )}
                  >
                    {option.key}
                  </span>
                  {option.text}
                </button>
              );
            })
          ) : (
            <textarea
              className="w-full rounded-xl border border-input bg-background/60 px-3.5 py-2.5 text-sm text-foreground focus:border-primary/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={5}
              placeholder={"Type your answer\u2026"}
              value={selected[0] ?? ""}
              onChange={(event) => onSelect(event.target.value === "" ? [] : [event.target.value])}
            />
          )}
        </div>

        {error !== null ? (
          <p role="alert" className="mt-4 text-sm text-coral">
            {error}
          </p>
        ) : null}
      </SectionCard>

      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} disabled={index === 0 || busy}>
          <ArrowLeft />
          Back
        </Button>
        {isLast ? (
          <Button variant="hero" onClick={onFinish} disabled={busy || !answered}>
            {busy ? <InlineSpinner /> : null}
            Submit
            <CheckCircle2 />
          </Button>
        ) : (
          <Button variant="hero" onClick={onNext} disabled={busy || !answered}>
            {busy ? <InlineSpinner /> : null}
            Next
            <ArrowRight />
          </Button>
        )}
      </div>
    </div>
  );
}

function ResultsView({ result, onRestart }: { result: AttemptResult; onRestart: () => void }) {
  return (
    <div className="mx-auto max-w-[720px] space-y-6">
      <SectionCard>
        <div className="flex flex-col items-center py-4 text-center">
          <span className="grid size-14 place-items-center rounded-2xl bg-secondary text-primary">
            <CheckCircle2 className="size-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold">Diagnostic complete</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Your overall score is{" "}
            <span className="numeric font-semibold text-foreground">
              {Math.round(result.overall_score)}
            </span>{" "}
            / 100. CareerAI has updated your intelligence.
          </p>
        </div>
      </SectionCard>

      {result.skill_results.length > 0 ? (
        <SectionCard title="Skill breakdown">
          <ul className="space-y-3">
            {[...result.skill_results]
              .sort((a, b) => b.score - a.score)
              .map((s) => (
                <li key={s.skill_code} className="flex items-center justify-between gap-3">
                  <span className="text-sm">{humanizeCode(s.skill_code)}</span>
                  <span className="numeric text-sm font-semibold">{Math.round(s.score)}</span>
                </li>
              ))}
          </ul>
        </SectionCard>
      ) : null}

      <div className="flex flex-wrap gap-3">
        <Button asChild variant="hero">
          <Link to="/app/today">
            <Home />
            Back to Cockpit
          </Link>
        </Button>
        <Button variant="outline" onClick={onRestart}>
          Take another
        </Button>
      </div>
    </div>
  );
}
