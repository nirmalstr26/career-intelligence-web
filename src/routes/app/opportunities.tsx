import { JobPreparationWorkspace } from '@/components/opportunities/JobPreparationWorkspace';
import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Briefcase,
  Sparkles,
  ShieldCheck,
  Clock,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Send,
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Copy,
  PlusCircle,
  Eye,
  Check,
  RotateCcw,
  Zap,
  Target,
  ArrowRight,
  BookOpen,
} from "lucide-react";

import {
  Chip,
  Meter,
  PageError,
  PageLoading,
  SectionCard,
  humanizeCode,
} from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useOpportunities,
  useOpportunityFit,
  useParseJobDescription,
  useJobApplications,
  useCreateJobApplication,
  useUpdateJobApplicationStatus,
  usePlacementActivity,
} from "@/lib/careerai/hooks";
import {
  OpportunitySummary,
  StudentOpportunityFit,
  JobDescriptionParseResult,
  JobApplicationItem,
} from "@/lib/careerai/types";
import { ContextualCoachCard } from "@/components/coach/ContextualCoachCard";

export const Route = createFileRoute("/app/opportunities")({
  component: OpportunitiesPage,
});

function OpportunitiesPage() {
  const oppsQuery = useOpportunities("DATA_ENGINEER");
  const appsQuery = useJobApplications();
  const placementQuery = usePlacementActivity();
  const parseJDMutation = useParseJobDescription();
  const createApplicationMutation = useCreateJobApplication();
  const updateStatusMutation = useUpdateJobApplicationStatus();

  const [activeTab, setActiveTab] = useState<"matched" | "prepare" | "parser" | "tracker">("matched");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);

  // JD Parser state
  const [rawJDText, setRawJDText] = useState("");
  const [jdRoleTitle, setJdRoleTitle] = useState("");
  const [jdCompany, setJdCompany] = useState("");
  const [parsedResult, setParsedResult] = useState<JobDescriptionParseResult | null>(null);

  // Selected app for interview prep viewer
  const [viewingInterviewAppId, setViewingInterviewAppId] = useState<string | null>(null);

  const fitQuery = useOpportunityFit(selectedOpportunityId);

  if (oppsQuery.isLoading || appsQuery.isLoading) {
    return <PageLoading label="Loading career opportunities & matching…" />;
  }

  if (oppsQuery.isError || !oppsQuery.data || appsQuery.isError || !appsQuery.data) {
    return (
      <PageError
        onRetry={() => {
          void oppsQuery.refetch();
          void appsQuery.refetch();
        }}
      />
    );
  }

  const opportunities = oppsQuery.data;
  const applications = appsQuery.data;
  const placement = placementQuery.data || {
    opportunities_reviewed: opportunities.length,
    applications_submitted: 0,
    active_interviews: 0,
    offers_received: 0,
  };

  const handleParseJD = async () => {
    if (!rawJDText.trim()) return;
    try {
      const res = await parseJDMutation.mutateAsync({
        raw_jd_text: rawJDText,
        role_title: jdRoleTitle || undefined,
        company_name: jdCompany || undefined,
      });
      setParsedResult(res);
    } catch (err) {
      console.error("Failed to parse JD:", err);
    }
  };

  const handleCreateApplication = async (oppId: string | null, company: string, role: string, status = "APPLIED") => {
    try {
      await createApplicationMutation.mutateAsync({
        opportunity_id: oppId,
        company,
        role,
        status,
        notes: `Tracked from ${oppId ? "Opportunity Browser" : "Pasted JD"}.`,
      });
      setActiveTab("tracker");
    } catch (err) {
      console.error("Failed to track application:", err);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      await updateStatusMutation.mutateAsync({
        applicationId: appId,
        status: newStatus,
        notes: `Status updated to ${newStatus}.`,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-primary/20 text-primary border-none text-[10px] font-semibold">
              Opportunity Intelligence & Pipeline
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              Data Engineer Pathway
            </Badge>
          </div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
            Internship & Job Opportunity Matching
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Deterministic capability matching grounded in your verified projects, rubric scores, and mock interview performance.
          </p>
        </div>

        {/* Stats Pill */}
        <div className="flex items-center gap-2 rounded-2xl bg-card border px-4 py-2 shadow-sm text-xs">
          <div className="text-center px-2 border-r">
            <div className="font-bold text-foreground">{placement.opportunities_reviewed}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Reviewed</div>
          </div>
          <div className="text-center px-2 border-r">
            <div className="font-bold text-primary">{placement.applications_submitted}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Applied</div>
          </div>
          <div className="text-center px-2">
            <div className="font-bold text-emerald-600">{placement.active_interviews}</div>
            <div className="text-[9px] text-muted-foreground uppercase">Interviews</div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("matched")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "matched"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Briefcase className="size-3.5" />
          Matched Opportunities ({opportunities.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("prepare")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "prepare"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Zap className="size-3.5" />
          <span>Gap Optimizer & Prep</span>
          <Badge className="bg-primary/20 text-primary border-none text-[9px] px-1.5 py-0 font-bold">
            NEW
          </Badge>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("parser")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "parser"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Sparkles className="size-3.5" />
          Paste Job Description (JD Parser)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tracker")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "tracker"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Target className="size-3.5" />
          Application Tracker ({applications.length})
          {placement.active_interviews > 0 && (
            <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-bold">
              {placement.active_interviews}
            </span>
          )}
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: MATCHED OPPORTUNITIES */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "matched" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {opportunities.map((opp) => (
              <div
                key={opp.id}
                className="surface-panel rounded-3xl p-5 border border-border/80 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm bg-card"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge
                        className={`text-[10px] font-bold border-none ${
                          opp.match_category === "READY_TO_APPLY"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : opp.match_category === "APPLY_WHILE_IMPROVING"
                            ? "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            : "bg-rose-500/15 text-rose-600"
                        }`}
                      >
                        {opp.match_category.replace(/_/g, " ")}
                      </Badge>
                      <h3 className="font-bold text-base text-foreground mt-1.5 leading-snug">
                        {opp.title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-primary font-medium mt-0.5">
                        <Building2 className="size-3.5 shrink-0" />
                        <span>{opp.company}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center justify-center size-12 rounded-2xl bg-secondary/50 border text-center shrink-0">
                      <span className="text-sm font-extrabold text-foreground">
                        {opp.match_score.toFixed(0)}%
                      </span>
                      <span className="text-[8px] text-muted-foreground uppercase font-semibold">
                        Fit
                      </span>
                    </div>
                  </div>

                  {/* Metadata tags */}
                  <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3" />
                      {opp.location}
                    </span>
                    {opp.stipend_or_salary && (
                      <span className="flex items-center gap-1 text-foreground/80 font-medium">
                        <DollarSign className="size-3" />
                        {opp.stipend_or_salary}
                      </span>
                    )}
                  </div>

                  {/* Skills summary */}
                  <div className="space-y-1.5 border-t pt-3">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-muted-foreground">Key Capabilities</span>
                      <span className="text-emerald-600 font-semibold text-[10px]">
                        {opp.verified_strengths_count} Verified
                        {opp.learning_skills_count > 0 && ` · ${opp.learning_skills_count} Learning`}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {opp.key_skills.map((sk) => (
                        <Badge key={sk} variant="secondary" className="text-[10px] px-1.5 py-0">
                          {sk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedOpportunityId(opp.id)}
                    className="w-full sm:w-1/2 text-xs font-semibold"
                  >
                    <Eye className="size-3.5 mr-1" />
                    Fit & Gaps
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelectedOpportunityId(opp.id);
                      setActiveTab("prepare");
                    }}
                    className="w-full sm:w-1/2 text-xs font-bold gap-1 bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Zap className="size-3.5" />
                    Prepare
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Fit Drawer / Modal */}
          {selectedOpportunityId && fitQuery.data && (
            <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 space-y-6 shadow-md animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-none text-xs font-semibold">
                      Match Fit Analysis
                    </Badge>
                    <Badge
                      className={`text-xs font-bold border-none ${
                        fitQuery.data.match_category === "READY_TO_APPLY"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {fitQuery.data.match_category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-foreground mt-1">
                    {fitQuery.data.opportunity.title} @ {fitQuery.data.opportunity.company}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {fitQuery.data.opportunity.location} · {fitQuery.data.opportunity.work_mode} · {fitQuery.data.opportunity.stipend_or_salary}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-primary">
                      {fitQuery.data.match_score.toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">
                      Calculated Match
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedOpportunityId(null)}
                    className="text-xs"
                  >
                    Close
                  </Button>
                </div>
              </div>

              {/* Fit Explanation & Risk Factors */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.02] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="size-4" />
                    Why This Role Fits You
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {fitQuery.data.fit_explanation}
                  </p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.02] p-4 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-xs text-amber-600 dark:text-amber-400">
                    <AlertCircle className="size-4" />
                    Areas to Highlight or Learn
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed">
                    {fitQuery.data.risk_factors}
                  </p>
                </div>
              </div>

              {/* Capability Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Capability Breakdown vs Requirements
                </h4>

                <div className="grid gap-2">
                  {fitQuery.data.verified_strengths.map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="flex items-center justify-between p-3 rounded-xl border bg-emerald-500/[0.02] border-emerald-500/20 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="size-4 text-emerald-500" />
                        <div>
                          <span className="font-semibold text-foreground">{sk.skill_name}</span>
                          <div className="text-[10px] text-muted-foreground">
                            Sources: {sk.provenance_sources.join(", ")}
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/15 text-emerald-600 border-none font-mono text-[10px]">
                        Score: {sk.student_score?.toFixed(0)}%
                      </Badge>
                    </div>
                  ))}

                  {fitQuery.data.learning_skills.map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="flex items-center justify-between p-3 rounded-xl border bg-amber-500/[0.02] border-amber-500/20 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="size-4 text-amber-500" />
                        <div>
                          <span className="font-semibold text-foreground">{sk.skill_name}</span>
                          <div className="text-[10px] text-muted-foreground">
                            In Progress in Curriculum
                          </div>
                        </div>
                      </div>
                      <Badge className="bg-amber-500/15 text-amber-600 border-none text-[10px]">
                        Learning Match
                      </Badge>
                    </div>
                  ))}

                  {fitQuery.data.missing_skills.map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-muted/20 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-muted-foreground/40 ml-1" />
                        <div>
                          <span className="font-medium text-muted-foreground">{sk.skill_name}</span>
                          <div className="text-[10px] text-muted-foreground">
                            {sk.is_mandatory ? "Mandatory requirement" : "Preferred / Nice-to-have"}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground">
                        Not Yet Demonstrated
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Tailoring Suggestions */}
              <div className="rounded-2xl border bg-secondary/10 p-5 space-y-3">
                <div className="flex items-center gap-2 font-semibold text-xs text-foreground">
                  <FileText className="size-4 text-primary" />
                  Evidence-Grounded Resume Tailoring Tips
                </div>
                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                  {fitQuery.data.suggested_resume_tailoring.map((tip, i) => (
                    <li key={i} className="leading-relaxed">
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t">
                <Button asChild size="sm" variant="outline" className="text-xs gap-1">
                  <Link to="/app/profile">
                    <FileText className="size-3.5" />
                    Review My Resume
                  </Link>
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      handleCreateApplication(
                        fitQuery.data!.opportunity.id,
                        fitQuery.data!.opportunity.company,
                        fitQuery.data!.opportunity.title,
                        "APPLIED"
                      )
                    }
                    className="text-xs font-semibold gap-1"
                  >
                    <Send className="size-3.5" />
                    Mark Applied & Track
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: JOB DESCRIPTION PARSER */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "parser" && (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                Job Description Intelligence & Instant Fit
              </h2>
              <p className="text-xs text-muted-foreground">
                Paste any external job description to parse required capabilities, normalize against your verified skills, and compute your deterministic match.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Role Title (Optional, e.g. Data Engineer Intern)"
                value={jdRoleTitle}
                onChange={(e) => setJdRoleTitle(e.target.value)}
                className="text-xs rounded-xl border p-2.5 bg-background text-foreground"
              />
              <input
                type="text"
                placeholder="Company Name (Optional, e.g. Acme Corp)"
                value={jdCompany}
                onChange={(e) => setJdCompany(e.target.value)}
                className="text-xs rounded-xl border p-2.5 bg-background text-foreground"
              />
            </div>

            <textarea
              rows={8}
              placeholder="Paste the full job description text here (requirements, responsibilities, tech stack)..."
              value={rawJDText}
              onChange={(e) => setRawJDText(e.target.value)}
              className="w-full text-xs font-mono rounded-xl border p-3 bg-background text-foreground leading-relaxed"
            />

            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleParseJD}
                disabled={parseJDMutation.isPending || !rawJDText.trim()}
                className="text-xs font-semibold gap-1.5"
              >
                <Sparkles className="size-3.5" />
                {parseJDMutation.isPending ? "Analyzing Requirements..." : "Extract & Calculate Fit"}
              </Button>
            </div>
          </div>

          {/* Parsed Result Display */}
          {parsedResult && (
            <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-6 shadow-sm animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-primary/20 text-primary border-none text-xs font-semibold">
                      Extracted Opportunity
                    </Badge>
                    <Badge
                      className={`text-xs font-bold border-none ${
                        parsedResult.match_category === "READY_TO_APPLY"
                          ? "bg-emerald-500/15 text-emerald-600"
                          : "bg-amber-500/15 text-amber-600"
                      }`}
                    >
                      {parsedResult.match_category.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {parsedResult.extracted_title} @ {parsedResult.extracted_company}
                  </h3>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-black text-primary">
                    {parsedResult.match_score.toFixed(0)}%
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold">
                    Estimated Match
                  </div>
                </div>
              </div>

              {/* Fit explanation */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.02] p-4 space-y-2 text-xs">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                    <ShieldCheck className="size-4" />
                    Verified Fit
                  </span>
                  <p className="text-foreground/90 leading-relaxed">{parsedResult.fit_explanation}</p>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.02] p-4 space-y-2 text-xs">
                  <span className="font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="size-4" />
                    Gaps to Address
                  </span>
                  <p className="text-foreground/90 leading-relaxed">{parsedResult.risk_factors}</p>
                </div>
              </div>

              {/* Extracted Skills List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Extracted & Normalized Capabilities
                </h4>
                <div className="grid gap-2 sm:grid-cols-2">
                  {parsedResult.extracted_skills.map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="flex items-center justify-between p-3 rounded-xl border bg-card text-xs"
                    >
                      <span className="font-medium text-foreground">{sk.skill_name}</span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          sk.status === "VERIFIED"
                            ? "text-emerald-600 border-emerald-500/30 bg-emerald-500/10"
                            : sk.status === "LEARNING"
                            ? "text-amber-600 border-amber-500/30 bg-amber-500/10"
                            : "text-muted-foreground"
                        }`}
                      >
                        {sk.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resume Tailoring */}
              <div className="rounded-2xl border bg-secondary/10 p-4 space-y-2 text-xs">
                <span className="font-semibold text-foreground flex items-center gap-1.5">
                  <FileText className="size-4 text-primary" />
                  Recommended Resume Emphases
                </span>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {parsedResult.suggested_resume_tailoring.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() =>
                    handleCreateApplication(
                      null,
                      parsedResult.extracted_company,
                      parsedResult.extracted_title,
                      "APPLIED"
                    )
                  }
                  className="text-xs font-semibold gap-1"
                >
                  <PlusCircle className="size-3.5" />
                  Track This Opportunity in Pipeline
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: APPLICATION TRACKER */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "tracker" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-5 text-primary" />
                Active Application Pipeline
              </h2>
              <p className="text-xs text-muted-foreground">
                Track your active interviews, online assessments, and offers. When entering Interview status, SPAR creates a company-specific prep plan.
              </p>
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="rounded-3xl border border-dashed p-8 text-center space-y-3">
              <Briefcase className="size-8 text-muted-foreground mx-auto" />
              <div className="text-sm font-semibold text-foreground">No applications tracked yet</div>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Explore matched opportunities in the first tab and mark them as Applied to start tracking your pipeline.
              </p>
              <Button size="sm" variant="outline" onClick={() => setActiveTab("matched")} className="text-xs">
                Browse Matched Opportunities
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="surface-panel rounded-2xl p-5 border border-border/80 space-y-4 bg-card shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-foreground">{app.role}</h3>
                        <Badge
                          className={`text-[10px] font-bold border-none ${
                            app.status === "INTERVIEW"
                              ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 animate-pulse"
                              : app.status === "OFFER"
                              ? "bg-purple-500/20 text-purple-600"
                              : app.status === "APPLIED"
                              ? "bg-blue-500/15 text-blue-600"
                              : "bg-secondary text-foreground"
                          }`}
                        >
                          {app.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-primary font-medium mt-0.5">
                        <Building2 className="size-3.5" />
                        <span>{app.company}</span>
                        {app.applied_at && (
                          <span className="text-muted-foreground text-[11px]">
                            · Applied {new Date(app.applied_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Status Dropdown Controls */}
                    <div className="flex items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                        className="text-xs rounded-xl border bg-background px-3 py-1.5 font-medium text-foreground"
                      >
                        <option value="SAVED">Saved</option>
                        <option value="PREPARING">Preparing</option>
                        <option value="APPLIED">Applied</option>
                        <option value="ONLINE_ASSESSMENT">Online Assessment</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                      </select>
                    </div>
                  </div>

                  {/* Notes & History */}
                  {app.notes && (
                    <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-xl border border-border/50">
                      {app.notes}
                    </p>
                  )}

                  {/* Company-Specific Interview Prep Plan */}
                  {app.interview_prep_plan && (
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.03] p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-semibold text-xs text-emerald-600 dark:text-emerald-400">
                          <Zap className="size-4 text-emerald-500" />
                          Company-Specific Interview Prep Plan
                        </div>
                        <Badge variant="outline" className="text-[10px] border-emerald-500/40 text-emerald-600">
                          Targeted Technical Drill
                        </Badge>
                      </div>

                      <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                        {app.interview_prep_plan.coach_briefing}
                      </p>

                      <div className="grid gap-3 sm:grid-cols-2 text-xs">
                        {/* Modules to review */}
                        <div className="space-y-1.5 bg-background p-3.5 rounded-xl border border-border/60">
                          <span className="font-semibold text-[11px] text-muted-foreground uppercase">
                            Focus Modules to Review
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                            {app.interview_prep_plan.focus_modules_to_review.map((m) => (
                              <li key={m.code}>{m.title}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Project defense questions */}
                        <div className="space-y-1.5 bg-background p-3.5 rounded-xl border border-border/60">
                          <span className="font-semibold text-[11px] text-muted-foreground uppercase">
                            Likely Project Defense Questions
                          </span>
                          <ul className="list-disc list-inside space-y-1 text-muted-foreground text-[11px]">
                            {app.interview_prep_plan.project_questions_to_prepare.map((q, i) => (
                              <li key={i}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <Button asChild size="sm" className="text-xs font-semibold gap-1">
                          <Link to="/app/practice">
                            <Sparkles className="size-3.5" />
                            Launch Targeted Mock Interview
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contextual SPAR Coach Widget */}
      <ContextualCoachCard
        title="SPAR Coach on Opportunities & Applications"
        subtitle="Get guidance on job fit, resume tailoring for specific roles, or company interview strategies."
        prompts={[
          "Should I apply for the Junior Data Engineer role?",
          "Why is my match 82%?",
          "Tailor my resume for Stripe Fintech Data Labs.",
          "Prepare me for my upcoming technical interview.",
          "Which project should I talk about in my interview?",
        ]}
      />
    </div>
  );
}
