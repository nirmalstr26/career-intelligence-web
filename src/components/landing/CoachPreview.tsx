import React from "react";
import { Sparkles, User, Bot, ArrowRight, CheckCircle2, Terminal, Brain, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function CoachPreview() {
  return (
    <section id="coach" className="my-16 scroll-mt-24">
      <div className="surface-panel rounded-3xl p-6 sm:p-10 border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Explanatory Copy */}
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="size-3.5" />
              Context-Aware AI Guidance
            </span>
            <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
              Meet your personal{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
                SPAR Coach.
              </span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              SPAR Coach doesn't just answer generic career questions. It inspects your active learning progression, quiz errors, code submissions, and mock interview transcripts to prescribe your next best action.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400" />
                <span>Real-time code challenge assistance & debugging guidance</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400" />
                <span>Targeted interview coaching calibrated to company job requirements</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                <CheckCircle2 className="size-4 text-cyan-400" />
                <span>Next Best Action recommendations updated after every milestone</span>
              </div>
            </div>
          </div>

          {/* Right Column: Polished Mock Interaction Container */}
          <div className="rounded-2xl border border-border/80 bg-surface/90 p-5 shadow-inner space-y-4">
            {/* Chat header */}
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 text-white shadow-[0_0_10px_rgba(6,215,247,0.3)]">
                  <Bot className="size-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">SPAR Coach</p>
                  <p className="text-[10px] text-cyan-400">Contextual Career Advisor</p>
                </div>
              </div>
              <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 bg-cyan-950/30">
                Active Session
              </Badge>
            </div>

            {/* Message 1: Student */}
            <div className="flex items-start gap-2.5 justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-blue-600 to-indigo-600 p-3 text-xs text-white shadow">
                <p>I'm interested in Data and AI, but I'm not sure which career fits me best.</p>
              </div>
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-secondary text-foreground text-xs font-semibold">
                <User className="size-3.5" />
              </div>
            </div>

            {/* Message 2: Coach */}
            <div className="flex items-start gap-2.5">
              <div className="grid size-7 shrink-0 place-items-center rounded-full bg-cyan-500/20 text-cyan-400 text-xs">
                <Sparkles className="size-3.5" />
              </div>
              <div className="space-y-3 max-w-[90%]">
                <div className="rounded-2xl rounded-tl-sm bg-card border border-border/80 p-3 text-xs text-foreground leading-relaxed shadow-sm">
                  <p>
                    Let's compare what each path actually involves and what matches the way you like to work:
                  </p>
                </div>

                {/* Micro Career Cards Comparison */}
                <div className="grid gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-cyan-500/30 bg-card/80 p-2.5 text-left">
                    <div className="flex items-center gap-1.5 text-cyan-400 mb-1">
                      <Database className="size-3.5" />
                      <span className="text-xs font-bold text-foreground">Data Engineer</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Focus on distributed pipelines, SQL, PySpark, data quality & storage.
                    </p>
                  </div>

                  <div className="rounded-xl border border-indigo-500/30 bg-card/80 p-2.5 text-left">
                    <div className="flex items-center gap-1.5 text-indigo-400 mb-1">
                      <Brain className="size-3.5" />
                      <span className="text-xs font-bold text-foreground">AI Engineer</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      Focus on ML models, embeddings, LLM orchestration, evaluation & APIs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
