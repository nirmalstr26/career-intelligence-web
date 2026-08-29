import React, { useState } from "react";
import {
  Compass,
  Map,
  Award,
  Terminal,
  MessageSquare,
  Target,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Bot,
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
  metrics: string;
}

const LEFT_NODES: SubsystemNode[] = [
  {
    id: "discovery",
    title: "Career Discovery",
    badge: "AFFINITY MATCHING",
    desc: "Multi-dimensional capability modeling that maps strengths to high-growth tech careers.",
    icon: Compass,
    color: "text-cyan-600 dark:text-cyan-400",
    glow: "border-cyan-500/40 bg-cyan-500/10 dark:bg-cyan-950/40 shadow-[0_0_20px_rgba(6,215,247,0.2)]",
    badgeBg: "bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border-cyan-400/30",
    metrics: "94% Match",
  },
  {
    id: "gap",
    title: "Job Gap Optimizer",
    badge: "ROLE CALIBRATION",
    desc: "Compares current student capabilities directly against target campus hiring drives.",
    icon: Target,
    color: "text-amber-600 dark:text-amber-400",
    glow: "border-amber-500/40 bg-amber-500/10 dark:bg-amber-950/40 shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    badgeBg: "bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-400/30",
    metrics: "1-Click Drill",
  },
  {
    id: "interviews",
    title: "AI Interview Prep",
    badge: "VOICE & CODE DEFENSE",
    desc: "Adaptive technical interviewer simulating live loops with real-time speech feedback.",
    icon: MessageSquare,
    color: "text-purple-600 dark:text-purple-400",
    glow: "border-purple-500/40 bg-purple-500/10 dark:bg-purple-950/40 shadow-[0_0_20px_rgba(130,71,255,0.2)]",
    badgeBg: "bg-purple-500/20 text-purple-600 dark:text-purple-300 border-purple-400/30",
    metrics: "STAR Rubric",
  },
];

const RIGHT_NODES: SubsystemNode[] = [
  {
    id: "roadmap",
    title: "Adaptive Roadmap",
    badge: "MASTERY GATING",
    desc: "Dynamically calibrated curriculum paths that unlock advanced topics as proficiency is verified.",
    icon: Map,
    color: "text-blue-600 dark:text-blue-400",
    glow: "border-blue-500/40 bg-blue-500/10 dark:bg-blue-950/40 shadow-[0_0_20px_rgba(0,140,255,0.2)]",
    badgeBg: "bg-blue-500/20 text-blue-600 dark:text-blue-300 border-blue-400/30",
    metrics: "Stage Unlocks",
  },
  {
    id: "readiness",
    title: "Continuous Readiness",
    badge: "BENCHMARK SCORING",
    desc: "Deterministic capability index tracking student progress across 6 core competencies.",
    icon: Award,
    color: "text-teal-600 dark:text-teal-400",
    glow: "border-teal-500/40 bg-teal-500/10 dark:bg-teal-950/40 shadow-[0_0_20px_rgba(20,184,166,0.2)]",
    badgeBg: "bg-teal-500/20 text-teal-600 dark:text-teal-300 border-teal-400/30",
    metrics: "Top 12% Rank",
  },
  {
    id: "projects",
    title: "Production Projects",
    badge: "PROOF OF WORK",
    desc: "Hands-on full-stack & distributed repositories evaluated by automated unit rubrics.",
    icon: Terminal,
    color: "text-indigo-600 dark:text-indigo-400",
    glow: "border-indigo-500/40 bg-indigo-500/10 dark:bg-indigo-950/40 shadow-[0_0_20px_rgba(70,87,255,0.2)]",
    badgeBg: "bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border-indigo-400/30",
    metrics: "98.4% Tests",
  },
];

const ALL_NODES = [...LEFT_NODES, ...RIGHT_NODES];

