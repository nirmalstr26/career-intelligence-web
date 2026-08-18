import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Home } from "lucide-react";

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

  const assessmentsQuery = useQuery({
    queryKey: ["assessments"],
    queryFn: () => careerai.listAssessments(),
  });

  const [phase, setPhase] = useState<Phase>("intro");
  const [attempt, setAttempt] = useState<StartedAttempt | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<AttemptResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function begin(assessment: AssessmentSummary) {
    setError(null);
    setBusy(true);
    try {
      const started = await careerai.startAttempt(studentId, assessment.id);
      const ordered = [...started.questions].sort((a, b) => a.display_order - b.display_order);
      setAttempt({ ...started, questions: ordered });
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
        busy={busy}
        error={error}
      />
    );
  }

  // intro
  return (
    <div className="space-y-6">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Diagnostic</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Answer a few questions so CareerAI can measure your skills and refine your career fit.
        </p>
      </header>

      {error !== null ? (
        <p role="alert" className="rounded-xl border border-coral/40 bg-coral/10 px-4 py-3 text-sm">
          {error}
        </p>
      ) : null}

      {assessmentsQuery.isLoading ? (
        <div className="flex items-center gap-2 text-muted-foreground">
          <InlineSpinner /> Loading assessments&hellip;
        </div>
      ) : assessmentsQuery.data === undefined || assessmentsQuery.data.length === 0 ? (
        <SectionCard>
          <EmptyState
            icon={<ClipboardList className="size-6" />}
            title="No assessments available"
            description="There are no active assessments right now. Check back soon."
            action={
              <Button asChild variant="outline">
                <Link to="/app/home">
                  <Home />
                  Back to dashboard
                </Link>
              </Button>
            }
          />
        </SectionCard>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {assessmentsQuery.data.map((assessment) => (
            <SectionCard key={assessment.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold">{assessment.name}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Chip>{humanizeCode(assessment.assessment_type)}</Chip>
                    {assessment.estimated_minutes !== null ? (
                      <Chip>~{assessment.estimated_minutes} min</Chip>
                    ) : null}
                  </div>
                </div>
              </div>
              <Button
                variant="hero"
                className="mt-5 w-full"
                disabled={busy}
                onClick={() => void begin(assessment)}
              >
                {busy ? <InlineSpinner /> : null}
                Begin
                <ArrowRight />
              </Button>
            </SectionCard>
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
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {assessmentName}
        </p>
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
          <Link to="/app/home">
            <Home />
            Back to dashboard
          </Link>
        </Button>
        <Button variant="outline" onClick={onRestart}>
          Take another
        </Button>
      </div>
    </div>
  );
}
