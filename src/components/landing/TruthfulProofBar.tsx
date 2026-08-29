import React from "react";
import { Compass, ShieldCheck, Terminal, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

interface ProofMetric {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ElementType;
}

const TRUTHFUL_CAPABILITIES: ProofMetric[] = [
  {
    value: "AI Discovery",
    label: "Personalized Directions",
    sublabel: "Clarify career fit based on real strengths & interests",
    icon: Compass,
  },
  {
    value: "Verified Skills",
    label: "Evidence-Backed Progress",
    sublabel: "Diagnostic baselines & practical milestone progression",
    icon: ShieldCheck,
  },
  {
    value: "Real Projects",
    label: "Built Artifacts",
    sublabel: "Hands-on projects that prove actual execution capability",
    icon: Terminal,
  },
  {
    value: "SPAR Coach",
    label: "Context-Aware AI Guidance",
    sublabel: "Next best action calculated from your evolving profile",
    icon: Sparkles,
  },
];

export function TruthfulProofBar() {
  return (
    <section aria-label="SPAR System Capabilities" className="my-10">
      <div className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card/60 backdrop-blur-xl shadow-xl">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/60">
          {TRUTHFUL_CAPABILITIES.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`flex items-start gap-3.5 pt-4 sm:pt-0 ${idx > 0 ? "sm:pl-6" : ""}`}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,215,247,0.15)]">
                  <Icon className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-display text-sm font-bold text-foreground">
                    {item.value}
                  </span>
                  <span className="text-xs font-semibold text-cyan-400">
                    {item.label}
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                    {item.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
