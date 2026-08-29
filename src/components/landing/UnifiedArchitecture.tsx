import React, { useState } from "react";
import {
  Compass,
  Map,
  Award,
  Terminal,
  MessageSquare,
  Target,
  Users,
  ShieldCheck,
  Sparkles,
  Zap,
  Cpu,
  ArrowRight,
  Database,
  Layers,
  Bot,
  TrendingUp,
} from "lucide-react";

interface SubsystemNode {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  badgeBg: string;
  position: {
    desktop: string; // CSS positioning classes
  };
  metrics: string;
}

const NODES: SubsystemNode[] = [
  {
    id: "discovery",
    title: "Career Discovery",
    badge: "AFFINITY MATCHING",
    desc: "Multi-dimensional capability modeling that maps student strengths to high-growth tech careers.",
    icon: Compass,
    color: "text-cyan-400",
    glow: "border-cyan-500/40 bg-cyan-950/40 shadow-[0_0_20px_rgba(6,215,247,0.3)]",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    position: { desktop: "lg:top-4 lg:left-12" },
    metrics: "94% Match Accuracy",
  },
  {
    id: "roadmap",
    title: "Adaptive Roadmap",
    badge: "MASTERY GATING",
    desc: "Dynamically calibrated curriculum paths that unlock advanced topics as proficiency is verified.",
    icon: Map,
    color: "text-blue-400",
    glow: "border-blue-500/40 bg-blue-950/40 shadow-[0_0_20px_rgba(0,140,255,0.3)]",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    position: { desktop: "lg:top-4 lg:right-12" },
    metrics: "Stage-Gated Unlocks",
  },
  {
    id: "readiness",
    title: "Continuous Readiness",
    badge: "BENCHMARK SCORING",
    desc: "Deterministic capability index tracking student progress across 6 core competency dimensions.",
    icon: Award,
    color: "text-teal-400",
    glow: "border-teal-500/40 bg-teal-950/40 shadow-[0_0_20px_rgba(20,184,166,0.3)]",
    badgeBg: "bg-teal-500/20 text-teal-300 border-teal-400/30",
    position: { desktop: "lg:top-1/2 lg:-translate-y-1/2 lg:right-0" },
    metrics: "Top 12% Benchmark",
  },
  {
    id: "projects",
    title: "Production Projects",
    badge: "PROOF OF WORK",
    desc: "Hands-on full-stack & distributed repositories evaluated by automated unit & architectural rubrics.",
    icon: Terminal,
    color: "text-indigo-400",
    glow: "border-indigo-500/40 bg-indigo-950/40 shadow-[0_0_20px_rgba(70,87,255,0.3)]",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    position: { desktop: "lg:bottom-6 lg:right-16" },
    metrics: "98.4% Test Coverage",
  },
  {
    id: "interviews",
    title: "AI Interview Prep",
    badge: "VOICE & CODE DEFENSE",
    desc: "Adaptive technical interviewer simulating live company loops with real-time speech and code feedback.",
    icon: MessageSquare,
    color: "text-purple-400",
    glow: "border-purple-500/40 bg-purple-950/40 shadow-[0_0_20px_rgba(130,71,255,0.3)]",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    position: { desktop: "lg:bottom-6 lg:left-16" },
    metrics: "Real-time STAR Rubric",
  },
  {
    id: "gap",
    title: "Job Gap Optimizer",
    badge: "ROLE CALIBRATION",
    desc: "Compares current student capabilities directly against target campus hiring drives and JD requirements.",
    icon: Target,
    color: "text-amber-400",
    glow: "border-amber-500/40 bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.3)]",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-400/30",
    position: { desktop: "lg:top-1/2 lg:-translate-y-1/2 lg:left-0" },
    metrics: "1-Click Remediation",
  },
];

