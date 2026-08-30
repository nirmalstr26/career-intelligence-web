import React, { useState } from "react";
import {
  Cpu,
  Compass,
  Map,
  Award,
  Terminal,
  MessageSquare,
  Target,
  Sparkles,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  role: string;
  tag: string;
  icon: React.ElementType;
  iconColor: string;
  nodeColor: string;
  bgGlow: string;
  description: string;
}

const NODES: GraphNode[] = [
  {
    id: "discovery",
    label: "Career Discovery",
    role: "Direction & Fit",
    tag: "Career",
    icon: Compass,
    iconColor: "text-cyan-400",
    nodeColor: "border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(6,215,247,0.2)]",
    description: "Maps student strengths to high-trajectory tech career archetypes.",
  },
  {
    id: "roadmap",
    label: "Adaptive Roadmap",
    role: "Milestone Curriculum",
    tag: "Skill",
    icon: Map,
    iconColor: "text-blue-400",
    nodeColor: "border-blue-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(59,130,246,0.2)]",
    description: "Unlocks progressive skills based on evaluated performance.",
  },
  {
    id: "projects",
    label: "Verified Projects",
    role: "Practical Proof",
    tag: "Project",
    icon: Terminal,
    iconColor: "text-amber-400",
    nodeColor: "border-amber-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(245,158,11,0.2)]",
    description: "Evaluates code against industry production standards.",
  },
  {
    id: "readiness",
    label: "Readiness Index",
    role: "6D Scoring Engine",
    tag: "Assessment",
    icon: Award,
    iconColor: "text-purple-400",
    nodeColor: "border-purple-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(168,85,247,0.2)]",
    description: "Computes continuous hiring readiness across all competencies.",
  },
  {
    id: "interview",
    label: "Interview Prep",
    role: "Adaptive Mocks",
    tag: "Evidence",
    icon: MessageSquare,
    iconColor: "text-indigo-400",
    nodeColor: "border-indigo-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(99,102,241,0.2)]",
    description: "Simulates technical rounds with real-time articulation feedback.",
  },
  {
    id: "optimizer",
    label: "Job Gap Optimizer",
    role: "JD Alignment",
    tag: "Opportunity",
    icon: Target,
    iconColor: "text-emerald-400",
    nodeColor: "border-emerald-500/40 bg-card/90 dark:bg-[#090e24]/90",
    bgGlow: "shadow-[0_0_20px_rgba(16,185,129,0.2)]",
    description: "Scans open roles and pinpoints exact skill gaps to bridge.",
  },
];

export function UnifiedArchitecture() {
  const [activeNode, setActiveNode] = useState<string>("readiness");
  const selected = NODES.find((n) => n.id === activeNode) || NODES[3];

  return (
    <section id="architecture" className="my-24 scroll-mt-24 space-y-10 select-none">
      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300 shadow-sm backdrop-blur">
          <Cpu className="size-3.5 text-blue-500" />
          Connected Career Intelligence
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          One connected intelligence engine for your{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            entire career journey.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Every skill, project milestone, mock interview, and diagnostic dynamically connects into a continuous career knowledge graph.
        </p>
      </div>

      {/* HERO VISUALIZATION CANVAS: Central SPAR AI Core + Orbiting Connected Subsystems */}
      <div className="relative mx-auto max-w-5xl rounded-3xl border border-border/80 bg-card/60 dark:bg-[#070c20]/80 p-6 sm:p-10 backdrop-blur-2xl shadow-2xl overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 size-96 rounded-full bg-purple-500/10 blur-3xl" />

        {/* Floating Graph Ontology Labels */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {["Career", "Skill", "Assessment", "Project", "Evidence", "Opportunity"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-border/60 bg-secondary/50 px-3 py-0.5 text-[11px] font-mono text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Desktop Interactive Graph & Central Hub Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px_1fr] items-center gap-6 relative z-10">
          {/* Left 3 Nodes: Career -> Skill -> Project */}
          <div className="space-y-3.5">
            {NODES.slice(0, 3).map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                    isSelected
                      ? `border-cyan-500 bg-secondary/90 dark:bg-[#0d173d] ${node.bgGlow} scale-[1.02]`
                      : `${node.nodeColor} hover:border-cyan-500/40 hover:-translate-y-0.5`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-xl bg-secondary border border-border/80">
                        <Icon className={`size-4 ${node.iconColor}`} />
                      </span>
                      <div>
                        <span className="font-display text-sm font-bold text-foreground block">
                          {node.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {node.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-500 uppercase font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {node.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Center: Glowing SPAR AI Core with Particle Flow */}
          <div className="flex flex-col items-center justify-center p-4">
            <div className="relative group">
              {/* Outer pulsing breathing ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-40 blur-lg animate-pulse" />

              {/* Core Body */}
              <div className="relative size-36 sm:size-40 rounded-full border-2 border-cyan-400 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 flex flex-col items-center justify-center text-center p-4 shadow-[0_0_40px_rgba(6,215,247,0.35)]">
                <span className="grid size-10 place-items-center rounded-full bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 mb-1 shadow-[0_0_15px_rgba(6,215,247,0.5)]">
                  <Cpu className="size-5" />
                </span>
                <span className="font-display text-xs sm:text-sm font-extrabold text-white tracking-wider uppercase">
                  SPAR AI Core
                </span>
                <span className="text-[9px] font-mono text-cyan-300 mt-0.5">
                  Knowledge Graph
                </span>
              </div>
            </div>

            {/* Active Sync Pulse */}
            <div className="mt-4 flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold text-cyan-600 dark:text-cyan-300">
              <span className="size-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Real-Time Graph Sync Active</span>
            </div>
          </div>

          {/* Right 3 Nodes: Assessment -> Evidence -> Opportunity */}
          <div className="space-y-3.5">
            {NODES.slice(3, 6).map((node) => {
              const Icon = node.icon;
              const isSelected = activeNode === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all duration-300 ${
                    isSelected
                      ? `border-cyan-500 bg-secondary/90 dark:bg-[#0d173d] ${node.bgGlow} scale-[1.02]`
                      : `${node.nodeColor} hover:border-cyan-500/40 hover:-translate-y-0.5`
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="grid size-8 place-items-center rounded-xl bg-secondary border border-border/80">
                        <Icon className={`size-4 ${node.iconColor}`} />
                      </span>
                      <div>
                        <span className="font-display text-sm font-bold text-foreground block">
                          {node.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {node.role}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-500 uppercase font-bold bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {node.tag}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Detail Callout for Selected Graph Node */}
        <div className="mt-8 rounded-2xl border border-cyan-500/30 bg-secondary/40 dark:bg-card/40 p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Zap className="size-4" />
            </span>
            <div>
              <p className="text-xs font-bold text-foreground">
                {selected.label} Subsystem Active
              </p>
              <p className="text-[11px] text-muted-foreground">
                {selected.description}
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 flex items-center gap-1 shrink-0">
            <span>Continuously Updated</span>
            <CheckCircle2 className="size-3.5" />
          </span>
        </div>
      </div>
    </section>
  );
}
