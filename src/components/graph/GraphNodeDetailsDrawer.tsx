import React from "react";
import { Link } from "@tanstack/react-router";
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Target,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CareerGraphNode } from "@/lib/careerai/types";

interface GraphNodeDetailsDrawerProps {
  node: CareerGraphNode | null;
  onClose: () => void;
  onAskSpar: (prompt: string) => void;
}

export const GraphNodeDetailsDrawer: React.FC<GraphNodeDetailsDrawerProps> = ({
  node,
  onClose,
  onAskSpar,
}) => {
  if (!node) return null;

  const nodeType = node.type.toUpperCase();
  const isSkill = nodeType === "SKILL";
  const isModule = nodeType === "MODULE" || nodeType === "ACTION";
  const isCareer = nodeType === "CAREER";

  const getStatusBadge = () => {
    const s = (node.status || "AVAILABLE").toUpperCase();
    if (s === "VERIFIED" || s === "COMPLETED") {
      return (
        <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 gap-1.5 py-1 px-3">
          <CheckCircle2 className="w-3.5 h-3.5" /> Verified Complete
        </Badge>
      );
    }
    if (s === "CURRENT") {
      return (
        <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/40 gap-1.5 py-1 px-3 animate-pulse">
          <Target className="w-3.5 h-3.5" /> Current Focus
        </Badge>
      );
    }
    if (s === "BLOCKED" || s === "NEEDS_IMPROVEMENT" || s === "GAP") {
      return (
        <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 gap-1.5 py-1 px-3">
          <AlertTriangle className="w-3.5 h-3.5" /> Skill Gap / Blocked
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-800 text-slate-300 border-slate-700 gap-1.5 py-1 px-3">
        <Clock className="w-3.5 h-3.5" /> Next Phase
      </Badge>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-slate-900/95 backdrop-blur-xl border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              {nodeType} EXPLORER
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Title & Status */}
        <div className="mt-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-xl font-bold text-white tracking-tight">
              {node.display_name || node.label}
            </h3>
            {getStatusBadge()}
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">
            {node.metadata?.description ||
              (isSkill
                ? "Core capability required for professional mastery and technical interview defense."
                : isModule
                ? "Interactive learning unit designed to develop verified evidence on your roadmap."
                : "Target career pathway and role trajectory.")}
          </p>
        </div>

        {/* Skill Metrics */}
        {isSkill && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 font-medium">Your Score</span>
                <div className="text-2xl font-black text-white mt-0.5">
                  {node.score !== null && node.score !== undefined ? `${node.score}%` : "No Evidence"}
                </div>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-medium">Career Target</span>
                <div className="text-2xl font-black text-cyan-400 mt-0.5">
                  {node.metadata?.target_level || 80}%
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Evidence Level: {node.metadata?.verification_level || "Standard"}
              </span>
              <span>Confidence: {Math.round((node.confidence || 0.85) * 100)}%</span>
            </div>
          </div>
        )}

        {/* Module Details */}
        {isModule && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Estimated Time
              </span>
              <span className="font-semibold text-slate-200">
                {node.metadata?.estimated_minutes || 25} minutes
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> Skills Developed
              </span>
              <span className="font-semibold text-slate-200">
                {node.metadata?.skills_count || "SQL, Python"}
              </span>
            </div>
          </div>
        )}

        {/* Dependency & Unlocks Info */}
        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Why This Matters Right Now
          </h4>
          <div className="p-3.5 rounded-lg bg-slate-800/50 border border-slate-800 text-xs text-slate-300 leading-relaxed">
            {node.metadata?.why_matters ||
              `Progressing through ${node.label} directly unlocks subsequent advanced modules and addresses your highest-weight career readiness requirement.`}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-6 mt-6 border-t border-slate-800 space-y-3">
        <Button
          onClick={() =>
            onAskSpar(
              `Explain the importance of ${node.label} in my roadmap and how it affects my benchmark.`
            )
          }
          className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold gap-2 shadow-lg shadow-cyan-900/20"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          Ask SPAR About This Node
        </Button>

        {isModule ? (
          <Button
            asChild
            variant="outline"
            className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
          >
            <Link to="/app/path">
              Open in Learning Path <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        ) : isSkill ? (
          <Button
            asChild
            variant="outline"
            className="w-full border-slate-700 bg-slate-800/50 hover:bg-slate-800 text-slate-200 gap-2"
          >
            <Link to="/app/practice">
              Practice This Skill <ExternalLink className="w-4 h-4" />
            </Link>
          </Button>
        ) : null}
      </div>
    </div>
  );
};
