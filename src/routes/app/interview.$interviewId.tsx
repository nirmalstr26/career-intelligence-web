import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Award,
  Zap,
  HelpCircle,
  BookOpen,
  MessageSquare,
  TrendingUp,
  Layers,
  ChevronRight,
  Code,
} from "lucide-react";

import {
  useInterviewSession,
  useSubmitInterviewAnswer,
  useStartInterview,
} from "@/lib/careerai/hooks";
import { InterviewTurn, InterviewImprovementAction } from "@/lib/careerai/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionCard, InlineSpinner } from "@/components/app/ui";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

export const Route = createFileRoute("/app/interview/$interviewId")({
  component: MockInterviewRoomPage,
});

function MockInterviewRoomPage() {
  const { interviewId } = Route.useParams();
  const navigate = useNavigate();
  const sessionQuery = useInterviewSession(interviewId);
  const submitMutation = useSubmitInterviewAnswer();
  const startMutation = useStartInterview();

  const [studentAnswer, setStudentAnswer] = useState("");
  const [expandedTurns, setExpandedTurns] = useState<Record<string, boolean>>({});

  const session = sessionQuery.data;

  if (sessionQuery.isLoading) {
    return (
      <div className="flex min-h-[500px] flex-col items-center justify-center gap-3">
        <InlineSpinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your AI Mock Interview session...
        </p>
      </div>
    );
  }

  if (sessionQuery.isError || !session) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <SectionCard className="border-destructive/30 text-center py-8">
          <AlertCircle className="mx-auto size-10 text-destructive mb-3" />
          <h2 className="text-lg font-semibold text-foreground">Interview Session Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            The requested mock interview session could not be loaded or has expired.
          </p>
          <Button asChild>
            <Link to="/app/practice">Return to Practice Hub</Link>
          </Button>
        </SectionCard>
      </div>
    );
  }

  const isCompleted = session.status === "COMPLETED";
  const currentTurn = session.current_turn;
  const turns = session.turns || [];

  const toggleTurnExpand = (id: string) => {
    setExpandedTurns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitAnswer = async (isDontKnow = false) => {
    if (!isDontKnow && !studentAnswer.trim()) return;

    try {
      const res = await submitMutation.mutateAsync({
        sessionId: session.id,
        student_answer: isDontKnow ? "" : studentAnswer.trim(),
        is_dont_know: isDontKnow,
      });
      setStudentAnswer("");
      if (res.is_completed) {
        // Automatically expand all turns in report
        const allExpanded: Record<string, boolean> = {};
        res.session.turns.forEach((t) => {
          allExpanded[t.id] = true;
        });
        setExpandedTurns(allExpanded);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    }
  };

  const handleRetake = async () => {
    try {
      const res = await startMutation.mutateAsync(session.interview_code);
      navigate({
        to: "/app/interview/$interviewId",
        params: { interviewId: res.session.id },
      });
    } catch (err) {
      console.error("Failed to start new attempt:", err);
    }
  };

  // -------------------------------------------------------------------------
  // VIEW: COMPLETED INTERVIEW REPORT
  // -------------------------------------------------------------------------
  if (isCompleted) {
    const totalScore = session.total_score ?? 0;
    const readinessLevel = session.readiness_level ?? "Developing";

    return (
      <div className="mx-auto max-w-5xl space-y-8 py-4">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/app/practice" className="hover:text-foreground transition-colors">
              Practice
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Mock Interview Report</span>
            <Badge variant="outline" className="ml-2 border-primary/30 text-primary">
              Attempt #{session.attempt_number}
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetake}
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? (
                <InlineSpinner className="size-3.5 mr-1.5" />
              ) : (
                <RotateCcw className="size-3.5 mr-1.5" />
              )}
              Retake Interview (Attempt #{session.attempt_number + 1})
            </Button>
            <Button size="sm" asChild>
              <Link to="/app/today">Continue Guided Path</Link>
            </Button>
          </div>
        </div>

        {/* Hero Score Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-none font-semibold">
                  <ShieldCheck className="size-3.5 mr-1 text-primary" /> Verified Interview Evidence Created
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {session.interview_title}
                </Badge>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Mock Interview Evaluation Report
              </h1>
              <p className="text-sm text-muted-foreground">
                Comprehensive multi-dimensional assessment evaluating technical accuracy, problem solving, practical application, and project defense.
              </p>
            </div>

            {/* Score Ring / Badge */}
            <div className="flex items-center gap-4 bg-background/80 backdrop-blur border rounded-xl p-4 shadow-sm">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-primary">
                  {totalScore.toFixed(1)}
                  <span className="text-sm font-normal text-muted-foreground">/100</span>
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
                  Interview Score
                </div>
              </div>
              <div className="h-10 w-[1px] bg-border" />
              <div>
                <Badge
                  className={
                    totalScore >= 80
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : totalScore >= 65
                      ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30"
                  }
                >
                  {readinessLevel}
                </Badge>
                <div className="text-[11px] text-muted-foreground mt-1">
                  {totalScore >= 75 ? "Ready for company rounds" : "Foundation sharpening recommended"}
                </div>
              </div>
            </div>
          </div>

          {/* AI Overall Assessment Markdown */}
          {session.overall_feedback && (
            <div className="mt-6 pt-6 border-t border-border/60">
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                <MarkdownRenderer content={session.overall_feedback} />
              </div>
            </div>
          )}
        </div>

        {/* 6-Dimension Deterministic Rubric Breakdown */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Award className="size-5 text-primary" />
              Deterministic 6-Dimension Rubric Evaluation
            </h2>
            <span className="text-xs text-muted-foreground">
              Total Rubric Weight: 100 Points
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {session.rubric_scores.map((rubric) => {
              const pct = Math.round((rubric.score / rubric.max_score) * 100);
              return (
                <div
                  key={rubric.criterion_id}
                  className="rounded-xl border bg-card p-4 space-y-3 shadow-sm hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-sm text-foreground">
                      {rubric.criterion_name}
                    </h3>
                    <Badge variant="outline" className="font-mono text-xs font-bold">
                      {rubric.score.toFixed(1)} / {rubric.max_score}
                    </Badge>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-rose-500"
                      }`}
                      style={{ width: `${Math.min(100, Math.max(5, pct))}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {rubric.feedback}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Strongest Areas & Growth Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Strengths */}
          <SectionCard className="border-emerald-500/20 bg-emerald-500/[0.02]">
            <h3 className="text-base font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 mb-3">
              <CheckCircle2 className="size-5" />
              Demonstrated Strengths
            </h3>
            <ul className="space-y-2.5">
              {session.strongest_areas.map((strength, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </SectionCard>

          {/* Needs Improvement */}
          <SectionCard className="border-amber-500/20 bg-amber-500/[0.02]">
            <h3 className="text-base font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-2 mb-3">
              <TrendingUp className="size-5" />
              Priority Growth Areas
            </h3>
            <ul className="space-y-2.5">
              {session.needs_improvement.map((area, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-600 text-xs font-bold mt-0.5">
                    !
                  </span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </SectionCard>
        </div>

        {/* Top 3 Actionable Next Steps */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="size-5 text-amber-500" />
            Recommended Improvement Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {session.improvement_actions.map((act) => (
              <div
                key={act.id}
                className="flex flex-col justify-between rounded-xl border bg-card p-4 shadow-sm hover:border-primary/40 transition-colors"
              >
                <div className="space-y-2">
                  <Badge variant="outline" className="text-[11px] uppercase tracking-wider">
                    {act.action_type}
                  </Badge>
                  <h4 className="font-semibold text-sm text-foreground leading-snug">
                    {act.title}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {act.reason}
                  </p>
                </div>
                <Button size="sm" className="mt-4 w-full" asChild>
                  <Link to={act.cta_link}>
                    {act.cta_text}
                    <ArrowRight className="size-3.5 ml-1.5" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Turn-by-Turn Question Transcript & Model Answer Structure */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="size-5 text-primary" />
              Question-by-Question Deep Dive ({turns.length} Questions)
            </h2>
            <span className="text-xs text-muted-foreground">
              Click any question to view good points, gaps, and better answer models
            </span>
          </div>

          <div className="space-y-3">
            {turns.map((turn) => {
              const isExpanded = expandedTurns[turn.id] ?? true;
              return (
                <div
                  key={turn.id}
                  className="overflow-hidden rounded-xl border bg-card transition-colors"
                >
                  {/* Accordion Header */}
                  <button
                    type="button"
                    onClick={() => toggleTurnExpand(turn.id)}
                    className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                        Q{turn.turn_number}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 uppercase">
                            {turn.competency}
                          </Badge>
                          {turn.turn_number === 5 && (
                            <Badge className="bg-primary/20 text-primary text-[10px] border-none px-1.5 py-0">
                              Project Defense
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-medium text-foreground line-clamp-1">
                          {turn.question_text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {turn.score !== null && turn.score !== undefined && (
                        <Badge
                          variant="secondary"
                          className={`font-mono text-xs font-bold ${
                            turn.score >= 80
                              ? "text-emerald-600 dark:text-emerald-400"
                              : turn.score >= 60
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {turn.score.toFixed(0)} / 100
                        </Badge>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Accordion Body */}
                  {isExpanded && (
                    <div className="border-t px-5 py-4 space-y-4 bg-muted/10">
                      {/* Full Question Text */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Interviewer Prompt
                        </span>
                        <p className="text-sm font-medium text-foreground bg-secondary/30 p-3 rounded-lg border">
                          {turn.question_text}
                        </p>
                      </div>

                      {/* Student's Answer */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Your Answer
                        </span>
                        <div className="text-sm text-foreground/90 bg-card p-3 rounded-lg border italic">
                          {turn.student_answer || "(No answer provided)"}
                        </div>
                      </div>

                      {/* Evaluation Breakdown Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        {/* What was good */}
                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.03] p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <Check className="size-3.5" />
                            What Was Good
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {turn.what_was_good || "Good conceptual framework."}
                          </p>
                        </div>

                        {/* What was missing */}
                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.03] p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                            <AlertCircle className="size-3.5" />
                            What Was Missing / Edge Cases
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">
                            {turn.what_was_missing || "Could address scaling constraints."}
                          </p>
                        </div>
                      </div>

                      {/* Better Answer Structure */}
                      {turn.better_answer_structure && (
                        <div className="rounded-lg border border-primary/20 bg-primary/[0.03] p-3 space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                            <Sparkles className="size-3.5" />
                            Better Answer Structure & Engineering Practice
                          </div>
                          <p className="text-xs font-mono text-foreground/90 leading-relaxed bg-background/80 p-2.5 rounded border border-border/50">
                            {turn.better_answer_structure}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Retake & Coach Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl border bg-card shadow-sm">
          <div>
            <h4 className="font-semibold text-base text-foreground">
              Ready to improve your score?
            </h4>
            <p className="text-sm text-muted-foreground mt-0.5">
              Each new attempt adapts questions based on your latest skill signals and project defense.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleRetake}
              disabled={startMutation.isPending}
            >
              {startMutation.isPending ? (
                <InlineSpinner className="size-4 mr-2" />
              ) : (
                <RotateCcw className="size-4 mr-2" />
              )}
              Retake Mock Interview
            </Button>
            <Button asChild>
              <Link to="/app/coach?prompt=Help%20me%20prepare%20for%20my%20next%20Data%20Engineering%20technical%20interview">
                <Bot className="size-4 mr-2" />
                Ask SPAR Coach
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // VIEW: LIVE ACTIVE INTERVIEW ROOM
  // -------------------------------------------------------------------------
  const currentTurnNumber = currentTurn?.turn_number ?? session.current_turn_index;
  const totalTurns = session.total_turns;
  const progressPct = Math.round((currentTurnNumber / totalTurns) * 100);

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link to="/app/practice" className="hover:text-foreground">
              Practice
            </Link>
            <span>/</span>
            <span>Mock Interview</span>
            <Badge variant="outline" className="ml-1 text-[11px]">
              Attempt #{session.attempt_number}
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-foreground mt-1">
            {session.interview_title}
          </h1>
        </div>

        {/* Progress & Competency */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xs font-semibold text-foreground">
              Question {currentTurnNumber} of {totalTurns}
            </div>
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 justify-end">
              <Clock className="size-3" /> ~2 mins per question
            </div>
          </div>
          <div className="w-24 bg-secondary rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Transcript of previous turns */}
      {turns
        .filter((t) => t.turn_number < currentTurnNumber && t.student_answer)
        .map((prevTurn) => (
          <div key={prevTurn.id} className="space-y-3 opacity-80 hover:opacity-100 transition-opacity">
            {/* Interviewer Q */}
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                <Bot className="size-4" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-muted/60 px-4 py-3 text-sm text-foreground/90 max-w-[85%] border">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                  Question {prevTurn.turn_number} · {prevTurn.competency}
                </div>
                {prevTurn.question_text}
              </div>
            </div>

            {/* Student Answer */}
            <div className="flex items-start justify-end gap-3">
              <div className="rounded-2xl rounded-tr-none bg-primary/10 border border-primary/20 px-4 py-3 text-sm text-foreground max-w-[85%]">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1 text-right">
                  Your Answer
                </div>
                {prevTurn.student_answer}
              </div>
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground border">
                <User className="size-4" />
              </div>
            </div>
          </div>
        ))}

      {/* Active Question Box */}
      {currentTurn && (
        <div className="space-y-6 pt-2">
          {/* Active Question Card */}
          <div className="relative overflow-hidden rounded-2xl border-2 border-primary/30 bg-card p-6 shadow-md">
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <Bot className="size-6" />
              </div>
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="font-semibold text-xs">
                    Question {currentTurn.turn_number} of {totalTurns}
                  </Badge>
                  <Badge variant="outline" className="text-xs uppercase tracking-wider text-primary border-primary/30">
                    {currentTurn.competency}
                  </Badge>
                  {currentTurn.turn_number === 5 && (
                    <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30 text-xs">
                      Practical Project Defense
                    </Badge>
                  )}
                </div>
                <h2 className="text-lg md:text-xl font-medium text-foreground leading-relaxed pt-1">
                  {currentTurn.question_text}
                </h2>
              </div>
            </div>
          </div>

          {/* Student Response Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-foreground flex items-center gap-1.5">
                <User className="size-3.5 text-primary" />
                Type your answer below:
              </span>
              <span>{studentAnswer.length} characters</span>
            </div>

            <textarea
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Explain your approach clearly. For design/pipeline questions, mention data structures, error handling, idempotency, and scaling trade-offs..."
              rows={6}
              disabled={submitMutation.isPending}
              className="w-full resize-y rounded-xl border border-input bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm leading-relaxed"
            />

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleSubmitAnswer(true)}
                disabled={submitMutation.isPending}
                className="text-muted-foreground hover:text-foreground text-xs"
              >
                <HelpCircle className="size-3.5 mr-1.5" />
                I Don't Know / Skip Question
              </Button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={() => handleSubmitAnswer(false)}
                  disabled={submitMutation.isPending || !studentAnswer.trim()}
                  className="w-full sm:w-auto font-medium"
                >
                  {submitMutation.isPending ? (
                    <>
                      <InlineSpinner className="size-4 mr-2" />
                      Evaluating with AI Interviewer...
                    </>
                  ) : (
                    <>
                      Submit Answer
                      <ArrowRight className="size-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