export function UnifiedArchitecture() {
  const [selectedNode, setSelectedNode] = useState<string>("discovery");
  const activeItem = ALL_NODES.find((n) => n.id === selectedNode) || ALL_NODES[0];

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
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5 text-cyan-500" />
          Unified Architecture
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          One connected intelligence engine for your{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            entire career journey.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Unlike fragmented tools, SPAR unifies career exploration, curriculum sequencing, live proof validation, and placement calibration into a single continuous feedback loop.
        </p>
      </div>

      {/* Live Status Indicators Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-6 px-4">
        <div className="flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-card/90 dark:bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-cyan-600 dark:text-cyan-300 backdrop-blur shadow-sm">
          <Zap className="size-3 text-cyan-500 animate-pulse" />
          <span>Real-time Readiness Sync</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-card/90 dark:bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-blue-600 dark:text-blue-300 backdrop-blur shadow-sm">
          <ShieldCheck className="size-3 text-blue-500" />
          <span>Verified Capability Evidence</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-card/90 dark:bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300 backdrop-blur shadow-sm">
          <Bot className="size-3 text-purple-500" />
          <span>Context-Aware AI Guidance</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-card/90 dark:bg-[#090e24]/80 px-3 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300 backdrop-blur shadow-sm">
          <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Placement Drive Pipeline</span>
        </div>
      </div>

      {/* 3-COLUMN STRUCTURED ARCHITECTURE MATRIX */}
      <div className="relative mt-8 max-w-6xl mx-auto rounded-3xl border border-border/80 bg-card/90 dark:bg-[#090e24]/80 p-6 sm:p-8 lg:p-10 backdrop-blur-2xl shadow-xl overflow-hidden">
        
        {/* Subtle Tech Grid Circuit Pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(6, 215, 247, 0.4) 1px, transparent 1px), radial-gradient(rgba(70, 87, 255, 0.3) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
          }}
        />

        {/* 3-Column Layout: Left Subsystems | Center Core Orb | Right Subsystems */}
        <div className="relative z-20 grid grid-cols-1 lg:grid-cols-[1fr_260px_1fr] xl:grid-cols-[1fr_280px_1fr] items-center gap-6 lg:gap-8">
          
          {/* LEFT COLUMN: 3 Non-Overlapping Subsystem Cards */}
          <div className="flex flex-col gap-4">
            {LEFT_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`cursor-pointer rounded-2xl border p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                    isSelected
                      ? `${node.glow} border-cyan-500 bg-secondary/80 dark:bg-[#0d173d]`
                      : "border-border/70 bg-card dark:bg-[#090e24]/90 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid size-8 place-items-center rounded-xl border ${node.badgeBg}`}>
                        <Icon className="size-4" />
                      </span>
                      <span className="font-display text-xs sm:text-sm font-bold text-foreground">
                        {node.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {node.metrics}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CENTER COLUMN: Central SPAR AI Intelligence Core Orb */}
          <div className="flex flex-col items-center justify-center my-4 lg:my-0">
            {/* Concentric Pulsing Orbit Rings */}
            <div className="relative grid size-48 sm:size-52 place-items-center">
              <div className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping opacity-30" />
              <div className="absolute inset-2 rounded-full border-2 border-blue-500/30 opacity-75 animate-pulse" />
              <div className="absolute inset-5 rounded-full border border-cyan-500/60 shadow-[0_0_30px_rgba(6,215,247,0.4)]" />

              {/* Core Orb with Official SPAR AI Symbol */}
              <div className="relative grid size-28 sm:size-32 place-items-center rounded-full bg-gradient-to-tr from-cyan-500/40 via-blue-600/60 to-purple-600/80 backdrop-blur-xl border border-cyan-300/80 shadow-[0_0_35px_rgba(6,215,247,0.85)]">
                <img
                  src="/brand/icon/spar-ai-icon-128.png"
                  alt="SPAR AI Intelligence Core"
                  className="size-12 sm:size-14 object-contain drop-shadow-[0_0_15px_#06d7f7] animate-pulse"
                />
                <span className="font-display text-[10px] font-black uppercase tracking-wider text-white mt-1 drop-shadow">
                  AI CORE
                </span>
              </div>
            </div>

            <div className="mt-2 text-center">
              <span className="rounded-full bg-cyan-500/20 border border-cyan-500/40 px-3 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-300 shadow-sm">
                Continuous Sync Active
              </span>
            </div>
          </div>

          {/* RIGHT COLUMN: 3 Non-Overlapping Subsystem Cards */}
          <div className="flex flex-col gap-4">
            {RIGHT_NODES.map((node) => {
              const Icon = node.icon;
              const isSelected = selectedNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNode(node.id)}
                  className={`cursor-pointer rounded-2xl border p-4 sm:p-4.5 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] shadow-sm ${
                    isSelected
                      ? `${node.glow} border-cyan-500 bg-secondary/80 dark:bg-[#0d173d]`
                      : "border-border/70 bg-card dark:bg-[#090e24]/90 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className={`grid size-8 place-items-center rounded-xl border ${node.badgeBg}`}>
                        <Icon className="size-4" />
                      </span>
                      <span className="font-display text-xs sm:text-sm font-bold text-foreground">
                        {node.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
                      {node.metrics}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {node.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>

      {/* Active Subsystem Detail Banner */}
      <div className="mt-6 max-w-4xl mx-auto rounded-2xl border border-border/80 bg-card/95 dark:bg-gradient-to-r dark:from-cyan-950/40 dark:via-blue-950/30 dark:to-purple-950/40 p-4 sm:p-5 backdrop-blur-xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-xl border ${activeItem.badgeBg} shadow-sm`}>
            {React.createElement(activeItem.icon, { className: "size-5" })}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-sm font-bold text-foreground">{activeItem.title}</h4>
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 dark:bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/40">
                {activeItem.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{activeItem.desc}</p>
          </div>
        </div>

        <a
          href={`#${activeItem.id}`}
          className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline transition-colors"
        >
          <span>Explore Subsystem</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
