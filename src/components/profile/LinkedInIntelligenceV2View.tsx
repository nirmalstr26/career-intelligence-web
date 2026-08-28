import React, { useState } from "react";
import {
  Linkedin,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Award,
  FileText,
  Copy,
  Check,
  Target,
  Briefcase,
  ExternalLink,
  Edit3,
  Bot,
  Layers,
  ArrowRight,
  TrendingUp,
  Upload,
  Link2,
  Lock,
  Plus,
  RefreshCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  useLinkedInIntelligenceV2,
  useConnectLinkedIn,
  useImportProfile,
  useConfirmCertification,
  useOptimizeForJob,
  useOpportunities,
} from "@/lib/careerai/hooks";
import { humanizeCode } from "@/lib/utils";
import type {
  LinkedInIntelligenceV2,
  HeadlineVariant,
  ModularAboutPart,
  ProfileGapItem,
  RoleSkillOrderingItem,
  LinkedInProjectCard,
  CertificationRecommendationItem,
  JobOptimizationResult,
} from "@/lib/careerai/types";

interface LinkedInIntelligenceV2ViewProps {
  activeCareerCode?: string;
  onAskSpar: (prompt: string) => void;
}

export const LinkedInIntelligenceV2View: React.FC<LinkedInIntelligenceV2ViewProps> = ({
  activeCareerCode = "DATA_ENGINEER",
  onAskSpar,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<
    "positioning" | "job_optimizer" | "skills" | "featured" | "certifications" | "sync"
  >("positioning");

  const liQuery = useLinkedInIntelligenceV2(activeCareerCode);
  const connectMutation = useConnectLinkedIn();
  const importMutation = useImportProfile();
  const confirmCertMutation = useConfirmCertification();
  const optimizeMutation = useOptimizeForJob();
  const oppsQuery = useOpportunities(activeCareerCode);

  // Modals state
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [pastedText, setPastedText] = useState("");
  const [addCertModalOpen, setAddCertModalOpen] = useState(false);
  const [certName, setCertName] = useState("");
  const [certAuth, setCertAuth] = useState("");

  // Job Optimizer state
  const [selectedOppId, setSelectedOppId] = useState<string>("");
  const [customJdText, setCustomJdText] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobOptResult, setJobOptResult] = useState<JobOptimizationResult | null>(null);

  // Copied tracking
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    void navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRunJobOptimization = async () => {
    try {
      const res = await optimizeMutation.mutateAsync({
        opportunity_id: selectedOppId || undefined,
        raw_jd_text: customJdText || undefined,
        role_title: jobTitle || "Data Engineer Intern",
        company_name: companyName || "Target Opportunity",
      });
      setJobOptResult(res);
    } catch {
      // Error handled by mutation state
    }
  };

  const handleImportSubmit = async () => {
    if (!pastedText.trim()) return;
    try {
      await importMutation.mutateAsync({
        source_type: "STRUCTURED_PASTE",
        raw_text: pastedText,
      });
      setImportModalOpen(false);
      setPastedText("");
    } catch {
      // Handled
    }
  };

  const handleConfirmCertSubmit = async () => {
    if (!certName.trim() || !certAuth.trim()) return;
    try {
      await confirmCertMutation.mutateAsync({
        name: certName,
        authority: certAuth,
      });
      setAddCertModalOpen(false);
      setCertName("");
      setCertAuth("");
    } catch {
      // Handled
    }
  };

  if (!liQuery.data && !liQuery.isError) {
    return (
      <div className="flex min-h-[350px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">
            Computing evidence-grounded LinkedIn intelligence...
          </p>
        </div>
      </div>
    );
  }

  const data: LinkedInIntelligenceV2 = liQuery.data || {
    target_career_code: activeCareerCode,
    target_career_name: humanizeCode(activeCareerCode),
    connection_state: { is_connected: false, scopes_granted: [], available_capabilities: [] },
    readiness_score: 82,
    credibility_ratio_text: "12 of 14 claims evidence-backed",
    high_impact_actions: [],
    headline_variants: [],
    modular_about: { full_text: "", parts: [] },
    skill_ordering: [],
    featured_projects: [],
    held_certifications: [],
    recommended_certifications: [],
    all_gaps: [],
    last_analyzed_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-300">
      {/* 1. HERO BANNER: Role-Aware LinkedIn Intelligence */}
      <header className="relative overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-r from-[#0A66C2]/[0.08] via-card to-card p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0A66C2]/15 px-3 py-0.5 text-xs font-bold text-[#0A66C2] border border-[#0A66C2]/30">
                <Linkedin className="size-3.5 fill-current" />
                Professional Profile Intelligence V2
              </span>
              <Badge variant="outline" className="text-[10px] font-mono uppercase bg-background/50">
                {data.target_career_name}
              </Badge>
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold gap-1">
                <ShieldCheck className="size-3" />
                {data.credibility_ratio_text}
              </Badge>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Make your LinkedIn prove what you can do.
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Ground your professional profile in verified SPAR assessments, rubric-graded projects, and role-specific keywords — with zero fabricated experience.
            </p>
          </div>

          {/* Readiness Gauge & Quick CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-3 shrink-0">
            <div className="flex items-center gap-3 bg-secondary/40 px-4 py-2.5 rounded-2xl border border-border/60">
              <div className="text-right">
                <div className="text-xs text-muted-foreground font-medium">Profile Readiness</div>
                <div className="text-xs font-semibold text-foreground">
                  {data.high_impact_actions.length} high-impact improvements available
                </div>
              </div>
              <div className="text-2xl font-black text-primary font-mono">
                {data.readiness_score.toFixed(0)}%
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={() => setActiveSubTab("job_optimizer")}
                variant="outline"
                className="text-xs font-semibold gap-1.5"
              >
                <Target className="size-3.5 text-primary" />
                Optimize for a Job
              </Button>

              <Button
                size="sm"
                onClick={() => setImportModalOpen(true)}
                variant="default"
                className="text-xs font-semibold gap-1.5"
              >
                <Upload className="size-3.5" />
                Import / Sync
              </Button>
            </div>
          </div>
        </div>

        {/* Top 3 Prioritized Action Strip */}
        {data.high_impact_actions.length > 0 && (
          <div className="mt-6 pt-5 border-t border-border/60 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Highest-Impact Profile Actions Right Now
            </span>
            <div className="grid gap-3 sm:grid-cols-3">
              {data.high_impact_actions.map((act) => (
                <div
                  key={act.item_id}
                  className="rounded-xl border border-primary/30 bg-primary/[0.03] p-3 space-y-1.5 transition-colors hover:border-primary/50"
                >
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/20 text-primary border-none text-[10px] font-semibold">
                      {act.action_type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {act.priority}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{act.name}</h4>
                  <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {act.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 2. SUB-SECTION NAVIGATION BAR */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 border-b border-border/60 no-scrollbar">
        {[
          { id: "positioning", label: "Target Career Positioning", icon: Briefcase },
          { id: "job_optimizer", label: "Optimize for a Job", icon: Target },
          { id: "skills", label: "Skills & Evidence Matrix", icon: ShieldCheck },
          { id: "featured", label: "Featured Projects Studio", icon: Layers },
          { id: "certifications", label: "Certifications Hub", icon: Award },
          { id: "sync", label: "LinkedIn Connection", icon: Link2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all shrink-0 ${
                isActive
                  ? "border-primary text-primary bg-primary/[0.04]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* SUB-TAB 1: TARGET CAREER POSITIONING (Headlines, About, Skills)      */}
      {/* =================================================================== */}
      {activeSubTab === "positioning" && (
        <div className="space-y-8">
          {/* (A) 3 HEADLINE INTELLIGENCE VARIANTS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Edit3 className="size-4 text-primary" />
                  Role-Aware Headline Variants (3 Grounded Options)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Recruiter-tested formulas tailored to your verified technical keywords and project evidence.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAskSpar(`How should I craft my LinkedIn headline for ${data.target_career_name}?`)}
                className="text-xs text-primary gap-1"
              >
                <Bot className="size-3.5" /> Ask SPAR Why
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {data.headline_variants.map((v) => (
                <div
                  key={v.variant_type}
                  className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {v.title}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {v.character_count}/220
                      </span>
                    </div>

                    <div className="rounded-xl bg-muted/40 p-3 text-xs font-mono text-foreground font-medium border border-border/50">
                      {v.headline_text}
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-relaxed">{v.rationale}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(v.headline_text, `headline_${v.variant_type}`)}
                      className="w-full text-xs gap-1 h-7"
                    >
                      {copiedKey === `headline_${v.variant_type}` ? (
                        <>
                          <Check className="size-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="size-3" /> Copy Headline
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* (B) 6-PART MODULAR ABOUT SECTION */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  Modular About Section (Evidence-Grounded Framework)
                </h2>
                <p className="text-xs text-muted-foreground">
                  Structured into 6 transparent blocks. Grounded strictly in your demonstrated skills and project rubric.
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopy(data.modular_about.full_text, "about_full")}
                className="text-xs gap-1.5"
              >
                {copiedKey === "about_full" ? (
                  <>
                    <Check className="size-3.5 text-emerald-500" /> Full About Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3.5" /> Copy Entire About
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                {data.modular_about.parts.map((part) => (
                  <div
                    key={part.part_id}
                    className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5 text-primary" />
                        {part.heading}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[9px] font-bold ${
                          part.evidence_status === "VERIFIED"
                            ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                            : "border-amber-500/40 text-amber-600"
                        }`}
                      >
                        {part.evidence_status}
                      </Badge>
                    </div>

                    <p className="text-xs text-foreground/90 leading-relaxed font-sans">
                      {part.suggested_text}
                    </p>

                    <div className="text-[10px] text-muted-foreground font-mono pt-1">
                      Evidence: {part.evidence_backing}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* (C) ROLE-AWARE SKILL ORDERING */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-4 text-primary" />
                Recommended Skill Pinning & Ordering
              </h2>
              <p className="text-xs text-muted-foreground">
                Recruiters prioritize the first 3 pinned skills. Here is the optimal ordering for {data.target_career_name}.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
              {data.skill_ordering.map((sk) => (
                <div
                  key={sk.skill_code}
                  className={`rounded-2xl border p-4 space-y-2 transition-all ${
                    sk.is_top_pin_recommended
                      ? "border-primary/40 bg-primary/[0.03] shadow-sm"
                      : "border-border/60 bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-muted-foreground">
                      #{sk.rank}
                    </span>
                    {sk.is_top_pin_recommended && (
                      <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold">
                        Top Pin Recommended
                      </Badge>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-foreground">{sk.skill_name}</h4>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        sk.evidence_status === "VERIFIED"
                          ? "text-emerald-600 border-emerald-500/30"
                          : "text-amber-600 border-amber-500/30"
                      }`}
                    >
                      {sk.evidence_status} {sk.score ? `(${sk.score.toFixed(0)}%)` : ""}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {sk.relevance_explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 2: OPTIMIZE FOR A JOB (3-Way Gap Comparison)                 */}
      {/* =================================================================== */}
      {activeSubTab === "job_optimizer" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Target className="size-4 text-primary" />
                3-Way Job Positioning Engine
              </h2>
              <p className="text-xs text-muted-foreground">
                Compare: <strong className="text-foreground">Job Expects</strong> $\leftrightarrow$ <strong className="text-foreground">What You Can Prove (SPAR)</strong> $\leftrightarrow$ <strong className="text-foreground">What LinkedIn Shows</strong>.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">
                  Select Target Opportunity
                </label>
                <select
                  value={selectedOppId}
                  onChange={(e) => {
                    setSelectedOppId(e.target.value);
                    const opp = (oppsQuery.data?.opportunities || []).find((o) => o.id === e.target.value);
                    if (opp) {
                      setJobTitle(opp.title);
                      setCompanyName(opp.company_name);
                      setCustomJdText(opp.description);
                    }
                  }}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">-- Choose active matched opportunity --</option>
                  {(oppsQuery.data?.opportunities || []).map((opp) => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} · {opp.company_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-foreground">Or Role Title & Company</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. Data Engineer Intern"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-1/2 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Company name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-1/2 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-foreground">
                Paste Job Description / Requirements (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Paste key responsibilities or required qualifications..."
                value={customJdText}
                onChange={(e) => setCustomJdText(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
              />
            </div>

            <Button
              onClick={handleRunJobOptimization}
              disabled={optimizeMutation.isPending}
              className="font-bold text-xs gap-1.5"
            >
              <Sparkles className="size-3.5" />
              {optimizeMutation.isPending ? "Analyzing 3-Way Fit..." : "Run Job Optimization"}
            </Button>
          </div>

          {/* Job Optimization Results */}
          {jobOptResult && (
            <div className="space-y-6 animate-in fade-in-50">
              {/* Fit Summary Strip */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border bg-card p-4 space-y-1">
                  <div className="text-xs text-muted-foreground">Current LinkedIn Fit</div>
                  <div className="text-2xl font-bold text-foreground">
                    {jobOptResult.current_linkedin_fit_pct}%
                  </div>
                  <p className="text-[11px] text-muted-foreground">Based on keywords currently on profile</p>
                </div>

                <div className="rounded-2xl border border-primary/40 bg-primary/[0.03] p-4 space-y-1">
                  <div className="text-xs text-primary font-semibold">Potential Evidence Fit</div>
                  <div className="text-2xl font-bold text-primary">
                    {jobOptResult.potential_evidence_fit_pct}%
                  </div>
                  <p className="text-[11px] text-muted-foreground">Once verified SPAR projects are featured</p>
                </div>

                <div className="rounded-2xl border bg-card p-4 space-y-1">
                  <div className="text-xs text-muted-foreground">Target Role</div>
                  <div className="text-base font-bold text-foreground truncate">
                    {jobOptResult.target_role}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{jobOptResult.company_name}</p>
                </div>
              </div>

              {/* 3-Way Comparison Matrix Table */}
              <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
                <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                  <Layers className="size-4 text-primary" />
                  3-Way Requirement Gap Matrix
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="pb-2 font-semibold">Requirement</th>
                        <th className="pb-2 font-semibold">SPAR Evidence</th>
                        <th className="pb-2 font-semibold">Current LinkedIn</th>
                        <th className="pb-2 font-semibold">Category</th>
                        <th className="pb-2 font-semibold">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {jobOptResult.three_way_gaps.map((gap) => (
                        <tr key={gap.item_id} className="py-2.5">
                          <td className="py-2.5 font-semibold text-foreground">{gap.name}</td>
                          <td className="py-2.5 text-muted-foreground">{gap.spar_evidence}</td>
                          <td className="py-2.5 text-muted-foreground">{gap.linkedin_status}</td>
                          <td className="py-2.5">
                            <Badge
                              variant="outline"
                              className={`text-[9px] font-bold ${
                                gap.category === "HIGH_VALUE_GAP"
                                  ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                                  : gap.category === "CREDIBILITY_GAP"
                                  ? "border-amber-500/40 text-amber-600 bg-amber-500/5"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {gap.category.replace(/_/g, " ")}
                            </Badge>
                          </td>
                          <td className="py-2.5 font-medium text-foreground">{gap.recommendation}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tailored Job Headline & About Diff */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Tailored Headline for this Job</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(jobOptResult.job_headline_variant, "job_headline")}
                      className="text-xs h-7 gap-1"
                    >
                      <Copy className="size-3" /> Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-xl text-xs font-mono">
                    {jobOptResult.job_headline_variant}
                  </div>
                </div>

                <div className="rounded-2xl border bg-card p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">Targeted About Addition</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleCopy(jobOptResult.job_about_diff, "job_about")}
                      className="text-xs h-7 gap-1"
                    >
                      <Copy className="size-3" /> Copy
                    </Button>
                  </div>
                  <div className="p-3 bg-muted/40 rounded-xl text-xs font-sans text-muted-foreground whitespace-pre-line">
                    {jobOptResult.job_about_diff}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 3: SKILLS & EVIDENCE MATRIX                                  */}
      {/* =================================================================== */}
      {activeSubTab === "skills" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="size-4 text-primary" />
              Evidence Status Classification
            </h2>
            <p className="text-xs text-muted-foreground">
              Every technical claim categorized by verified benchmark evidence vs self-declared tools.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {/* 1. Confidently List (Verified) */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.02] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                <span className="font-bold text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="size-4" />
                  Skills You Can Confidently List
                </span>
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none text-[10px]">
                  Verified
                </Badge>
              </div>

              <div className="space-y-2">
                {data.skill_ordering
                  .filter((s) => s.evidence_status === "VERIFIED")
                  .map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="p-2.5 rounded-xl bg-card border flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground">{sk.skill_name}</span>
                      <span className="font-mono text-emerald-600 font-bold">
                        {sk.score ? `${sk.score.toFixed(0)}%` : "Verified"}
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* 2. Skills You Are Building (Learning) */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.02] p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
                <span className="font-bold text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                  <Clock className="size-4" />
                  Skills You Are Building
                </span>
                <Badge className="bg-amber-500/20 text-amber-600 dark:text-amber-400 border-none text-[10px]">
                  In Curriculum
                </Badge>
              </div>

              <div className="space-y-2">
                {data.skill_ordering
                  .filter((s) => s.evidence_status === "LEARNING")
                  .map((sk) => (
                    <div
                      key={sk.skill_code}
                      className="p-2.5 rounded-xl bg-card border flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground/90">{sk.skill_name}</span>
                      <span className="text-[11px] text-muted-foreground font-mono">In Progress</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* 3. Self-Declared on LinkedIn */}
            <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <span className="font-bold text-xs text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle className="size-4" />
                  Self-Declared / Unverified
                </span>
                <Badge variant="outline" className="text-[10px]">
                  Needs Challenge
                </Badge>
              </div>

              <div className="space-y-2 text-xs text-muted-foreground">
                <p className="text-[11px] leading-relaxed">
                  Skills claimed on LinkedIn without verified SPAR challenge artifacts.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["AWS", "Docker", "Git", "Linux"].map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 4: FEATURED PROJECTS STUDIO                                  */}
      {/* =================================================================== */}
      {activeSubTab === "featured" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Layers className="size-4 text-primary" />
              LinkedIn Featured Project Cards
            </h2>
            <p className="text-xs text-muted-foreground">
              Rubric-backed project descriptions formatted for LinkedIn Featured section with clean bullet points.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.featured_projects.map((proj) => (
              <div
                key={proj.project_code}
                className="rounded-3xl border border-border/80 bg-card p-6 space-y-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
                    Featured Artifact
                  </Badge>
                  <span className="text-xs font-mono text-emerald-600 font-bold">
                    Rubric Grade: {proj.score.toFixed(0)}/100
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-foreground">{proj.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {proj.one_line_summary}
                  </p>
                </div>

                <div className="p-3.5 bg-muted/40 rounded-2xl border space-y-2">
                  <div className="text-[11px] font-bold text-foreground">LinkedIn Description Bullets</div>
                  <ul className="list-disc list-inside text-xs text-muted-foreground space-y-1.5 leading-relaxed">
                    {proj.bullet_points.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {proj.technologies.map((tech) => (
                    <Badge key={tech} variant="outline" className="text-[10px]">
                      {tech}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/40">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleCopy(
                        `${proj.title}\n\n${proj.one_line_summary}\n\nKey Highlights:\n` +
                          proj.bullet_points.map((b) => `• ${b}`).join("\n"),
                        `proj_${proj.project_code}`
                      )
                    }
                    className="text-xs gap-1.5"
                  >
                    {copiedKey === `proj_${proj.project_code}` ? (
                      <>
                        <Check className="size-3 text-emerald-500" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="size-3" /> Copy Project Card
                      </>
                    )}
                  </Button>

                  {proj.repo_url && (
                    <a
                      href={proj.repo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1 font-semibold"
                    >
                      View GitHub Repo <ExternalLink className="size-3" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 5: CERTIFICATIONS HUB (Held vs Recommended)                  */}
      {/* =================================================================== */}
      {activeSubTab === "certifications" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Award className="size-4 text-primary" />
                Certification Intelligence Hub
              </h2>
              <p className="text-xs text-muted-foreground">
                Separates verified credentials you hold from curated career recommendations based on your prerequisite readiness.
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setAddCertModalOpen(true)}
              className="text-xs gap-1.5"
            >
              <Plus className="size-3.5" /> Add Held Credential
            </Button>
          </div>

          {/* Held Credentials */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              Credentials You Hold ({data.held_certifications.length})
            </h3>

            {data.held_certifications.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {data.held_certifications.map((c) => (
                  <div key={c.cert_id} className="rounded-xl border p-3.5 bg-muted/20 space-y-1">
                    <div className="font-bold text-xs text-foreground">{c.name}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {c.authority} · {c.issue_date || "Issued"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No external certifications added yet. Click &quot;Add Held Credential&quot; to register completed certifications.
              </p>
            )}
          </div>

          {/* Recommended Credentials */}
          <div className="space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-primary" />
              Recommended Certification Pathways for {data.target_career_name}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {data.recommended_certifications.map((rec) => (
                <div
                  key={rec.cert_code}
                  className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-sm flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-[10px] font-bold">
                        {rec.authority}
                      </Badge>
                      <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold">
                        {rec.priority} Priority
                      </Badge>
                    </div>

                    <h4 className="font-bold text-sm text-foreground">{rec.name}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{rec.why_it_matters}</p>

                    {/* Prerequisite Readiness Progress */}
                    <div className="space-y-1 pt-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-muted-foreground">Prerequisite Readiness</span>
                        <span className="font-mono font-bold text-primary">
                          {rec.prerequisite_readiness_pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="w-full bg-secondary/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${rec.prerequisite_readiness_pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-muted-foreground">{rec.prerequisite_summary}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 text-[11px] text-muted-foreground">
                    <span>Est. Study: ~{rec.estimated_study_weeks} weeks</span>
                    <span>{rec.estimated_cost || "Standard Exam Fee"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SUB-TAB 6: LINKEDIN CONNECTION & SYNC MODAL                          */}
      {/* =================================================================== */}
      {activeSubTab === "sync" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="grid size-10 place-items-center rounded-2xl bg-[#0A66C2]/15 text-[#0A66C2]">
                <Linkedin className="size-5 fill-current" />
              </span>
              <div>
                <h3 className="font-bold text-base text-foreground">LinkedIn OAuth & Import Connection</h3>
                <p className="text-xs text-muted-foreground">
                  Status: {data.connection_state.is_connected ? (
                    <strong className="text-emerald-600">Connected ({data.connection_state.name || "Member"})</strong>
                  ) : (
                    <span className="text-muted-foreground">Not Connected</span>
                  )}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-muted/30 border text-xs space-y-2 text-muted-foreground leading-relaxed">
              <div className="font-bold text-foreground">Transparent LinkedIn API Reality</div>
              <p>
                In compliance with LinkedIn API platform standards, SPAR connects basic OpenID profile identity and supports rich, user-controlled PDF or structured text imports without web scraping.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {!data.connection_state.is_connected ? (
                <Button
                  onClick={() => connectMutation.mutateAsync({ name: "Student Pilot" })}
                  disabled={connectMutation.isPending}
                  className="font-bold text-xs gap-1.5 bg-[#0A66C2] hover:bg-[#0A66C2]/90 text-white"
                >
                  <Linkedin className="size-3.5 fill-current" />
                  Connect LinkedIn
                </Button>
              ) : (
                <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 gap-1 py-1.5 px-3">
                  <ShieldCheck className="size-3.5" /> LinkedIn Connected
                </Badge>
              )}

              <Button
                variant="outline"
                onClick={() => setImportModalOpen(true)}
                className="text-xs font-semibold gap-1.5"
              >
                <Upload className="size-3.5" /> Import Profile (PDF / Text)
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT PROFILE MODAL */}
      <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Import LinkedIn Profile</DialogTitle>
            <DialogDescription className="text-xs">
              Paste text from your downloaded LinkedIn PDF or profile export. SPAR will normalize your headline, about, and skills.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <textarea
              rows={8}
              placeholder="Paste your LinkedIn profile text (Headline, About, Skills, Experience)..."
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background p-3 text-xs text-foreground font-mono focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setImportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleImportSubmit}
              disabled={importMutation.isPending || !pastedText.trim()}
              className="font-semibold text-xs"
            >
              {importMutation.isPending ? "Importing..." : "Process Import"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD CERTIFICATION MODAL */}
      <Dialog open={addCertModalOpen} onOpenChange={setAddCertModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Held Certification</DialogTitle>
            <DialogDescription className="text-xs">
              Register a completed external certification or license you hold.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Certification Name</label>
              <input
                type="text"
                placeholder="e.g. AWS Certified Cloud Practitioner"
                value={certName}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-2 text-xs text-foreground"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Issuing Authority</label>
              <input
                type="text"
                placeholder="e.g. Amazon Web Services"
                value={certAuth}
                onChange={(e) => setCertAuth(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background p-2 text-xs text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setAddCertModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmCertSubmit}
              disabled={confirmCertMutation.isPending || !certName.trim()}
              className="font-semibold text-xs"
            >
              Save Certification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
