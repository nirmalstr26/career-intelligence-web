import React, { useState, useRef } from "react";
import {
  Database,
  BrainCircuit,
  Code2,
  Cloud,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
  Terminal,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerPath {
  id: string;
  title: string;
  specialization: string;
  skills: string[];
  icon: React.ElementType;
  glowBorder: string;
  badgeColor: string;
  renderVisual: () => React.ReactNode;
}

const CAREERS: CareerPath[] = [
  // 1. DATA ENGINEER
  {
    id: "data_engineer",
    title: "Cloud Data Engineer",
    specialization: "Distributed Streaming & Modern Lakehouse",
    skills: ["Python", "Apache Spark", "Kafka", "SQL", "Airflow"],
    icon: Database,
    glowBorder: "hover:border-cyan-400/60 shadow-[0_0_20px_rgba(6,215,247,0.15)]",
    badgeColor: "border-cyan-400/40 bg-cyan-500/10 text-cyan-600 dark:text-cyan-300",
    renderVisual: () => (
      <div className="relative h-36 w-full rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Database className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Pipeline Architecture</span>
          </div>
          <span className="text-[9px] font-mono text-cyan-300 bg-cyan-500/20 px-2 py-0.5 rounded-full border border-cyan-400/30">
            High Fit
          </span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-300 bg-black/60 p-2 rounded-lg border border-cyan-500/20">
          <p className="text-cyan-400">Kafka ➔ Spark ➔ Delta Lake</p>
          <p className="text-emerald-400">Throughput: 1.2M events/sec</p>
        </div>
      </div>
    ),
  },

  // 2. AI / ML ENGINEER
  {
    id: "ml_engineer",
    title: "AI / ML Engineer",
    specialization: "Large Language Models & Neural Pipelines",
    skills: ["PyTorch", "Hugging Face", "FastAPI", "Vector DBs", "Docker"],
    icon: BrainCircuit,
    glowBorder: "hover:border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.15)]",
    badgeColor: "border-purple-400/40 bg-purple-500/10 text-purple-600 dark:text-purple-300",
    renderVisual: () => (
      <div className="relative h-36 w-full rounded-2xl border border-purple-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <BrainCircuit className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Neural Inference</span>
          </div>
          <span className="text-[9px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-400/30">
            Adaptive
          </span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-300 bg-black/60 p-2 rounded-lg border border-purple-500/20">
          <p className="text-purple-400">Fine-tuning Llama-3 (LoRA)</p>
          <p className="text-emerald-400">P99 Latency: 42ms | RAG Synced</p>
        </div>
      </div>
    ),
  },

  // 3. SOFTWARE ENGINEER
  {
    id: "software_engineer",
    title: "Full-Stack Software Engineer",
    specialization: "Scalable Microservices & Modern Web",
    skills: ["TypeScript", "React / Next.js", "PostgreSQL", "System Design", "Go"],
    icon: Code2,
    glowBorder: "hover:border-blue-400/60 shadow-[0_0_20px_rgba(0,140,255,0.15)]",
    badgeColor: "border-blue-400/40 bg-blue-500/10 text-blue-600 dark:text-blue-300",
    renderVisual: () => (
      <div className="relative h-36 w-full rounded-2xl border border-blue-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Code2 className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Full-Stack Architecture</span>
          </div>
          <span className="text-[9px] font-mono text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded-full border border-blue-400/30">
            Complete Path
          </span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-300 bg-black/60 p-2 rounded-lg border border-blue-500/20">
          <p className="text-blue-400">REST / GraphQL ➔ Microservices</p>
          <p className="text-emerald-400">End-to-end integration verified</p>
        </div>
      </div>
    ),
  },

  // 4. CLOUD & DEVOPS ENGINEER
  {
    id: "devops_engineer",
    title: "Cloud & DevOps Engineer",
    specialization: "Kubernetes & Infrastructure-as-Code",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Prometheus"],
    icon: Cloud,
    glowBorder: "hover:border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.15)]",
    badgeColor: "border-emerald-400/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    renderVisual: () => (
      <div className="relative h-36 w-full rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-slate-900 to-slate-950 p-3 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Cloud className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold text-white">Cloud Infrastructure</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-400/30">
            Cloud Native
          </span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-300 bg-black/60 p-2 rounded-lg border border-emerald-500/20">
          <p className="text-emerald-400">EKS Cluster ➔ GitOps Pipeline</p>
          <p className="text-cyan-400">Zero-downtime deployment active</p>
        </div>
      </div>
    ),
  },
];

export function CareerPathsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === "left" ? -380 : 380;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  return (
    <section id="careers" className="my-24 scroll-mt-24 space-y-10 select-none">
      {/* Centered Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-300 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5 text-cyan-500" />
          Career Directions
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Explore where SPAR{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)]">
            can take you.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Explore industry-aligned tech specializations with structured milestones, real-world repositories, and placement verification.
        </p>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="Previous career path"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronLeft className="size-4" />
          </button>
          <span className="text-xs text-muted-foreground font-medium">Browse Specializations</span>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="Next career path"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* HORIZONTAL CAROUSEL (3 VISIBLE ON DESKTOP) */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scrollbar-none py-4 px-4 max-w-[1440px] mx-auto snap-x snap-mandatory"
        style={{ scrollBehavior: "smooth" }}
      >
        {CAREERS.map((career) => (
          <div
            key={career.id}
            className={`snap-center shrink-0 w-[300px] sm:w-[360px] lg:w-[calc((100%-48px)/3)] rounded-3xl border border-border/80 bg-card/95 dark:bg-[#090e24]/85 p-5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between shadow-lg ${career.glowBorder}`}
          >
            <div className="space-y-3.5">
              {career.renderVisual()}

              <div className="space-y-1.5">
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider inline-block ${career.badgeColor}`}>
                  {career.specialization}
                </span>

                <h3 className="font-display text-lg font-bold text-foreground">
                  {career.title}
                </h3>
              </div>

              {/* 4-5 Key Skills */}
              <div className="space-y-1.5 pt-1 border-t border-border/50">
                <span className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider block">
                  Core Skills Covered:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {career.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-border/70 bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4 border-t border-border/50 mt-4">
              <a
                href="#signup"
                className="flex items-center justify-between text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline group"
              >
                <span>Start Diagnostic for {career.title}</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Explore All Link */}
      <div className="text-center pt-2">
        <a
          href="#signup"
          className="inline-flex items-center gap-2 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline group"
        >
          <span>Explore all specialized career pathways in SPAR</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  );
}
