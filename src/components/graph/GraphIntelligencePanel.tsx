import React from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  TrendingUp,
  Bot,
  Layers,
  Zap,
  Target,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNodeImpact } from "@/lib/careerai/hooks";
import type { CareerGraphNode } from "@/lib/careerai/types";

interface GraphIntelligencePanelProps {
  node: CareerGraphNode | null;
  onClose: () => void;
  onAskSpar: (prompt: string) => void;
}

export const GraphIntelligencePanel: React.FC<GraphIntelligencePanelProps> = ({
  node,
  onClose,
  onAskSpar,
}) => {
  if (!node) return null;

  const impactQuery = useNodeImpact(node.id);
  const isLocked = node.status === "LOCKED";
  const isCompleted = node.status === "COMPLETED";
  const isFocus = Boolean(node.is_primary_focus || node.status === "CURRENT_FOCUS");

  const moduleCode = node.code || (node.id.startsWith("module:") ? node.id.replace("module:", "") : null);

  return (
    <aside aria-label="Graph Node Intelligence" className="absolute right-0 top-0 bottom-0 w-full sm:w-[380px] bg-card/95 backdrop-blur-md border-l border-border/80 shadow-2xl p-6 overflow-y-auto z-20 flex flex-col justify-between animate-in slide-in-from-right-10 duration-200">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[10px] font-extrabold uppercase">
                {node.type}
              </Badge>
              <Badge
                className={`text-[10px] font-bold border-none ${
                  isCompleted
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                    : isFocus
                    ? "bg-primary/20 text-primary"
                    : isLocked
                    ? "bg-muted text-muted-foreground"
                    : "bg-purple-500/20 text-purple-600"
                }`}
              >
                {isCompleted ? "Verified & Completed" : isFocus ? "Current Learning Focus" : isLocked ? "Locked" : "Available Next"}
              </Badge>
            </div>
            <h3 className="font-display font-extrabold text-lg text-foreground leading-snug">
              {node.display_name || node.label}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Score & Gap Meter */}
        {(node.score !== undefined && node.score !== null) || node.target_score ? (
          <div className="rounded-2xl border border-border/80 bg-muted/20 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold">Proficiency Score</span>
              <span className="font-mono font-bold text-foreground">
                {node.score !== undefined && node.score !== null ? `${node.score}%` : "Not Attempted"} / {node.target_score || 80}% Target
              </span>
            </div>
            <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isCompleted ? "bg-emerald-500" : isFocus ? "bg-primary" : "bg-muted-foreground"
                }`}
                style={{ width: `${Math.min(100, (node.score || 0))}%` }}
              />
            </div>
            {node.score && node.target_score && node.score < node.target_score ? (
              <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <TrendingUp className="size-3" />
                Gap of {node.target_score - node.score} points to reach career benchmark
              </div>
            ) : null}
          </div>
        ) : null}

        {/* Why this matters */}
        {node.why_matters && (
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Why This Matters
            </span>
            <p className="text-xs text-foreground/90 leading-relaxed font-sans bg-muted/10 p-3 rounded-xl border border-border/50">
              {node.why_matters}
            </p>
          </div>
        )}

        {/* Locked Reason (Why is this locked?) */}
        {isLocked && node.why_locked && (
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.04] p-4 space-y-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Lock className="size-3.5" /> Why is this locked?
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {node.why_locked}
            </p>
          </div>
        )}

        {/* Prerequisites Audit */}
        {node.prerequisites && node.prerequisites.length > 0 && (
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Prerequisites Checklist
            </span>
            <div className="space-y-1.5">
              {node.prerequisites.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-card border text-xs"
                >
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-3.5 text-emerald-500" />
                    {p.name}
                  </span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30">
                    {p.status} ({p.score}%)
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Downstream Impact & Unlocks (from Node Impact API) */}
        {impactQuery.data && (
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Zap className="size-3.5" />
              Completing this unlocks
            </span>
            
            <div className="space-y-2">
              {impactQuery.data.direct_unlocks.map((u, i) => (
                <div key={i} className="p-2.5 rounded-xl border border-primary/30 bg-primary/[0.02] text-xs flex items-center justify-between">
                  <span className="font-semibold text-foreground">{u.title}</span>
                  <Badge className="bg-primary/20 text-primary border-none text-[9px] font-bold">Direct Unlock</Badge>
                </div>
              ))}

              <p className="text-[11px] text-muted-foreground leading-relaxed pt-1">
                {impactQuery.data.reasoning}
              </p>
            </div>
          </div>
        )}

        {/* Evidence Proof Badge */}
        {node.evidence_source && (
          <div className="p-3 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/30 text-xs space-y-1">
            <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="size-3.5" /> Provenance Evidence
            </span>
            <p className="text-[11px] text-muted-foreground font-mono">
              {node.evidence_source}
            </p>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-6 border-t border-border/60 space-y-2">
        {moduleCode && !isLocked && (
          <Button asChild className="w-full font-bold text-xs gap-1.5 shadow-md shadow-primary/20">
            <Link to="/app/learn/$moduleCode" params={{ moduleCode }}>
              {isCompleted ? "Review Learning Module" : "Start Learning Module"}
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        )}

        <Button
          variant="outline"
          onClick={() => onAskSpar(`Why is ${node.label} important for my Data Engineer path and what should I focus on?`)}
          className="w-full text-xs font-semibold gap-1.5"
        >
          <Bot className="size-3.5 text-primary" />
          Ask SPAR Coach About This
        </Button>
      </div>
    </aside>
  );
};
