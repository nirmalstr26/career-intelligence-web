import React from "react";
import { ShieldCheck, Sparkles, Building2, GraduationCap, Users } from "lucide-react";

export function TrustedCollegesStrip() {
  return (
    <section aria-label="Built for students, colleges and placement teams" className="w-full mt-4 mb-12">
      <div className="mx-auto max-w-[1440px] rounded-2xl border border-border/80 dark:bg-[#090e24]/70 bg-card/90 p-4 sm:p-5 backdrop-blur-xl shadow-md transition-colors">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6">
          {/* Left Title */}
          <div className="shrink-0 flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck className="size-3.5" />
            </span>
            <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-muted-foreground">
              BUILT FOR STUDENTS, COLLEGES & PLACEMENT TEAMS
            </span>
          </div>

          {/* 4 Core Pillars */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 items-center justify-items-center w-full max-w-3xl">
            <div className="flex items-center gap-2">
              <GraduationCap className="size-4 text-cyan-500 shrink-0" />
              <span className="text-xs font-semibold text-foreground/90">Curriculum-Aligned</span>
            </div>

            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-purple-500 shrink-0" />
              <span className="text-xs font-semibold text-foreground/90">AI Adaptive Mocks</span>
            </div>

            <div className="flex items-center gap-2">
              <Building2 className="size-4 text-blue-500 shrink-0" />
              <span className="text-xs font-semibold text-foreground/90">Cohort Intelligence</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="size-4 text-emerald-500 shrink-0" />
              <span className="text-xs font-semibold text-foreground/90">Placement Ready</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
