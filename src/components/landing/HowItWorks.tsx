import React, { useState } from "react";
import {
  Compass,
  Gauge,
  Terminal,
  Award,
  Rocket,
  Sparkles,
} from "lucide-react";
import { Reveal } from "@/components/landing/Reveal";
import imgDiscover from "@/assets/landing/outcome-discovery.png";
import imgAssess from "@/assets/landing/outcome-readiness.png";
import imgBuild from "@/assets/landing/outcome-build.png";
import imgProve from "@/assets/landing/outcome-projects.png";
import imgPrepare from "@/assets/landing/outcome-placement.png";

interface JourneyStep {
  num: string;
  title: string;
  outcome: string;
  explanation: string;
  icon: React.ElementType;
  iconColor: string;
  glow: string;
  offsetY: string;
  image: string;
  /** Floating stat overlay rendered over the image */
  stat: { label: string; value: string; tone: string };
}

const STEPS: JourneyStep[] = [
  {
    num: "01",
    title: "Discover",
    outcome: "Target High-Fit Paths",
    explanation: "AI analyzes strengths, coursework, and industry demand to recommend high-trajectory roles.",
    icon: Compass,
    iconColor: "text-cyan-400",
    glow: "border-cyan-500/40 shadow-[0_0_25px_rgba(6,215,247,0.2)]",
    offsetY: "lg:translate-y-2",
    image: imgDiscover,
    stat: { label: "Top Match", value: "94%", tone: "text-cyan-300" },
  },
  {
    num: "02",
    title: "Assess",
    outcome: "Calibrate Skill Baseline",
    explanation: "Diagnostic baselines pinpoint proficiency, identify bottlenecks, and calibrate your milestones.",
    icon: Gauge,
    iconColor: "text-blue-400",
    glow: "border-blue-500/40 shadow-[0_0_25px_rgba(0,140,255,0.2)]",
    offsetY: "lg:-translate-y-2",
    image: imgAssess,
    stat: { label: "Readiness", value: "82/100", tone: "text-blue-300" },
  },
  {
    num: "03",
    title: "Build",
    outcome: "Production Repositories",
    explanation: "Learn through curated modules and build production-grade projects that prove technical capability.",
    icon: Terminal,
    iconColor: "text-indigo-400",
    glow: "border-indigo-500/40 shadow-[0_0_25px_rgba(70,87,255,0.2)]",
    offsetY: "lg:translate-y-3",
    image: imgBuild,
    stat: { label: "Tests", value: "PASS ✓", tone: "text-emerald-300" },
  },
  {
    num: "04",
    title: "Prove",
    outcome: "Verified Evidence",
    explanation: "Complete adaptive AI mocks and technical assessments to generate verified placement tokens.",
    icon: Award,
    iconColor: "text-purple-400",
    glow: "border-purple-500/40 shadow-[0_0_25px_rgba(130,71,255,0.2)]",
    offsetY: "lg:-translate-y-1",
    image: imgProve,
    stat: { label: "Proof", value: "#SP-9042", tone: "text-purple-300" },
  },
  {
    num: "05",
    title: "Prepare",
    outcome: "Role-Specific Mocks",
    explanation: "Target open job descriptions, resolve JD gaps, and interview with verified capability confidence.",
    icon: Rocket,
    iconColor: "text-emerald-400",
    glow: "border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)]",
    offsetY: "lg:translate-y-2",
    image: imgPrepare,
    stat: { label: "JD Match", value: "88%", tone: "text-emerald-300" },
  },
];

export function HowItWorks() {
  const [activeStep, setActiveStep] = useState(2);

  return (
    <section id="how-it-works" className="my-24 scroll-mt-24 space-y-10 select-none relative">
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(circle 500px at 50% 30%, rgba(6, 215, 247, 0.08), rgba(70, 87, 255, 0.06) 45%, transparent 90%)",
        }}
      />

      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-300 shadow-sm backdrop-blur">
          <Rocket className="size-3.5 text-blue-500" />
          Placement Journey
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          How SPAR turns ambition into a{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)] animate-gradient-text">
            placement-ready journey.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          A connected 5-step milestone pathway that guides students from exploration to verified hiring readiness.
        </p>
      </div>

      {/* 5-STEP CONNECTED HORIZONTAL ROADMAP */}
      <div className="relative pt-6 pb-2">
        {/* Continuous Luminous Connector Pathway Line (Desktop) */}
        <div className="pointer-events-none absolute top-1/2 left-8 right-8 -translate-y-1/2 h-1 hidden lg:block -z-0">
          <div className="w-full h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 opacity-60 rounded-full shadow-[0_0_15px_rgba(6,215,247,0.8)]" />
        </div>

        {/* 5 Connected Milestone Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 relative z-10">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStep === idx;
            return (
              <Reveal
                key={step.num}
                delay={idx * 90}
                distance="md"
                className={`transition-all duration-300 ${step.offsetY}`}
              >
                <div
                  onMouseEnter={() => setActiveStep(idx)}
                  className={`rounded-3xl border p-4 sm:p-5 backdrop-blur-2xl transition-all duration-300 flex flex-col justify-between h-full hover:-translate-y-1.5 shadow-md overflow-hidden ${
                    isActive
                      ? `${step.glow} border-cyan-500 bg-secondary/95 dark:bg-[#0c1538]`
                      : "border-border/80 bg-card/95 dark:bg-[#090e24]/85 hover:border-cyan-500/40"
                  }`}
                >
                  <div className="space-y-3">
                    {/* Node Header: Number + Icon */}
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-cyan-500">
                        STEP {step.num}
                      </span>
                      <span className="grid size-7 place-items-center rounded-xl bg-secondary border border-border/80">
                        <Icon className={`size-3.5 ${step.iconColor}`} />
                      </span>
                    </div>

                    {/* Image-driven step visual */}
                    <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-border/60">
                      <img
                        src={step.image}
                        alt={`${step.title} illustration`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-transparent" />
                      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between font-mono text-[10px]">
                        <span className="rounded-md bg-black/45 px-1.5 py-0.5 text-slate-200 backdrop-blur-md border border-white/10">
                          {step.stat.label}
                        </span>
                        <span className={`font-bold ${step.stat.tone} drop-shadow`}>
                          {step.stat.value}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-display text-base font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-cyan-600 dark:text-cyan-400">
                        {step.outcome}
                      </p>
                    </div>

                    {/* Compact 2-Line Explanation */}
                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                      {step.explanation}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Small Glowing Destination Launch Marker */}
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-950/40 px-4 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)] backdrop-blur">
            <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Destination: Placement Ready</span>
            <Sparkles className="size-3.5 text-emerald-400" />
          </div>
        </div>
      </div>
    </section>
  );
}
