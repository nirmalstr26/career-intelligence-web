import React, { useState } from "react";
import {
  Database,
  Brain,
  Code2,
  Shield,
  Cloud,
  BarChart3,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Briefcase,
  Layers,
  Cpu,
  Zap,
  CheckCircle2,
  Lock,
  Activity,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

interface CareerPath {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  salaryBand: string;
  demandGrowth: string;
  matchScore: string;
  skills: string[];
  status: "Full Guided Path" | "Explore Career";
  icon: React.ElementType;
  themeColor: string;
  glowBorder: string;
  badgeColor: string;
  renderVisual: () => React.ReactNode;
}

const CAREER_PATHS: CareerPath[] = [
  // 1. DATA ENGINEER
  {
    id: "data_engineer",
    title: "Data Engineer",
    category: "Data & Systems",
    tagline: "High-Throughput Lakehouse & Pipelines",
    description: "Design, build, and scale distributed ETL/ELT pipelines, lakehouse architectures, and real-time streaming infrastructure.",
    salaryBand: "₹14L–₹22L Avg",
    demandGrowth: "+38% YoY Hiring",
    matchScore: "94% Fit Rate",
    skills: ["Apache Spark", "Python", "SQL", "Airflow", "Kafka", "Data Lakehouse"],
    status: "Full Guided Path",
    icon: Database,
    themeColor: "from-cyan-500/20 to-blue-600/10",
    glowBorder: "hover:border-cyan-400/60 hover:shadow-[0_0_30px_rgba(6,215,247,0.25)]",
    badgeColor: "border-cyan-400/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-cyan-500/20 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
              <Database className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Spark Streaming Engine</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            Live 48k evt/s
          </span>
        </div>

        {/* Pipeline Node Simulation */}
        <div className="flex items-center justify-between rounded-xl bg-slate-900/90 border border-border/50 p-2.5 z-10">
          <div className="text-center">
            <span className="text-[8px] text-slate-400 block">Ingestion</span>
            <span className="text-[10px] font-bold text-cyan-300">Kafka 3.2</span>
          </div>
          <div className="h-0.5 w-6 bg-gradient-to-r from-cyan-400 to-blue-500 animate-pulse" />
          <div className="text-center">
            <span className="text-[8px] text-slate-400 block">Processing</span>
            <span className="text-[10px] font-bold text-blue-300">PySpark ETL</span>
          </div>
          <div className="h-0.5 w-6 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" />
          <div className="text-center">
            <span className="text-[8px] text-slate-400 block">Lakehouse</span>
            <span className="text-[10px] font-bold text-purple-300">Iceberg</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-cyan-200/90 z-10">
          <span>Latency: &lt;14ms p99</span>
          <span className="text-emerald-400 font-bold">100% Data Integrity ✓</span>
        </div>
      </div>
    ),
  },

  // 2. AI / ML ENGINEER
  {
    id: "ai_engineer",
    title: "AI / Machine Learning Engineer",
    category: "Artificial Intelligence",
    tagline: "Transformer Models & RAG Systems",
    description: "Train, evaluate, and deploy deep learning models, LLM agents, RAG architectures, and scalable inference APIs.",
    salaryBand: "₹16L–₹26L Avg",
    demandGrowth: "+45% YoY Hiring",
    matchScore: "96% Fit Rate",
    skills: ["PyTorch", "Transformers", "RAG Systems", "LangChain", "Vector DBs", "Model Serving"],
    status: "Full Guided Path",
    icon: Brain,
    themeColor: "from-indigo-500/20 to-purple-600/10",
    glowBorder: "hover:border-indigo-400/60 hover:shadow-[0_0_30px_rgba(70,87,255,0.25)]",
    badgeColor: "border-indigo-400/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
              <Brain className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">LLM Agent & RAG Pipeline</span>
          </div>
          <span className="rounded-full bg-indigo-500/20 border border-indigo-500/40 px-2 py-0.5 text-[9px] font-bold text-indigo-300">
            Vector Top-K: 98%
          </span>
        </div>

        {/* Neural Network Attention Layer Visual */}
        <div className="space-y-1.5 rounded-xl bg-slate-900/90 border border-border/50 p-2.5 z-10">
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">Self-Attention Accuracy</span>
            <span className="text-indigo-300 font-bold">96.8%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 w-[96%]" />
          </div>
          <div className="flex justify-between text-[8px] text-slate-400 pt-0.5">
            <span>Inference: 18ms</span>
            <span>Context: 128k tokens</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-indigo-200/90 z-10">
          <span>Fine-Tuned LoRA Weights</span>
          <span className="text-cyan-400 font-bold">Inference Ready ⚡</span>
        </div>
      </div>
    ),
  },

  // 3. SOFTWARE ENGINEER
  {
    id: "software_engineer",
    title: "Full-Stack Software Engineer",
    category: "Software Development",
    tagline: "Scalable Microservices & Modern Web",
    description: "Build robust full-stack web applications, microservices, performant APIs, and distributed database systems.",
    salaryBand: "₹12L–₹20L Avg",
    demandGrowth: "+32% YoY Hiring",
    matchScore: "92% Fit Rate",
    skills: ["TypeScript", "React / Next.js", "Go / Python", "PostgreSQL", "System Design", "Docker"],
    status: "Full Guided Path",
    icon: Code2,
    themeColor: "from-blue-500/20 to-cyan-600/10",
    glowBorder: "hover:border-blue-400/60 hover:shadow-[0_0_30px_rgba(0,140,255,0.25)]",
    badgeColor: "border-blue-400/40 bg-blue-500/10 text-blue-600 dark:text-blue-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-blue-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/40">
              <Code2 className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Full-Stack Microservices</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            Build Passing ✓
          </span>
        </div>

        {/* IDE Code Snapshot */}
        <div className="rounded-xl bg-slate-900/90 border border-border/50 p-2 font-mono text-[9px] text-cyan-200 z-10 space-y-0.5">
          <p><span className="text-purple-400">export async function</span> <span className="text-blue-400">handleOrder</span>(ctx) &#123;</p>
          <p className="pl-3 text-slate-400">// Distributed ACID Transaction</p>
          <p className="pl-3"><span className="text-cyan-400">await</span> db.tx.commit(); <span className="text-emerald-400">// &lt;4ms</span></p>
          <p>&#125;</p>
        </div>

        <div className="flex items-center justify-between text-[10px] text-blue-200/90 z-10">
          <span>Coverage: 98.4%</span>
          <span className="text-cyan-400 font-bold">12ms p99 Global CDN</span>
        </div>
      </div>
    ),
  },

  // 4. CLOUD & DEVOPS
  {
    id: "cloud_devops",
    title: "Cloud & DevOps Engineer",
    category: "Cloud Infrastructure",
    tagline: "Kubernetes & Infrastructure as Code",
    description: "Automate cloud deployments, Kubernetes cluster orchestration, CI/CD pipelines, and infrastructure as code.",
    salaryBand: "₹15L–₹24L Avg",
    demandGrowth: "+40% YoY Hiring",
    matchScore: "89% Fit Rate",
    skills: ["AWS / GCP", "Kubernetes", "Terraform IaC", "CI/CD Actions", "Docker", "Linux Kernel"],
    status: "Explore Career",
    icon: Cloud,
    themeColor: "from-teal-500/20 to-emerald-600/10",
    glowBorder: "hover:border-teal-400/60 hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]",
    badgeColor: "border-teal-400/40 bg-teal-500/10 text-teal-600 dark:text-teal-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-teal-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-teal-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-teal-500/20 text-teal-400 border border-teal-500/40">
              <Cloud className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">K8s Cluster Orchestrator</span>
          </div>
          <span className="rounded-full bg-teal-500/20 border border-teal-500/40 px-2 py-0.5 text-[9px] font-bold text-teal-300">
            12/12 Pods Active
          </span>
        </div>

        {/* Terraform IaC Status Bar */}
        <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-slate-900/90 border border-border/50 p-2 text-center z-10">
          <div>
            <span className="text-[8px] text-slate-400 block">Terraform</span>
            <span className="text-[10px] font-bold text-emerald-400">Applied ✓</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block">Multi-AZ</span>
            <span className="text-[10px] font-bold text-cyan-400">99.99%</span>
          </div>
          <div>
            <span className="text-[8px] text-slate-400 block">Security</span>
            <span className="text-[10px] font-bold text-teal-300">SOC2 Hardened</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-teal-200/90 z-10">
          <span>Auto-Scaling Enabled</span>
          <span className="text-emerald-400 font-bold">Zero Downtime Deploy</span>
        </div>
      </div>
    ),
  },

  // 5. CYBERSECURITY
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    category: "Information Security",
    tagline: "Threat Hunting & Zero-Trust Defense",
    description: "Protect systems and networks against vulnerabilities, conduct threat hunting, and implement zero-trust security postures.",
    salaryBand: "₹13L–₹22L Avg",
    demandGrowth: "+42% YoY Hiring",
    matchScore: "88% Fit Rate",
    skills: ["Network Security", "Penetration Testing", "SIEM Monitoring", "Cryptography", "Zero Trust"],
    status: "Explore Career",
    icon: Shield,
    themeColor: "from-purple-500/20 to-pink-600/10",
    glowBorder: "hover:border-purple-400/60 hover:shadow-[0_0_30px_rgba(130,71,255,0.25)]",
    badgeColor: "border-purple-400/40 bg-purple-500/10 text-purple-600 dark:text-purple-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-purple-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/40">
              <Shield className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Zero-Trust Threat Radar</span>
          </div>
          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            0 Vulnerabilities
          </span>
        </div>

        {/* Security SIEM Matrix */}
        <div className="space-y-1.5 rounded-xl bg-slate-900/90 border border-border/50 p-2 z-10">
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">End-to-End Encryption</span>
            <span className="text-purple-300 font-bold">AES-256-GCM ✓</span>
          </div>
          <div className="flex justify-between text-[9px]">
            <span className="text-slate-400">Intrusion Detection (IDS)</span>
            <span className="text-cyan-400 font-bold">Active Shielding</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-purple-200/90 z-10">
          <span>OWASP Top 10 Audited</span>
          <span className="text-emerald-400 font-bold">Verified Immunity ✓</span>
        </div>
      </div>
    ),
  },

  // 6. DATA ANALYST
  {
    id: "data_analyst",
    title: "Business & Data Analyst",
    category: "Data & BI",
    tagline: "Statistical Modeling & Executive BI",
    description: "Transform complex operational datasets into executive dashboards, business insights, and statistical predictive models.",
    salaryBand: "₹10L–₹18L Avg",
    demandGrowth: "+30% YoY Hiring",
    matchScore: "91% Fit Rate",
    skills: ["SQL Advanced", "Power BI / Tableau", "Python Pandas", "Statistical Modeling", "Executive BI"],
    status: "Full Guided Path",
    icon: BarChart3,
    themeColor: "from-amber-500/20 to-orange-600/10",
    glowBorder: "hover:border-amber-400/60 hover:shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    badgeColor: "border-amber-400/40 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    renderVisual: () => (
      <div className="relative h-44 w-full rounded-2xl border border-amber-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5 flex flex-col justify-between overflow-hidden">
        <div className="absolute -top-10 -right-10 size-28 bg-amber-500/20 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/40">
              <BarChart3 className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Executive BI Dashboard</span>
          </div>
          <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[9px] font-bold text-amber-300">
            Predictive Model 94%
          </span>
        </div>

        {/* Animated BI Telemetry Bars */}
        <div className="flex items-end justify-between gap-1.5 h-12 rounded-xl bg-slate-900/90 border border-border/50 p-2 z-10">
          {[35, 55, 45, 75, 60, 90, 80, 100, 70, 85].map((val, i) => (
            <div key={i} className="flex-1 bg-slate-800 rounded-sm h-full flex items-end">
              <div
                className="w-full bg-gradient-to-t from-amber-500 to-orange-400 rounded-sm transition-all"
                style={{ height: `${val}%` }}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between text-[10px] text-amber-200/90 z-10">
          <span>SQL Query Optimization</span>
          <span className="text-amber-400 font-bold">&lt;80ms Aggregation</span>
        </div>
      </div>
    ),
  },
];

export function CareerPathsSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", "Data & Systems", "Artificial Intelligence", "Software Development", "Cloud Infrastructure", "Information Security", "Data & BI"];

  const filteredPaths = activeCategory === "All"
    ? CAREER_PATHS
    : CAREER_PATHS.filter((p) => p.category === activeCategory);

  const handleCardClick = (title: string) => {
    trackLandingEvent("CAREER_PATH_EXPLORED", { career: title });
    const authCard = document.getElementById("auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="careers" className="my-24 scroll-mt-24 space-y-12 select-none relative">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle 500px at 50% 40%, rgba(6, 215, 247, 0.12), rgba(70, 87, 255, 0.08) 45%, transparent 90%)",
        }}
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5 text-cyan-500" />
          Supported Career Directions
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Explore where SPAR can{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            take you.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Each path includes curated competency roadmaps, verified skill assessments, hands-on project artifacts, and interview coaching.
        </p>
      </div>

      {/* Interactive Category Filter Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 px-4">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
              activeCategory === cat
                ? "bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-md"
                : "border border-border/70 bg-card/90 dark:bg-[#090e24]/80 text-muted-foreground hover:text-foreground hover:border-cyan-500/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 6 Rich Holographic Career Direction Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 px-2">
        {filteredPaths.map((path) => {
          const Icon = path.icon;
          return (
            <div
              key={path.id}
              onClick={() => handleCardClick(path.title)}
              className={`surface-panel group relative rounded-3xl p-5 sm:p-6 border border-border/80 bg-card/95 dark:bg-[#090e24]/85 backdrop-blur-2xl shadow-xl cursor-pointer transition-all duration-300 hover:-translate-y-2 flex flex-col justify-between ${path.glowBorder}`}
            >
              {/* Top: Rich Visual Architecture Preview */}
              <div className="space-y-4">
                {path.renderVisual()}

                {/* Eyebrow & Status */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {path.category}
                  </span>
                  <span className={`rounded-full border px-2.5 py-0.5 text-[9px] font-bold ${path.badgeColor}`}>
                    {path.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                    {path.title}
                  </h3>
                  <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 mt-0.5">
                    {path.tagline}
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {path.description}
                  </p>
                </div>

                {/* Salary & Demand Metrics Pill Bar */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50">
                  <div className="rounded-xl bg-slate-100 dark:bg-[#0d1436] p-2 border border-border/60 text-center">
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Campus Salary</span>
                    <span className="text-xs font-bold text-foreground">{path.salaryBand}</span>
                  </div>
                  <div className="rounded-xl bg-slate-100 dark:bg-[#0d1436] p-2 border border-border/60 text-center">
                    <span className="text-[8px] uppercase tracking-wider text-muted-foreground block">Hiring Growth</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{path.demandGrowth}</span>
                  </div>
                </div>

                {/* Skill Stack Chips */}
                <div className="pt-1 flex flex-wrap gap-1.5">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-slate-100/90 dark:bg-[#0d1436]/90 border border-border/60 px-2 py-0.5 text-[10px] font-medium text-foreground group-hover:border-cyan-500/30 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom CTA Action Bar */}
              <div className="mt-6 pt-3.5 border-t border-border/60 flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:underline">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-cyan-500" />
                  <span>Start Path Diagnostic</span>
                </span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
