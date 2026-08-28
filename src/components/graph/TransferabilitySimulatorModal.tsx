import React, { useState } from "react";
import {
  X,
  Sparkles,
  ArrowRight,
  Repeat,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTransferabilityAnalysis } from "@/lib/careerai/hooks";

interface TransferabilitySimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCareerTitle: string;
  onAskSpar: (prompt: string) => void;
}

const CANDIDATE_CAREERS = [
  { code: "AI_ML", title: "AI / Machine Learning Engineer" },
  { code: "SOFTWARE_ENGINEERING", title: "Full-Stack Software Engineer" },
  { code: "CLOUD_PLATFORM", title: "Cloud & DevOps Engineer" },
  { code: "CYBERSECURITY", title: "Cybersecurity Analyst / Engineer" },
  { code: "DATA_ANALYTICS", title: "Data Analyst & BI Specialist" },
];

export const TransferabilitySimulatorModal: React.FC<TransferabilitySimulatorModalProps> = ({
  isOpen,
  onClose,
  currentCareerTitle,
  onAskSpar,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string>("AI_ML");
  const { data: transferData, isLoading } = useTransferabilityAnalysis(selectedTarget);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Repeat className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Career What-If Simulator</h2>
              <p className="text-xs text-slate-400">
                Deterministic skill transferability & foundation reuse analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Career Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Compare Your Current Pathway ({currentCareerTitle}) With:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CANDIDATE_CAREERS.map((c) => (
              <button
                key={c.code}
                onClick={() => setSelectedTarget(c.code)}
                className={`p-3 rounded-xl text-left border text-xs font-medium transition-all ${
                  selectedTarget === c.code
                    ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-300 ring-1 ring-cyan-500/30"
                    : "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                {c.title}
              </button>
            ))}
          </div>
        </div>

        {/* Loading / Results */}
        {isLoading ? (
          <div className="p-8 text-center text-slate-400 text-sm animate-pulse">
            Analyzing graph dependencies and shared competencies…
          </div>
        ) : transferData ? (
          <div className="space-y-5">
            {/* Transferability Score Ring / Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 border border-cyan-500/30 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5" /> Transferability Index
                </span>
                <div className="text-3xl font-black text-white mt-1">
                  {transferData.transferability_percent}% Reusable Foundation
                </div>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  {transferData.reusable_modules_count} learning modules directly apply to{" "}
                  {transferData.target_career_title}.
                </p>
              </div>

              <div className="text-right">
                <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 px-3 py-1 text-xs">
                  {transferData.reusable_foundation_skills.length} Shared Skills
                </Badge>
              </div>
            </div>

            {/* Two Column Skill Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Directly Reusable Foundations
                </span>
                <ul className="space-y-1.5">
                  {transferData.reusable_foundation_skills.map((s, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> New Core Requirements
                </span>
                <ul className="space-y-1.5">
                  {transferData.new_required_skills.map((s, i) => (
                    <li
                      key={i}
                      className="text-xs text-slate-300 flex items-center gap-2 bg-slate-900/60 p-2 rounded-lg border border-slate-800/80"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* SPAR AI Recommendation */}
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/60 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> SPAR Takeaway
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {transferData.spar_takeaway}
              </p>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" onClick={onClose} className="border-slate-700 text-slate-300">
            Close
          </Button>
          <Button
            onClick={() => {
              onClose();
              onAskSpar(
                `How easily can I transition from ${currentCareerTitle} to ${selectedTarget.replace("_", " ")}?`
              );
            }}
            className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2"
          >
            <Sparkles className="w-4 h-4" /> Discuss with SPAR Coach
          </Button>
        </div>
      </div>
    </div>
  );
};
