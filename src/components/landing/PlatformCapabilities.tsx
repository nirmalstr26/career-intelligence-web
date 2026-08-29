import React from "react";
import {
  Compass,
  Map,
  Award,
  Terminal,
  MessageSquare,
  Target,
  Sparkles,
  ArrowRight,
  Layers,
} from "lucide-react";

interface CapabilityCard {
  id: string;
  icon: React.ElementType;
  title: string;
  badge: string;
  description: string;
  color: string;
  borderHover: string;
  iconBg: string;
}

const CAPABILITIES: CapabilityCard[] = [
  {
    id: "discovery",
    icon: Compass,
    title: "AI Career Discovery",
    badge: "Matching Engine",
    description: "Discover career directions aligned to your academic strengths, interests, and industry demand with SPAR AI.",
    color: "text-cyan-400",
    borderHover: "hover:border-cyan-400/50",
    iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  {
    id: "roadmap",
    icon: Map,
    title: "Personalized Roadmap",
    badge: "Adaptive Path",
    description: "Know exactly what to learn and what comes next with milestone modules, code challenges, and concept deep-dives.",
    color: "text-blue-400",
    borderHover: "hover:border-blue-400/50",
    iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    id: "readiness",
    icon: Award,
    title: "Readiness Intelligence",
    badge: "Verified Scoring",
    description: "Understand your strengths and skill gaps with benchmark readiness scores calculated from real assessment evidence.",
    color: "text-teal-400",
    borderHover: "hover:border-teal-400/50",
    iconBg: "bg-teal-500/10 text-teal-400 border-teal-500/20",
  },
  {
    id: "projects",
    icon: Terminal,
    title: "Practical Projects",
    badge: "Proof of Work",
    description: "Build production-grade projects and verifiable artifacts that demonstrate your hands-on engineering capabilities.",
    color: "text-indigo-400",
    borderHover: "hover:border-indigo-400/50",
    iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  },
  {
    id: "interviews",
    icon: MessageSquare,
    title: "Interview Preparation",
    badge: "AI Mock Practice",
    description: "Simulate technical and behavioral interviews with real-time feedback on your code reasoning, answers, and communication.",
    color: "text-purple-400",
    borderHover: "hover:border-purple-400/50",
    iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    id: "opportunities",
    icon: Target,
    title: "Job-Specific Gap Optimizer",
    badge: "Role Calibration",
    description: "Compare your current skills directly against specific job postings to pinpoint exactly what to practice before applying.",
    color: "text-amber-400",
    borderHover: "hover:border-amber-400/50",
    iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export function PlatformCapabilities() {
  return (
    <section id="capabilities" className="my-16 scroll-mt-24 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
          <Layers className="size-3.5" />
          Full-Stack Career Operating System
        </span>
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Everything you need to go from{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            curiosity to hired.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SPAR connects your career path, skills, evidence, projects, interviews, and opportunities into one continuously evolving career intelligence profile.
        </p>
      </div>

      {/* 3x2 Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAPABILITIES.map((cap) => {
          const Icon = cap.icon;
          return (
            <div
              key={cap.id}
              id={cap.id}
              className={`surface-panel group relative rounded-3xl p-6 sm:p-7 border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${cap.borderHover}`}
            >
              {/* Subtle card corner accent glow on hover */}
              <div className="pointer-events-none absolute -top-px left-8 right-8 h-px bg-gradient-to-r from-transparent via-cyan-400/0 to-transparent group-hover:via-cyan-400/40 transition-all duration-500" />

              <div className="flex items-center justify-between mb-4">
                <div className={`grid size-11 place-items-center rounded-2xl border shadow-sm transition-transform duration-300 group-hover:scale-110 ${cap.iconBg}`}>
                  <Icon className="size-5" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-secondary/80 rounded-full px-2.5 py-0.5 border border-border/60">
                  {cap.badge}
                </span>
              </div>

              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-cyan-400 transition-colors">
                {cap.title}
              </h3>

              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {cap.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Product Intelligence Statement */}
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-indigo-950/20 to-purple-950/30 p-6 sm:p-8 text-center backdrop-blur shadow-xl max-w-4xl mx-auto">
        <div className="flex justify-center mb-3">
          <span className="grid size-10 place-items-center rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,215,247,0.3)]">
            <Sparkles className="size-5" />
          </span>
        </div>
        <h4 className="font-display text-lg font-bold text-foreground sm:text-xl">
          Unified Career Intelligence Architecture
        </h4>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Unlike ordinary course platforms, SPAR connects every diagnostic quiz, code challenge, project repository, and mock interview into a single authoritative readiness profile that proves your capability to recruiters.
        </p>
      </div>
    </section>
  );
}
