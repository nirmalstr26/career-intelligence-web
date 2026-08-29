import React, { useState } from "react";
import {
  Compass,
  Gauge,
  BookOpen,
  Award,
  Rocket,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Terminal,
  Target,
  Bot,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface JourneyStep {
  num: string;
  stage: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  glow: string;
  badgeBg: string;
  offsetY: string; // Dynamic vertical offset for desktop roadmap flow
  renderMicroVisual: () => React.ReactNode;
}

const STEPS: JourneyStep[] = [
  {
    num: "01",
    stage: "DISCOVER",
    title: "Discover",
    subtitle: "Find your direction",
    description: "SPAR AI analyzes your coursework, interests, and industry demand to recommend high-fit career paths.",
    icon: Compass,
    color: "text-cyan-400",
    glow: "border-cyan-500/40 bg-cyan-950/40 shadow-[0_0_25px_rgba(6,215,247,0.25)]",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-400/30",
    offsetY: "lg:translate-y-2",
    renderMicroVisual: () => (
      <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/30 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-white">Top Match: 94%</span>
          <span className="text-cyan-400 font-mono">Cloud Data</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#090e24] overflow-hidden">
          <div className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 w-[94%]" />
        </div>
      </div>
    ),
  },
  {
    num: "02",
    stage: "ASSESS",
    title: "Assess",
    subtitle: "Understand your baseline",
    description: "Take a diagnostic baseline to measure existing proficiency, pinpoint skill gaps, and calibrate your roadmap.",
    icon: Gauge,
    color: "text-blue-400",
    glow: "border-blue-500/40 bg-blue-950/40 shadow-[0_0_25px_rgba(0,140,255,0.25)]",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-400/30",
    offsetY: "lg:-translate-y-3",
    renderMicroVisual: () => (
      <div className="rounded-xl border border-blue-500/30 bg-blue-950/30 p-2.5 space-y-1 text-center">
        <span className="text-[9px] uppercase font-bold text-muted-foreground block">Readiness Meter</span>
        <span className="font-display text-base font-extrabold text-white">82<span className="text-[9px] text-blue-400">/100</span></span>
        <span className="text-[9px] text-blue-300 block font-semibold">+14 pts baseline</span>
      </div>
    ),
  },
  {
    num: "03",
    stage: "BUILD",
    title: "Build",
    subtitle: "Learn & create real projects",
    description: "Progress through curated module curriculum and build production-grade repositories that prove hands-on mastery.",
    icon: Terminal,
    color: "text-indigo-400",
    glow: "border-indigo-500/40 bg-indigo-950/40 shadow-[0_0_25px_rgba(70,87,255,0.25)]",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-400/30",
    offsetY: "lg:translate-y-4",
    renderMicroVisual: () => (
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/30 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-white truncate">event-stream-engine</span>
          <span className="text-emerald-400 font-bold">98.4%</span>
        </div>
        <span className="text-[9px] text-indigo-300 font-mono block">Automated Tests Passed ✓</span>
      </div>
    ),
  },
  {
    num: "04",
    stage: "PROVE",
    title: "Prove",
    subtitle: "Verify capabilities & readiness",
    description: "Complete AI mock interviews and assessments to generate verified evidence tokens and benchmark readiness scores.",
    icon: Award,
    color: "text-purple-400",
    glow: "border-purple-500/40 bg-purple-950/40 shadow-[0_0_25px_rgba(130,71,255,0.25)]",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-400/30",
    offsetY: "lg:-translate-y-2",
    renderMicroVisual: () => (
      <div className="rounded-xl border border-purple-500/30 bg-purple-950/30 p-2.5 space-y-1 text-center">
        <div className="flex items-center justify-center gap-1 text-[10px] text-purple-300 font-bold">
          <ShieldCheck className="size-3 text-cyan-400" />
          <span>SPAR Verified</span>
        </div>
        <span className="text-[9px] text-muted-foreground block">Proof Token #SP-9042</span>
      </div>
    ),
  },
  {
    num: "05",
    stage: "PREPARE",
    title: "Prepare",
    subtitle: "Prepare for opportunities",
    description: "Use the Job Gap Optimizer to tailor your readiness to real job descriptions and interview with complete confidence.",
    icon: Target,
    color: "text-teal-400",
    glow: "border-teal-500/40 bg-teal-950/40 shadow-[0_0_25px_rgba(20,184,166,0.25)]",
    badgeBg: "bg-teal-500/20 text-teal-300 border-teal-400/30",
    offsetY: "lg:translate-y-3",
    renderMicroVisual: () => (
      <div className="rounded-xl border border-teal-500/30 bg-teal-950/30 p-2.5 space-y-1.5">
        <div className="flex items-center justify-between text-[10px]">
          <span className="font-bold text-white">Google Cloud Drive</span>
          <span className="text-emerald-400 font-bold">87%</span>
        </div>
        <span className="text-[9px] text-teal-300 font-bold block">1-Click Drill Ready ⚡</span>
      </div>
    ),
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState<number>(0);

  return (
    <section id="how-it-works" className="my-24 scroll-mt-24 space-y-12 select-none relative">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(circle 480px at 50% 60%, rgba(6, 215, 247, 0.12), rgba(70, 87, 255, 0.08) 45%, transparent 90%)",
        }}
      />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 shadow-[0_0_15px_rgba(0,140,255,0.25)] backdrop-blur">
          <Rocket className="size-3.5 text-blue-400" />
          Methodology
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
          How SPAR turns ambition into a{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            placement-ready journey.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          From direction discovery to interview preparation, every stage is structured to help students build real capability with confidence.
        </p>
      </div>

      {/* 5-STEP HORIZONTAL GUIDED ROADMAP WITH GLOWING CONNECTOR LINE */}
      <div className="relative pt-6 pb-2">
        {/* Continuous Luminous Connector Pathway Line (Desktop) */}
        <div className="pointer-events-none absolute top-1/2 left-10 right-10 -translate-y-1/2 h-1 hidden lg:block -z-0">
          <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-60 rounded-full shadow-[0_0_15px_rgba(6,215,247,0.8)]" />
        </div>

        {/* 5 Connected Milestone Nodes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-5 relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <div
                key={step.num}
                onMouseEnter={() => setActiveStep(idx)}
                className={`transition-all duration-300 ${step.offsetY}`}
              >
                <div
                  className={`rounded-3xl border p-5 sm:p-6 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-2 hover:shadow-2xl ${
                    isActive
                      ? `${step.glow} border-cyan-400 scale-102`
                      : "border-border/80 bg-[#090e24]/85 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="space-y-4">
                    {/* Node Header: Number + Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-extrabold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 rounded-full px-2.5 py-0.5">
                        STEP {step.num}
                      </span>
                      <div className={`grid size-10 place-items-center rounded-2xl border ${step.badgeBg} shadow-sm`}>
                        <Icon className="size-5" />
                      </div>
                    </div>

                    {/* Milestone Title & Subtitle */}
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs font-semibold text-cyan-300 mt-0.5">
                        {step.subtitle}
                      </p>
                    </div>

                    {/* Micro Visual Preview */}
                    {step.renderMicroVisual()}

                    {/* Description */}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Bottom Stage Pill */}
                  <div className="pt-4 border-t border-border/40 mt-4 flex items-center justify-between text-[10px] text-muted-foreground">
                    <span className="font-bold text-white/80">{step.stage}</span>
                    <span className="text-cyan-400 flex items-center gap-1 font-semibold">
                      Milestone {idx + 1} <ChevronRight className="size-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PLACEMENT READY DESTINATION PORTAL CARD */}
      <div className="mt-8 rounded-3xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-[#0d1436] to-purple-950/40 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="relative grid size-14 place-items-center rounded-2xl bg-gradient-to-tr from-cyan-500/30 to-purple-600/30 border border-cyan-400/50 shadow-[0_0_20px_rgba(6,215,247,0.5)] shrink-0">
            <img
              src="/brand/icon/spar-ai-icon-64.png"
              alt="SPAR AI Destination"
              className="size-8 object-contain drop-shadow"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-base sm:text-lg font-bold text-white">
                Destination: Placement Ready & Verified
              </h4>
              <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                100% Proven
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">
              Upon completing your calibrated journey, unlock recruiter-shareable proof badges, verified GitHub project artifacts, and interview coaching defense records.
            </p>
          </div>
        </div>

        <a
          href="#auth-card"
          className="shrink-0 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] hover:brightness-110 transition-all flex items-center gap-2"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
