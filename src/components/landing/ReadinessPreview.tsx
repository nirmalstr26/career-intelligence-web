import React from "react";
import { Award, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillBar {
  name: string;
  score: number;
  status: "strong" | "in_progress" | "needs_focus";
}

const SAMPLE_SKILLS: SkillBar[] = [
  { name: "SQL & Data Modeling", score: 92, status: "strong" },
  { name: "Python & Distributed Computing", score: 88, status: "strong" },
  { name: "Apache Spark & PySpark", score: 45, status: "needs_focus" },
  { name: "Mock Technical Interview", score: 68, status: "in_progress" },
];

export function ReadinessPreview() {
  return (
    <section id="readiness-preview" className="my-16 scroll-mt-24 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-teal-400 flex items-center justify-center gap-1.5">
          <Award className="size-3.5" />
          BENCHMARK READINESS INTELLIGENCE
        </span>
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Know where you stand.{" "}
          <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent">
            No guessing.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SPAR shows what you're strong in, what is holding you back, and exactly what to do next to become job-ready.
        </p>
      </div>

      {/* Readiness Visual Card */}
      <div className="surface-panel rounded-3xl p-6 sm:p-10 border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl max-w-4xl mx-auto">
        <div className="grid items-center gap-8 lg:grid-cols-[240px_1fr]">
          {/* Left Column: Big Circular Readiness Score */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/30 bg-teal-950/20 p-6 text-center shadow-lg">
            <div className="relative grid size-28 place-items-center">
              <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-secondary"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-teal-400 transition-all duration-1000 ease-out"
                  strokeWidth="8"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 * (1 - 0.78)}
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="font-display text-3xl font-black text-foreground">78%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Readiness</span>
              </div>
            </div>

            <p className="mt-3 text-xs font-semibold text-foreground">
              Market Ready Threshold: 75%
            </p>
            <span className="mt-1 text-[10px] text-teal-400 font-medium flex items-center gap-1">
              <CheckCircle2 className="size-3" /> Exceeds Benchmark
            </span>
          </div>

          {/* Right Column: Skill Breakdown Bars */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="text-xs font-bold text-foreground">Core Competency Breakdown</span>
              <span className="text-[10px] text-muted-foreground italic">Example student journey: Alex Rivera (Data Engineering)</span>
            </div>

            <div className="space-y-3">
              {SAMPLE_SKILLS.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">{skill.name}</span>
                    <span className={`font-mono font-bold ${
                      skill.status === "strong" ? "text-teal-400" : skill.status === "in_progress" ? "text-blue-400" : "text-amber-400"
                    }`}>
                      {skill.score}%
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-secondary/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        skill.status === "strong"
                          ? "bg-gradient-to-r from-teal-500 to-cyan-400"
                          : skill.status === "in_progress"
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500"
                          : "bg-gradient-to-r from-amber-500 to-red-500"
                      }`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 flex items-center gap-2.5 text-xs text-amber-300">
              <AlertTriangle className="size-4 shrink-0 text-amber-400" />
              <span>
                <strong>Next Prescribed Action:</strong> Complete the <em>Apache Spark Optimization</em> challenge to boost your role fit above 85%.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
