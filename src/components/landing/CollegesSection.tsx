import React from "react";
import { Link } from "@tanstack/react-router";
import { Building2, ArrowRight, CheckCircle2, Users, BarChart3, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

export function CollegesSection() {
  return (
    <section id="colleges-section" className="my-16 scroll-mt-24">
      <div className="surface-panel rounded-3xl p-6 sm:p-10 border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
          {/* Left Column: University Value Prop */}
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Building2 className="size-3.5" />
              FOR INSTITUTIONS & PLACEMENT DIRECTORS
            </span>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Career readiness intelligence for{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                entire cohorts.
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Give placement teams real-time visibility into student readiness, skill gaps, projects, and interview preparation across departments — without compromising private student coaching conversations.
            </p>

            <div className="grid gap-3 sm:grid-cols-2 pt-2">
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                <span>Department & batch readiness distribution</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                <span>Verified project & interview completion tracking</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                <span>Custom cohort curriculum alignment</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400 shrink-0" />
                <span>Direct employer recruitment pipeline</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/colleges"
                onClick={() => trackLandingEvent("COLLEGE_CTA_CLICKED")}
                className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-[0_0_20px_rgba(6,215,247,0.35)] hover:brightness-110 transition-all gap-2"
              >
                Explore SPAR for Colleges
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Illustrative Cohort Analytics Preview */}
          <div className="rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-inner space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div>
                <p className="text-xs font-bold text-foreground">Cohort Placement Readiness</p>
                <p className="text-[10px] text-muted-foreground">Class of 2026 · Computer Science</p>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 rounded-lg px-2 py-0.5">
                Avg: 74%
              </span>
            </div>

            {/* Department Tier Distribution */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Market Ready (75%+)</span>
                <span className="font-bold text-teal-400">42% of batch</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-teal-400 rounded-full" style={{ width: "42%" }} />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">In Progress (50-74%)</span>
                <span className="font-bold text-blue-400">46% of batch</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: "46%" }} />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Foundational (&lt;50%)</span>
                <span className="font-bold text-amber-400">12% of batch</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-amber-400 rounded-full" style={{ width: "12%" }} />
              </div>
            </div>

            <div className="rounded-xl border border-border/60 bg-card/80 p-3 text-[11px] text-muted-foreground flex items-center justify-between">
              <span>Verified Project Artifacts:</span>
              <strong className="text-foreground">248 submitted</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
