import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Layers,
  FileText,
  Copy,
  Check,
  Award,
  BookOpen,
  MessageSquareCode,
  HelpCircle,
  Flame,
  Bot,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  useJobPrepPlan,
  useSimulateJobPrep,
  useUpdateJobPrepStatus,
} from "@/lib/careerai/hooks";

interface JobPreparationWorkspaceProps {
  opportunityId: string;
}

export const JobPreparationWorkspace: React.FC<JobPreparationWorkspaceProps> = ({
  opportunityId,
}) => {
  const navigate = useNavigate();
  const [selectedTimeMode, setSelectedTimeMode] = useState<"TODAY" | "THREE_DAYS" | "ONE_WEEK">("TODAY");
  const [selectedSimulatedActions, setSelectedSimulatedActions] = useState<string[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const planQuery = useJobPrepPlan(opportunityId);
  const simMutation = useSimulateJobPrep(opportunityId);
  const statusMutation = useUpdateJobPrepStatus(opportunityId);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleSimulationAction = (actionCode: string) => {
    const next = selectedSimulatedActions.includes(actionCode)
      ? selectedSimulatedActions.filter((a) => a !== actionCode)
      : [...selectedSimulatedActions, actionCode];
    setSelectedSimulatedActions(next);
    simMutation.mutate(next);
  };

  const handleUpdateStatus = (newStatus: string) => {
    statusMutation.mutate({ status: newStatus });
  };

  if (planQuery.isLoading) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-12 text-center animate-pulse space-y-4">
        <div className="h-6 w-56 bg-muted rounded-full mx-auto" />
        <div className="h-28 w-full max-w-lg bg-muted/50 rounded-2xl mx-auto" />
      </div>
    );
  }

  const plan = planQuery.data;
  if (!plan) return null;

  const activeTimePlan = plan.time_aware_plans.find((p) => p.mode === selectedTimeMode) || plan.time_aware_plans[0];
  const simResult = simMutation.data;
  const currentMatch = simResult ? simResult.projected_match_pct : plan.opportunity_match_pct;

  return (
    <div className="space-y-8">
      {/* 1. STICKY HEADER: OPPORTUNITY TITLE & 3-SCORE GAUGE */}
      <div className="relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.05] p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/20 text-primary border-none text-[10px] font-extrabold uppercase tracking-wider">
                Job-Specific Career Gap Optimizer
              </Badge>
              <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground">
                <Briefcase className="size-3 mr-1 text-primary" />
                {plan.company_name} · {plan.work_mode}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-none text-[10px] font-bold">
                {plan.application_status}
              </Badge>
            </div>

            <h1 className="font-display font-extrabold text-2xl lg:text-3xl text-foreground tracking-tight">
              Prepare for: {plan.job_title}
            </h1>

            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
              {plan.location} · Evidence-grounded readiness analysis comparing job requirements against what you can prove today.
            </p>
          </div>

          {/* 3 Separate Distinct Scores */}
          <div className="grid grid-cols-3 gap-3 shrink-0">
            <div className="rounded-2xl border border-primary/40 bg-primary/[0.04] p-3.5 text-center shadow-xs">
              <span className="text-[9px] font-bold text-primary uppercase tracking-wider block">
                Opportunity Match
              </span>
              <span className="font-display font-extrabold text-2xl text-primary">
                {Math.round(currentMatch)}%
              </span>
              <span className="text-[10px] text-primary/80 block mt-0.5 font-semibold">
                {simResult ? "Simulated" : "Specific JD Fit"}
              </span>
            </div>

            <div className="rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Career Readiness
              </span>
              <span className="font-display font-extrabold text-2xl text-foreground">
                {Math.round(plan.career_readiness_pct)}%
              </span>
              <span className="text-[10px] text-muted-foreground block mt-0.5 font-medium">
                Benchmark Track
              </span>
            </div>

            <div className="rounded-2xl border bg-background/80 p-3.5 text-center shadow-xs">
              <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
                Profile Alignment
              </span>
              <span className="font-display font-extrabold text-2xl text-foreground">
                {Math.round(plan.profile_alignment_pct)}%
              </span>
              <span className="text-[10px] text-purple-600 dark:text-purple-400 block mt-0.5 font-semibold">
                Positioning
              </span>
            </div>
          </div>
        </div>

        {/* Primary CTA and Recommendation Strip */}
        <div className="mt-6 pt-5 border-t border-border/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Badge
              className={`text-xs font-extrabold px-3 py-1 border-none ${
                plan.recommendation === "READY_TO_APPLY"
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : plan.recommendation === "APPLY_WHILE_IMPROVING"
                  ? "bg-primary/20 text-primary"
                  : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              }`}
            >
              {plan.recommendation.replace(/_/g, " ")}
            </Badge>
            <p className="text-xs text-foreground/90 font-medium">
              {plan.recommendation_rationale}
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => handleUpdateStatus("APPLIED")}
            className="text-xs font-bold shrink-0 h-9 gap-1.5 shadow-sm"
          >
            {plan.primary_cta_label} <ArrowRight className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* 2. SECTION: 6-COLUMN REQUIREMENT & EVIDENCE MATRIX */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 lg:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
          <div>
            <h3 className="font-display font-extrabold text-lg text-foreground flex items-center gap-2">
              <ShieldCheck className="size-5 text-primary" />
              Job Requirement & Verified Evidence Matrix
            </h3>
            <p className="text-xs text-muted-foreground">
              Direct proof comparison. Click any requirement to see diagnostic assessments, project rubrics, and benchmark standing.
            </p>
          </div>

          <Badge variant="outline" className="text-[11px] font-mono">
            {plan.requirement_matrix.filter((r) => r.evidence_status.startsWith("VERIFIED")).length} / {plan.requirement_matrix.length} Requirements Verified
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b bg-muted/40 text-muted-foreground font-bold">
                <th className="p-3">Requirement</th>
                <th className="p-3 text-center">Priority</th>
                <th className="p-3 text-center">Evidence Status</th>
                <th className="p-3 text-center">Your Score</th>
                <th className="p-3 text-center">Benchmark</th>
                <th className="p-3 text-right">Action & Proof</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {plan.requirement_matrix.map((row, idx) => {
                const isVerified = row.evidence_status.startsWith("VERIFIED") || row.evidence_status === "SUPPORTED";
                return (
                  <tr key={idx} className="hover:bg-muted/15 transition-colors">
                    <td className="p-3">
                      <div className="font-semibold text-foreground">{row.requirement_name}</div>
                      <div className="text-[10px] text-muted-foreground font-mono">{row.proof_details}</div>
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          row.priority === "MANDATORY"
                            ? "border-rose-500/40 text-rose-600 dark:text-rose-400"
                            : "border-border text-muted-foreground"
                        }`}
                      >
                        {row.priority}
                      </Badge>
                    </td>
                    <td className="p-3 text-center">
                      <Badge
                        className={`text-[9px] font-bold border-none ${
                          isVerified
                            ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                            : row.evidence_status === "LEARNING"
                            ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {row.evidence_status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="p-3 text-center font-mono font-bold">
                      {row.student_score !== null ? `${Math.round(row.student_score)}%` : "—"}
                    </td>
                    <td className="p-3 text-center">
                      {row.benchmark_status && (
                        <Badge variant="outline" className="text-[9px] font-mono">
                          {row.benchmark_status.replace("_", " ")}
                        </Badge>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      <Badge
                        className={`text-[9px] font-bold ${
                          row.action_label === "Strong"
                            ? "bg-emerald-500/15 text-emerald-600"
                            : row.action_label === "Improve"
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {row.action_label}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. SECTION: TIME-AWARE PREPARATION SCHEDULES ("BEST USE OF YOUR NEXT 2 HOURS") */}
      <div className="rounded-3xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 lg:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-border/60">
          <div className="space-y-1">
            <h3 className="font-display font-extrabold text-lg text-foreground flex items-center gap-2">
              <Zap className="size-5 text-primary" />
              Time-Aware Preparation Schedules
            </h3>
            <p className="text-xs text-muted-foreground">
              Ranked by requirement importance, gap severity, downstream unlocks, and estimated effort.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-2xl border border-border/80 text-xs font-bold">
            <button
              onClick={() => setSelectedTimeMode("TODAY")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTimeMode === "TODAY"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Apply Today (1.75 hrs)
            </button>
            <button
              onClick={() => setSelectedTimeMode("THREE_DAYS")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTimeMode === "THREE_DAYS"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              3 Days (4 hrs)
            </button>
            <button
              onClick={() => setSelectedTimeMode("ONE_WEEK")}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedTimeMode === "ONE_WEEK"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1 Week (8 hrs)
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="space-y-2">
          <h4 className="text-xs font-extrabold text-foreground uppercase tracking-wider">
            {activeTimePlan.headline}
          </h4>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeTimePlan.actions.map((act, i) => (
              <div
                key={i}
                className="rounded-2xl border bg-card p-4 space-y-3 flex flex-col justify-between hover:border-primary/50 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold">
                      {act.category}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                      <Clock className="size-3" /> ~{act.estimated_effort_minutes || act.estimated_minutes}m
                    </span>
                  </div>

                  <h5 className="font-bold text-xs text-foreground leading-snug">
                    {act.title}
                  </h5>

                  <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                    {act.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/40">
                  {act.cta_link ? (
                    <Button asChild size="sm" variant="outline" className="w-full text-xs font-bold gap-1 h-8">
                      <Link to={act.cta_link as any}>
                        {act.cta_label}
                        <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate({ to: "/app/practice" as any })}
                      className="w-full text-xs font-bold gap-1 h-8"
                    >
                      {act.cta_label}
                      <ArrowRight className="size-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. SECTION: WHAT-IF CANDIDATE SIMULATOR & CAREER GRAPH JOB OVERLAY */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* What-If Simulator */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
          <div className="pb-3 border-b">
            <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              "What If I Complete This?" Simulator
            </h3>
            <p className="text-xs text-muted-foreground">
              Select hypothetical completed tasks to project your updated match percentage.
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              { code: "ACT_SPARK_PRACTICE", label: "Complete Apache Spark Distributed Module (+8% match)" },
              { code: "ACT_LINKEDIN_FEATURE", label: "Feature Simple Data Pipeline on LinkedIn (+4% match)" },
              { code: "ACT_AWS_STORAGE_PRACTICE", label: "Complete AWS Cloud Storage Hands-On (+3% match)" },
            ].map((task) => (
              <label
                key={task.code}
                className="flex items-center gap-3 p-3 rounded-2xl border bg-muted/10 hover:bg-muted/20 cursor-pointer transition-all text-xs font-medium text-foreground"
              >
                <input
                  type="checkbox"
                  checked={selectedSimulatedActions.includes(task.code)}
                  onChange={() => handleToggleSimulationAction(task.code)}
                  className="rounded border-border size-4 text-primary"
                />
                <span>{task.label}</span>
              </label>
            ))}
          </div>

          {simResult && (
            <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">Projected Opportunity Match</span>
                <span className="font-display font-extrabold text-xl text-primary font-mono">
                  {simResult.projected_match_pct}%
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {simResult.simulation_note}
              </p>
            </div>
          )}
        </div>

        {/* Career Graph Job Overlay */}
        <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                Career Graph Job Overlay
              </h3>
              <p className="text-xs text-muted-foreground">
                Visualizing requirement paths from your verified nodes to {plan.company_name}.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs font-semibold h-8 gap-1">
              <Link to="/app/path">
                View Full Map <ExternalLink className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {plan.graph_overlay_nodes.map((node) => (
              <div
                key={node.id}
                className="p-3 rounded-2xl border bg-muted/10 flex items-center justify-between gap-2"
              >
                <span className="text-xs font-bold text-foreground truncate">{node.label}</span>
                <Badge
                  className={`text-[9px] font-bold border-none shrink-0 ${
                    node.overlay_status === "MET"
                      ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : node.overlay_status === "GAP_PRIORITY"
                      ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                      : "bg-primary/20 text-primary"
                  }`}
                >
                  {node.overlay_status.replace("_", " ")}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. SECTION: RESUME & LINKEDIN POSITIONING STUDIO */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 lg:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b">
          <div>
            <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              Resume & LinkedIn Positioning for {plan.company_name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Evidence-backed bullet points tailored specifically for this opportunity's keywords.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(plan.tailored_resume_bullets.join("\n"), "resume-tailored")}
            className="text-xs font-semibold gap-1.5 h-8"
          >
            {copiedKey === "resume-tailored" ? (
              <>
                <Check className="size-3.5 text-emerald-600" /> Copied Bullets!
              </>
            ) : (
              <>
                <Copy className="size-3.5" /> Copy Tailored Bullets
              </>
            )}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl border bg-muted/15 space-y-2">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">
              Tailored Resume Bullets
            </span>
            <div className="space-y-1.5 text-xs text-foreground/90 font-medium leading-relaxed">
              {plan.tailored_resume_bullets.map((b, i) => (
                <p key={i}>{b}</p>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border bg-muted/15 space-y-2">
            <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">
              LinkedIn Profile Strategy
            </span>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              {plan.linkedin_positioning_advice}
            </p>
          </div>
        </div>
      </div>

      {/* 6. SECTION: JOB-SPECIFIC INTERVIEW INTELLIGENCE & CLAIM DEFENSE */}
      <div className="rounded-3xl border border-border/80 bg-card p-6 lg:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b">
          <div>
            <h3 className="font-display font-extrabold text-base text-foreground flex items-center gap-2">
              <MessageSquareCode className="size-4 text-primary" />
              Job-Specific Interview Intelligence & Claim Defense
            </h3>
            <p className="text-xs text-muted-foreground">
              Anticipated interview drill areas tailored to this JD and your verified evidence.
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => navigate({ to: "/app/practice" as any })}
            className="text-xs font-bold gap-1.5 h-8 shadow-sm"
          >
            Practice for This Job <ArrowRight className="size-3.5" />
          </Button>
        </div>

        <div className="grid gap-3">
          {plan.interview_intelligence.map((q) => (
            <div key={q.question_id} className="p-4 rounded-2xl border bg-muted/10 space-y-2">
              <div className="flex items-center justify-between">
                <Badge className="bg-primary/10 text-primary border-none text-[9px] font-extrabold">
                  {q.category.replace("_", " ")}
                </Badge>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground font-semibold">Defensibility:</span>
                  <Badge
                    className={`text-[9px] font-bold border-none ${
                      q.student_defensibility === "HIGH"
                        ? "bg-emerald-500/20 text-emerald-600"
                        : "bg-amber-500/20 text-amber-600"
                    }`}
                  >
                    {q.student_defensibility}
                  </Badge>
                </div>
              </div>

              <h5 className="font-bold text-xs text-foreground leading-snug">
                "{q.question_text}"
              </h5>

              <div className="space-y-1 pt-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Key Proof Points to Mention:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-foreground/80">
                  {q.expected_proof_points.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              </div>

              <p className="text-[10px] text-primary/90 font-medium pt-1 border-t border-border/40">
                💡 SPAR Tip: {q.coaching_tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
