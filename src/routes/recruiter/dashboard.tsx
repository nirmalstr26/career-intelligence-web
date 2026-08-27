import React, { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Building2,
  Briefcase,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  PlusCircle,
  Eye,
  Lock,
  ChevronRight,
  Target,
  FileText,
  Calendar,
  Video,
  Search,
  Filter,
  BarChart3,
  Bot,
  Zap,
  Award,
  AlertCircle,
  Star,
  Check,
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
  useRecruiterProfile,
  useRecruiterOpportunities,
  useCreateRecruiterOpportunity,
  useCandidateMatches,
  useInviteCandidate,
  useConsentedCandidateProfile,
  useUpdateCandidatePipelineStage,
  useRecordRecruiterFeedback,
  useQueryRecruiterIntelligence,
  PILOT_RECRUITER_ID,
  PILOT_COMPANY_OPP_ID,
} from "@/lib/careerai/hooks";
import {
  AnonymizedCandidateMatchItem,
  ConsentedCandidateProfile,
} from "@/lib/careerai/types";

export const Route = createFileRoute("/recruiter/dashboard")({
  component: RecruiterDashboardPage,
});

function RecruiterDashboardPage() {
  const [activeTab, setActiveTab] = useState<"matches" | "pipeline" | "feedback" | "ai">("matches");
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string>(PILOT_COMPANY_OPP_ID);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // New Opportunity Modal
  const [showOppModal, setShowOppModal] = useState(false);
  const [oppTitle, setOppTitle] = useState("");
  const [oppLocation, setOppLocation] = useState("San Francisco, CA (Hybrid)");
  const [oppType, setOppType] = useState("INTERNSHIP");
  const [oppWorkMode, setOppWorkMode] = useState("HYBRID");
  const [oppDesc, setOppDesc] = useState("");
  const [oppSalary, setOppSalary] = useState("$45 / hr + housing stipend");

  // Feedback Form State
  const [fbTech, setFbTech] = useState(4.5);
  const [fbComm, setFbComm] = useState(4.0);
  const [fbProblem, setFbProblem] = useState(4.8);
  const [fbProject, setFbProject] = useState(5.0);
  const [fbRec, setFbRec] = useState("STRONG_HIRE");
  const [fbNotes, setFbNotes] = useState("Candidate demonstrated outstanding understanding of quarantine error isolation, SQLite schema design, and SQL window aggregations.");
  const [fbSaved, setFbSaved] = useState(false);

  // AI query state
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Queries
  const recruiterQuery = useRecruiterProfile();
  const oppsQuery = useRecruiterOpportunities();
  const matchesQuery = useCandidateMatches(PILOT_RECRUITER_ID, selectedOpportunityId);
  const profileQuery = useConsentedCandidateProfile(PILOT_RECRUITER_ID, selectedOpportunityId, selectedStudentId);

  const createOppMutation = useCreateRecruiterOpportunity();
  const inviteMutation = useInviteCandidate(PILOT_RECRUITER_ID, selectedOpportunityId);
  const updateStageMutation = useUpdateCandidatePipelineStage();
  const recordFeedbackMutation = useRecordRecruiterFeedback();
  const queryAiMutation = useQueryRecruiterIntelligence(PILOT_RECRUITER_ID, selectedOpportunityId);

  if (recruiterQuery.isLoading || oppsQuery.isLoading || matchesQuery.isLoading) {
    return <PageLoading label="Loading recruiter candidate intelligence portal…" />;
  }

  if (recruiterQuery.isError || !recruiterQuery.data || oppsQuery.isError || !oppsQuery.data) {
    return (
      <PageError
        onRetry={() => {
          void recruiterQuery.refetch();
          void oppsQuery.refetch();
        }}
      />
    );
  }

  const recruiter = recruiterQuery.data;
  const opportunities = oppsQuery.data;
  const currentOpp = opportunities.find((o) => o.id === selectedOpportunityId) || opportunities[0];
  const matches = matchesQuery.data || [];

  const handleCreateOpportunity = async () => {
    if (!oppTitle.trim()) return;
    try {
      await createOppMutation.mutateAsync({
        title: oppTitle,
        location: oppLocation,
        opportunity_type: oppType,
        work_mode: oppWorkMode,
        description: oppDesc,
        mandatory_skills: ["SQL", "PYTHON", "DATABASES", "DATA_PIPELINE_DESIGN"],
        preferred_skills: ["SPARK", "AIRFLOW", "CLOUD"],
        stipend_or_salary: oppSalary,
      });
      setShowOppModal(false);
      setOppTitle("");
      setOppDesc("");
    } catch (err) {
      console.error("Failed to create opportunity:", err);
    }
  };

  const handleInviteCandidate = async (studentId: string) => {
    try {
      await inviteMutation.mutateAsync(studentId);
    } catch (err) {
      console.error("Failed to invite candidate:", err);
    }
  };

  const handleUpdateStage = async (newStage: string) => {
    try {
      await updateStageMutation.mutateAsync({
        shortlistId: "327612ba-9e7f-4884-8dbb-5782780e59c4",
        newStage,
        notes: `Recruiter transitioned candidate to ${newStage}.`,
      });
    } catch (err) {
      console.error("Failed to update stage:", err);
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await recordFeedbackMutation.mutateAsync({
        shortlistId: "327612ba-9e7f-4884-8dbb-5782780e59c4",
        body: {
          technical_score: fbTech,
          communication_score: fbComm,
          problem_solving_score: fbProblem,
          project_understanding_score: fbProject,
          recommendation: fbRec,
          feedback_notes: fbNotes,
        },
      });
      setFbSaved(true);
      setTimeout(() => setFbSaved(false), 3000);
    } catch (err) {
      console.error("Failed to record feedback:", err);
    }
  };

  const handleAskAI = async (presetPrompt?: string) => {
    const q = presetPrompt || aiQuery;
    if (!q.trim()) return;
    try {
      const res = await queryAiMutation.mutateAsync(q);
      setAiResponse(res.answer);
      if (!presetPrompt) setAiQuery("");
    } catch (err) {
      console.error("Failed to query recruiter AI:", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Recruiter Header */}
      <header className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-gradient-to-r from-primary/[0.08] via-card to-card space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-500/20 text-emerald-600 border-none text-[10px] font-bold flex items-center gap-1">
                <ShieldCheck className="size-3" /> Verified Employer
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {recruiter.company_name}
              </Badge>
            </div>
            <h1 className="font-display text-2xl font-bold sm:text-3xl text-foreground">
              {currentOpp ? currentOpp.title : "Recruiter Talent Pipeline"}
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Hiring Manager: <span className="font-semibold text-foreground">{recruiter.name}</span> ({recruiter.job_title}) · Location: {recruiter.hiring_location || "San Francisco, CA"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => setShowOppModal(true)}
              className="text-xs font-semibold gap-1.5 shadow-sm"
            >
              <PlusCircle className="size-3.5" />
              Post New Opportunity
            </Button>
          </div>
        </div>

        {/* Opportunity Metrics Strip */}
        {currentOpp && (
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 border-t border-border/60">
            <div className="rounded-2xl border bg-card/60 p-3 text-center">
              <div className="text-xl font-black text-foreground">{currentOpp.total_matches_count}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                SPAR Matches
              </div>
            </div>

            <div className="rounded-2xl border bg-primary/5 border-primary/20 p-3 text-center">
              <div className="text-xl font-black text-primary">{currentOpp.invited_count}</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                Invited Candidates
              </div>
            </div>

            <div className="rounded-2xl border bg-emerald-500/5 border-emerald-500/20 p-3 text-center">
              <div className="text-xl font-black text-emerald-600">1</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                Consented Profiles
              </div>
            </div>

            <div className="rounded-2xl border bg-blue-500/5 border-blue-500/20 p-3 text-center">
              <div className="text-xl font-black text-blue-600">1</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                In Interview
              </div>
            </div>

            <div className="rounded-2xl border bg-purple-500/5 border-purple-500/20 p-3 text-center">
              <div className="text-xl font-black text-purple-600">1</div>
              <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                Offers Extended
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("matches")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "matches"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Users className="size-3.5" />
          Candidate Matches & Consent ({matches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("pipeline")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "pipeline"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Target className="size-3.5" />
          Recruitment Pipeline
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("feedback")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "feedback"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className="size-3.5" />
          Interview Feedback Rubric
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
            activeTab === "ai"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          <Bot className="size-3.5 text-primary" />
          SPAR Recruiter Intelligence
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* TAB 1: CANDIDATE MATCHES & CONSENT */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "matches" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Lock className="size-4 text-primary" />
              <span>
                <strong>Privacy Protected:</strong> Student names and contact details remain masked until the student reviews your invitation and clicks <em>"I'm Interested"</em>.
              </span>
            </div>
          </div>

          <div className="grid gap-4">
            {matches.map((m) => (
              <div
                key={m.match_id}
                className="surface-panel rounded-3xl p-6 border border-border/80 space-y-4 bg-card shadow-sm hover:border-primary/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-foreground flex items-center gap-1.5">
                        <Users className="size-4 text-primary" />
                        {m.has_consented ? "Nirmal Kumaravel" : m.anonymized_alias}
                      </h3>
                      {m.has_consented ? (
                        <Badge className="bg-emerald-500/20 text-emerald-600 border-none text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="size-3" /> Profile Consented
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Anonymized Candidate
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Graduation: <strong>{m.graduation_year}</strong> · Target: <strong>{m.career_cluster}</strong>
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-black text-primary">
                        {m.match_score.toFixed(0)}%
                      </div>
                      <div className="text-[9px] text-muted-foreground uppercase font-bold">
                        SPAR Fit Score
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fit Explanation & Risk Factors */}
                <div className="grid gap-3 md:grid-cols-2 text-xs">
                  <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-4 space-y-1.5">
                    <span className="font-semibold text-emerald-600 flex items-center gap-1.5">
                      <ShieldCheck className="size-4" /> Why SPAR Recommended This Candidate
                    </span>
                    <p className="text-foreground/90 leading-relaxed">{m.fit_explanation}</p>
                  </div>

                  <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-4 space-y-1.5">
                    <span className="font-semibold text-amber-600 flex items-center gap-1.5">
                      <AlertCircle className="size-4" /> Areas to Validate During Interview
                    </span>
                    <p className="text-foreground/90 leading-relaxed">{m.risk_factors}</p>
                  </div>
                </div>

                {/* Verified Strengths List */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase text-muted-foreground tracking-wider">
                    Verified Capabilities (AI Rubric & Assessment Grounded)
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {m.verified_strengths.map((s, i) => (
                      <Badge key={i} variant="secondary" className="text-xs py-1 px-2.5 font-medium">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                  <div>
                    {m.has_consented ? (
                      <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Candidate opted in on Today dashboard
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        Invitation Status: <strong>{m.invitation_status || "Not yet invited"}</strong>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {!m.has_consented && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleInviteCandidate(m.student_id)}
                        disabled={inviteMutation.isPending || m.invitation_status === "INVITED"}
                        className="text-xs font-semibold gap-1"
                      >
                        <Send className="size-3.5" />
                        {m.invitation_status === "INVITED" ? "Invitation Sent" : "Invite Candidate to Opportunity"}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      onClick={() => setSelectedStudentId(m.student_id)}
                      className="text-xs font-semibold gap-1"
                    >
                      <Eye className="size-3.5" />
                      View Full Consented Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Consented Candidate Profile Drawer / View */}
          {selectedStudentId && profileQuery.data && (
            <div className="rounded-3xl border border-primary/30 bg-card p-6 sm:p-8 space-y-6 shadow-xl animate-in fade-in-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-none text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="size-3" /> Consented Talent Profile
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {profileQuery.data.college_name} · Graduating {profileQuery.data.graduation_year}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground mt-1">
                    {profileQuery.data.name}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Email: <span className="font-mono text-foreground font-semibold">{profileQuery.data.email}</span> · Career Goal: <strong className="text-primary">{profileQuery.data.career_goal}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setSelectedStudentId(null)} className="text-xs">
                    Close
                  </Button>
                </div>
              </div>

              {/* Skills Breakdown (Verified vs Declared) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Capability Provenance (Verified by SPAR vs Student Declared)
                  </h4>
                  <Badge variant="outline" className="text-[10px]">
                    Zero Resume Hallucination Guarantee
                  </Badge>
                </div>

                <div className="grid gap-2 sm:grid-cols-2 text-xs">
                  {profileQuery.data.skills_breakdown.map((sk, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        sk.category === "VERIFIED"
                          ? "bg-emerald-500/[0.03] border-emerald-500/25"
                          : "bg-secondary/20 border-border/60"
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-foreground block">{sk.skill_name}</span>
                        <span className="text-[10px] text-muted-foreground">{sk.provenance}</span>
                      </div>
                      <Badge
                        className={`text-[9px] font-bold border-none ${
                          sk.category === "VERIFIED"
                            ? "bg-emerald-500/20 text-emerald-600 font-mono"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {sk.category === "VERIFIED" ? `Verified (${sk.score}%)` : "Declared"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Practical Project & Mock Interview Evidence */}
              <div className="grid gap-4 md:grid-cols-2 text-xs">
                <div className="rounded-2xl border p-4 bg-secondary/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Award className="size-4 text-primary" /> Practical Project Portfolio
                    </span>
                    <Badge className="bg-emerald-500/15 text-emerald-600 font-mono font-bold border-none text-[10px]">
                      Score: {profileQuery.data.project_score}/100
                    </Badge>
                  </div>
                  <h5 className="font-bold text-foreground">{profileQuery.data.project_title}</h5>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {profileQuery.data.project_rubric_summary}
                  </p>
                </div>

                <div className="rounded-2xl border p-4 bg-secondary/15 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Sparkles className="size-4 text-primary" /> Technical Mock Interview
                    </span>
                    <Badge className="bg-primary/15 text-primary font-mono font-bold border-none text-[10px]">
                      Score: {profileQuery.data.mock_interview_score}/100
                    </Badge>
                  </div>
                  <h5 className="font-bold text-foreground">Adaptive Data Engineer Defense</h5>
                  <p className="text-muted-foreground leading-relaxed text-xs">
                    {profileQuery.data.mock_interview_summary}
                  </p>
                </div>
              </div>

              {/* Pipeline Quick Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                <span className="text-xs text-muted-foreground">
                  Current Pipeline Stage: <strong className="text-foreground font-semibold">{profileQuery.data.pipeline_stage}</strong>
                </span>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStage("SHORTLISTED")}
                    className="text-xs font-semibold"
                  >
                    Shortlist
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStage("INTERVIEW")}
                    className="text-xs font-semibold"
                  >
                    Schedule Interview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStage("OFFER")}
                    className="text-xs font-semibold"
                  >
                    Extend Offer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 2: RECRUITMENT PIPELINE */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "pipeline" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-5 text-primary" />
                Active Candidate Hiring Pipeline
              </h3>
              <p className="text-xs text-muted-foreground">
                Move candidates through screening, project defense interviews, and offer extension.
              </p>
            </div>
          </div>

          <div className="rounded-3xl border bg-card p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl border bg-secondary/15">
              <div>
                <h4 className="font-bold text-base text-foreground">Nirmal Kumaravel</h4>
                <p className="text-xs text-muted-foreground">
                  Data Engineer Intern — 2027 · SPAR Match: <strong className="text-primary">90.7%</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Badge className="bg-purple-500/20 text-purple-600 font-bold border-none text-xs">
                  OFFER EXTENDED
                </Badge>

                <Button size="sm" variant="outline" onClick={() => setActiveTab("feedback")} className="text-xs font-semibold">
                  View / Edit Rubric Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 3: INTERVIEW FEEDBACK RUBRIC */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "feedback" && (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground flex items-center gap-2">
                <Star className="size-5 text-amber-500" />
                Technical & Project Defense Evaluation Rubric
              </h3>
              <p className="text-xs text-muted-foreground">
                Record structured evaluation scores for Nirmal Kumaravel on the Data Engineer Internship.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-foreground">Technical Capability (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={fbTech}
                  onChange={(e) => setFbTech(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Communication & Articulation (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={fbComm}
                  onChange={(e) => setFbComm(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Problem Solving & Schema Design (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={fbProblem}
                  onChange={(e) => setFbProblem(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-foreground">Project Understanding & Defense (1.0 - 5.0)</label>
                <input
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="5.0"
                  value={fbProject}
                  onChange={(e) => setFbProject(parseFloat(e.target.value))}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground font-mono"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-foreground">Final Recommendation</label>
              <select
                value={fbRec}
                onChange={(e) => setFbRec(e.target.value)}
                className="w-full p-2.5 rounded-xl border bg-background text-foreground"
              >
                <option value="STRONG_HIRE">Strong Hire</option>
                <option value="HIRE">Hire</option>
                <option value="FURTHER_EVALUATION">Further Evaluation</option>
                <option value="NO_HIRE">No Hire</option>
              </select>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-foreground">Recruiter & Engineering Interviewer Notes</label>
              <textarea
                rows={4}
                value={fbNotes}
                onChange={(e) => setFbNotes(e.target.value)}
                className="w-full p-3 rounded-xl border bg-background text-foreground leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              {fbSaved && (
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="size-4" /> Evaluation recorded successfully
                </span>
              )}
              <Button
                size="sm"
                onClick={handleSubmitFeedback}
                disabled={recordFeedbackMutation.isPending}
                className="ml-auto text-xs font-semibold"
              >
                Save Evaluation Rubric
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------- */}
      {/* TAB 4: SPAR RECRUITER INTELLIGENCE */}
      {/* ------------------------------------------------------------------- */}
      {activeTab === "ai" && (
        <div className="space-y-6">
          <div className="rounded-3xl border bg-card p-6 sm:p-8 space-y-5 shadow-sm">
            <div>
              <h3 className="font-display text-xl font-bold text-foreground flex items-center gap-2">
                <Bot className="size-6 text-primary" />
                SPAR Recruiter Intelligence Assistant
              </h3>
              <p className="text-xs text-muted-foreground">
                Ask SPAR about matching candidates, project validation questions, or specific technical drills.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {[
                "Show me candidates who meet all mandatory SQL and Python requirements.",
                "Which candidates have actual engineering project evidence?",
                "Which candidate should I interview for pipeline design?",
                "What skills should I validate during the interview?",
              ].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleAskAI(q)}
                  className="rounded-full bg-secondary/60 hover:bg-primary/15 hover:text-primary px-3 py-1.5 text-xs text-foreground/80 transition-all text-left"
                >
                  {q}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask SPAR about candidates, technical rubrics, or interview validation..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                className="flex-1 text-xs rounded-xl border p-3 bg-background text-foreground"
              />
              <Button
                size="sm"
                onClick={() => handleAskAI()}
                disabled={queryAiMutation.isPending || !aiQuery.trim()}
                className="text-xs font-semibold gap-1.5 px-4"
              >
                <Send className="size-3.5" />
                {queryAiMutation.isPending ? "Analyzing..." : "Ask Assistant"}
              </Button>
            </div>

            {aiResponse && (
              <div className="rounded-2xl border border-primary/30 bg-primary/[0.03] p-5 space-y-2 text-xs leading-relaxed animate-in fade-in-50">
                <div className="flex items-center gap-2 font-bold text-primary text-xs">
                  <Sparkles className="size-4" />
                  SPAR Recruiter Intelligence Analysis
                </div>
                <div className="text-foreground/90 space-y-2 whitespace-pre-line">
                  {aiResponse}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Post New Opportunity */}
      {showOppModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div>
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <PlusCircle className="size-5 text-primary" />
                Create Hiring Opportunity
              </h3>
              <p className="text-xs text-muted-foreground">
                Publish a role to match against verified student talent.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Role Title</label>
                <input
                  type="text"
                  placeholder="e.g. Data Pipeline Engineering Intern"
                  value={oppTitle}
                  onChange={(e) => setOppTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Role Type</label>
                  <select
                    value={oppType}
                    onChange={(e) => setOppType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  >
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FULL_TIME">Full Time</option>
                    <option value="GRADUATE_PROGRAM">Graduate Program</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Work Mode</label>
                  <select
                    value={oppWorkMode}
                    onChange={(e) => setOppWorkMode(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  >
                    <option value="HYBRID">Hybrid</option>
                    <option value="REMOTE">Remote</option>
                    <option value="ONSITE">Onsite</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Location</label>
                <input
                  type="text"
                  value={oppLocation}
                  onChange={(e) => setOppLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Stipend / Salary</label>
                <input
                  type="text"
                  value={oppSalary}
                  onChange={(e) => setOppSalary(e.target.value)}
                  className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button size="sm" variant="ghost" onClick={() => setShowOppModal(false)} className="text-xs">
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleCreateOpportunity}
                disabled={createOppMutation.isPending || !oppTitle.trim()}
                className="text-xs font-semibold"
              >
                {createOppMutation.isPending ? "Creating..." : "Publish & Match Candidates"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