export function UnifiedArchitecture() {
  const [selectedNode, setSelectedNode] = useState<string>("discovery");
  const activeItem = NODES.find((n) => n.id === selectedNode) || NODES[0];

  return (
    <section id="architecture" className="my-24 scroll-mt-24 select-none relative">
      {/* Background Ambient Nebula Bloom */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(circle 500px at 50% 50%, rgba(6, 215, 247, 0.12), rgba(70, 87, 255, 0.08) 40%, rgba(130, 71, 255, 0.05) 70%, transparent 95%)",
        }}
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.25)] backdrop-blur">
          <Sparkles className="size-3.5 text-cyan-400" />
          Unified Intelligence Layer
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          One intelligence layer powering the{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            entire student journey.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          SPAR connects discovery, diagnostics, learning paths, projects, readiness scoring, and placement preparation into one continuously evolving AI career intelligence system.
        </p>
      </div>

      {/* Floating Status Badges Pill Bar */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-6 pb-2 px-4">
        <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-cyan-300 backdrop-blur shadow-sm">
          <ShieldCheck className="size-3.5 text-cyan-400" />
          <span>Unified Identity Profile</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-blue-300 backdrop-blur shadow-sm">
          <Zap className="size-3.5 text-blue-400" />
          <span>Live Readiness Calibration</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-purple-300 backdrop-blur shadow-sm">
          <Bot className="size-3.5 text-purple-400" />
          <span>AI Recommendations Engine</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-emerald-300 backdrop-blur shadow-sm">
          <Award className="size-3.5 text-emerald-400" />
          <span>Verified Proof of Work</span>
        </div>
      </div>

      {/* CENTRAL INTELLIGENCE ARCHITECTURE VISUAL HUB */}
      <div className="relative mt-8 max-w-6xl mx-auto min-h-[580px] lg:min-h-[640px] rounded-3xl border border-border/80 bg-[#090e24]/75 p-6 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.6)] flex items-center justify-center overflow-hidden">
        
        {/* Subtle Tech Grid Background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              "radial-gradient(rgba(6, 215, 247, 0.4) 1px, transparent 1px), radial-gradient(rgba(70, 87, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            backgroundPosition: "0 0, 16px 16px",
          }}
        />

        {/* SVG Neural Connector Lines (Desktop) */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full hidden lg:block overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="coreLineGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06D7F7" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#4657FF" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#8247FF" stopOpacity="0.8" />
            </linearGradient>
            <filter id="lineNeon" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Central Orbit Ring */}
          <circle
            cx="50%"
            cy="50%"
            r="160"
            fill="none"
            stroke="url(#coreLineGlow)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="opacity-40 animate-[spin_60s_linear_infinite]"
          />
          <circle
            cx="50%"
            cy="50%"
            r="240"
            fill="none"
            stroke="rgba(6, 215, 247, 0.2)"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="opacity-30"
          />

          {/* 6 Connector Lines radiating from Center (50%, 50%) to Nodes */}
          {/* Top-Left: Discovery */}
          <line x1="50%" y1="50%" x2="22%" y2="15%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
          {/* Top-Right: Roadmap */}
          <line x1="50%" y1="50%" x2="78%" y2="15%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
          {/* Mid-Right: Readiness */}
          <line x1="50%" y1="50%" x2="88%" y2="50%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
          {/* Bottom-Right: Projects */}
          <line x1="50%" y1="50%" x2="78%" y2="85%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
          {/* Bottom-Left: Interviews */}
          <line x1="50%" y1="50%" x2="22%" y2="85%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
          {/* Mid-Left: Job Gap */}
          <line x1="50%" y1="50%" x2="12%" y2="50%" stroke="url(#coreLineGlow)" strokeWidth="2" filter="url(#lineNeon)" className="opacity-60" />
        </svg>

        {/* 6 SATELLITE SUBSYSTEM NODES */}
        <div className="relative w-full h-full flex flex-col lg:block gap-4 z-20">
          {NODES.map((node) => {
            const Icon = node.icon;
            const isSelected = selectedNode === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`lg:absolute ${node.position.desktop} cursor-pointer transition-all duration-300 hover:scale-105 group`}
              >
                <div
                  className={`w-full lg:w-64 rounded-2xl border p-4 backdrop-blur-xl transition-all ${
                    isSelected
                      ? `${node.glow} scale-102 border-cyan-400`
                      : "border-border/70 bg-[#090e24]/90 hover:border-cyan-500/40 hover:bg-[#0d1436]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`grid size-8 place-items-center rounded-xl border ${node.badgeBg}`}>
                        <Icon className="size-4" />
                      </span>
                      <span className="font-display text-xs font-bold text-white">
                        {node.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {node.metrics}
                    </span>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                    {node.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTERPIECE: Glowing Circular SPAR AI Intelligence Core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center justify-center">
          {/* Multi-Layer Pulsing Energy Rings */}
          <div className="relative grid size-36 sm:size-44 place-items-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-ping opacity-25" />
            <div className="absolute inset-2 rounded-full border border-blue-500/40 opacity-70 animate-pulse" />
            <div className="absolute inset-4 rounded-full border-2 border-cyan-400/80 shadow-[0_0_35px_rgba(6,215,247,0.7)]" />

            {/* Core Orb with Official SPAR AI Symbol */}
            <div className="relative grid size-24 sm:size-28 place-items-center rounded-full bg-gradient-to-tr from-cyan-500/40 via-blue-600/60 to-purple-600/80 backdrop-blur-xl border border-cyan-300/80 shadow-[0_0_30px_rgba(6,215,247,0.9)]">
              <img
                src="/brand/icon/spar-ai-icon-128.png"
                alt="SPAR AI Intelligence Core"
                className="size-11 sm:size-12 object-contain drop-shadow-[0_0_15px_#06d7f7] animate-pulse"
              />
              <span className="font-display text-[10px] font-black uppercase tracking-wider text-white mt-1 drop-shadow">
                AI CORE
              </span>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="rounded-full bg-cyan-500/20 border border-cyan-400/40 px-3 py-0.5 text-[10px] font-bold text-cyan-300 shadow-sm">
              Continuous Sync Active
            </span>
          </div>
        </div>
      </div>

      {/* Active Subsystem Detail Banner */}
      <div className="mt-6 max-w-4xl mx-auto rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl border ${activeItem.badgeBg} shadow-sm`}>
            {React.createElement(activeItem.icon, { className: "size-5" })}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-sm font-bold text-white">{activeItem.title}</h4>
              <span className="text-[10px] font-bold text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/40">
                {activeItem.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activeItem.desc}</p>
          </div>
        </div>

        <a
          href={`#${activeItem.id}`}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <span>Explore Subsystem</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
