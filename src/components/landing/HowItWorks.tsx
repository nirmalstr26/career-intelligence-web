import React from "react";
import { Compass, ShieldAlert, BookOpen, Award, Rocket, CheckCircle2, ArrowRight } from "lucide-react";

interface StepItem {
  num: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}

const STEPS: StepItem[] = [
  {
    num: "01",
    title: "Discover",
    subtitle: "Find your direction",
    description: "SPAR AI analyzes your academic background, interests, and industry demand to recommend high-fit career paths.",
    icon: Compass,
    color: "text-cyan-400 border-cyan-500/30 bg-cyan-950/40",
    glow: "shadow-[0_0_20px_rgba(6,215,247,0.25)]",
  },
  {
    num: "02",
    title: "Assess",
    subtitle: "Understand your starting point",
    description: "Take a diagnostic baseline to measure existing proficiency, pinpoint skill gaps, and calibrate your roadmap.",
    icon: ShieldAlert,
    color: "text-blue-400 border-blue-500/30 bg-blue-950/40",
    glow: "shadow-[0_0_20px_rgba(0,140,255,0.25)]",
  },
  {
    num: "03",
    title: "Build",
    subtitle: "Learn & create real projects",
    description: "Progress through curated module curriculum and build production-grade repositories that prove hands-on mastery.",
    icon: BookOpen,
    color: "text-indigo-400 border-indigo-500/30 bg-indigo-950/40",
    glow: "shadow-[0_0_20px_rgba(70,87,255,0.25)]",
  },
  {
    num: "04",
    title: "Prove",
    subtitle: "Verify capabilities & readiness",
    description: "Complete AI mock interviews and assessments to generate verified evidence tokens and benchmark readiness scores.",
    icon: Award,
    color: "text-purple-400 border-purple-500/30 bg-purple-950/40",
    glow: "shadow-[0_0_20px_rgba(130,71,255,0.25)]",
  },
  {
    num: "05",
    title: "Prepare",
    subtitle: "Prepare for opportunities",
    description: "Use the Job Gap Optimizer to tailor your readiness to real job descriptions and interview with complete confidence.",
    icon: Rocket,
    color: "text-teal-400 border-teal-500/30 bg-teal-950/40",
    glow: "shadow-[0_0_20px_rgba(20,184,166,0.25)]",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="my-16 scroll-mt-24 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">
          METHODOLOGY
        </span>
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          How SPAR guides your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent">
            entire journey.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From the moment you start to the day you interview, every step is calculated to turn ambition into proven readiness.
        </p>
      </div>

      {/* 5-Step Connected Progression */}
      <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="surface-panel relative rounded-3xl p-6 border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/40"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-2xl font-black text-foreground/40">
                    {step.num}
                  </span>
                  <div className={`grid size-10 place-items-center rounded-2xl border ${step.color} ${step.glow}`}>
                    <Icon className="size-5" />
                  </div>
                </div>

                <h3 className="font-display text-base font-bold text-foreground">
                  {step.title}
                </h3>
                <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                  {step.subtitle}
                </p>

                <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-muted-foreground/40">
                  <ArrowRight className="size-5" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
