import React, { useState } from "react";
import {
  Map,
  GitBranch,
  ShieldCheck,
  Sparkles,
  Repeat,
  CheckCircle2,
  Lock,
  Target,
  AlertTriangle,
  Info,
  ChevronRight,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraphNodeDetailsDrawer } from "./GraphNodeDetailsDrawer";
import { TransferabilitySimulatorModal } from "./TransferabilitySimulatorModal";
import type { CareerGraphNode, CareerGraphViewMode } from "@/lib/careerai/types";

interface CareerKnowledgeGraphProps {
  careerTitle: string;
  careerCode: string;
  onAskSpar: (prompt: string) => void;
}

// Canonical bounded graph data nodes for progressive disclosure
const JOURNEY_NODES: CareerGraphNode[] = [
  {
    id: "phase:1",
    type: "PHASE",
    label: "Phase 1: Foundations",
    display_name: "Phase 1: Technical Foundations",
    status: "COMPLETED",
    score: 88,
    metadata: { description: "Core programming and database primitives." },
  },
  {
    id: "module:sql_101",
    type: "MODULE",
    label: "SQL Fundamentals",
    display_name: "SQL & Relational Querying",
    status: "COMPLETED",
    score: 92,
    metadata: { estimated_minutes: 25, skills_count: "SQL, Aggregations" },
  },
  {
    id: "module:py_101",
    type: "MODULE",
    label: "Python for Data",
    display_name: "Python & Data Structures",
    status: "COMPLETED",
    score: 85,
    metadata: { estimated_minutes: 30, skills_count: "Python, OOP" },
  },
  {
    id: "phase:2",
    type: "PHASE",
    label: "Phase 2: Core Engineering",
    display_name: "Phase 2: Core Data Engineering",
    status: "CURRENT",
    score: 65,
    metadata: { description: "Data warehousing, ETL pipelines, and distributed processing." },
  },
  {
    id: "module:spark_201",
    type: "MODULE",
    label: "Apache Spark & PySpark",
    display_name: "Distributed Computing with Spark",
    status: "CURRENT",
    score: 45,
    metadata: {
      estimated_minutes: 40,
      skills_count: "PySpark, RDDs, DataFrames",
      why_matters: "Largest current skill gap on your Data Engineer pathway.",
    },
  },
  {
    id: "module:dbt_201",
    type: "MODULE",
    label: "dbt & Data Modeling",
    display_name: "Modern Data Transformations",
    status: "AVAILABLE",
    score: null,
    metadata: { estimated_minutes: 35, skills_count: "dbt, SQL Models, Star Schema" },
  },
  {
    id: "phase:3",
    type: "PHASE",
    label: "Phase 3: Production & Defense",
    display_name: "Phase 3: Production Systems & Interview Defense",
    status: "FUTURE",
    score: null,
    metadata: { description: "End-to-end portfolio project and technical interview defense." },
  },
  {
    id: "project:de_capstone",
    type: "PROJECT",
    label: "Lakehouse Pipeline Capstone",
    display_name: "Real-time Lakehouse ETL Pipeline",
    status: "LOCKED",
    score: null,
    metadata: { description: "Production project demonstrating end-to-end data pipeline mastery." },
  },
];

const SKILL_NODES: CareerGraphNode[] = [
  {
    id: "skill:sql",
    type: "SKILL",
    label: "SQL & Querying",
    display_name: "SQL & Query Optimization",
    status: "VERIFIED",
    score: 92,
    confidence: 0.95,
    metadata: { target_level: 80, verification_level: "High", why_matters: "Exceeds Top 20% benchmark" },
  },
  {
    id: "skill:python",
    type: "SKILL",
    label: "Python Programming",
    display_name: "Python & Data Engineering",
    status: "VERIFIED",
    score: 88,
    confidence: 0.92,
    metadata: { target_level: 80, verification_level: "High", why_matters: "Core programming foundation" },
  },
  {
    id: "skill:spark",
    type: "SKILL",
    label: "Distributed Spark",
    display_name: "Apache Spark & Distributed ETL",
    status: "NEEDS_IMPROVEMENT",
    score: 45,
    confidence: 0.82,
    metadata: { target_level: 75, verification_level: "Developing", why_matters: "Critical bottleneck for Phase 2 progression" },
  },
  {
    id: "skill:data_modeling",
    type: "SKILL",
    label: "Data Modeling",
    display_name: "Dimensional & Star Schema Modeling",
    status: "AVAILABLE",
    score: 60,
    confidence: 0.75,
    metadata: { target_level: 75, verification_level: "Moderate", why_matters: "Required for analytics warehouse design" },
  },
  {
    id: "skill:orchestration",
    type: "SKILL",
    label: "Workflow Orchestration",
    display_name: "Airflow & Pipeline Orchestration",
    status: "FUTURE",
    score: null,
    confidence: 0.0,
    metadata: { target_level: 70, verification_level: "None", why_matters: "Unlocks in Phase 3" },
  },
];

export const CareerKnowledgeGraph: React.FC<CareerKnowledgeGraphProps> = ({
  careerTitle,
  careerCode,
  onAskSpar,
}) => {
  const [viewMode, setViewMode] = useState<CareerGraphViewMode>("journey");
  const [selectedNode, setSelectedNode] = useState<CareerGraphNode | null>(null);
  const [simulatorOpen, setSimulatorOpen] = useState<boolean>(false);

  const currentNodes = viewMode === "journey" ? JOURNEY_NODES : SKILL_NODES;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-md p-6 space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-400">
              CAREER KNOWLEDGE GRAPH
            </span>
            <Badge className="bg-cyan-500/10 text-cyan-300 border-cyan-500/30 text-[10px]">
              Active Pathway: {careerTitle}
            </Badge>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Interactive Dependency & Journey Map</h2>
          <p className="text-xs text-slate-400">
            Explore verified competencies, blockers, and progressive milestones.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setSimulatorOpen(true)}
            variant="outline"
            size="sm"
            className="border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold gap-1.5"
          >
            <Repeat className="w-3.5 h-3.5" /> What-If Simulator
          </Button>

          <Button
            onClick={() => onAskSpar(`Analyze my current ${careerTitle} graph and tell me what is blocking me most.`)}
            size="sm"
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold gap-1.5 shadow-lg shadow-cyan-900/20"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" /> Ask SPAR
          </Button>
        </div>
      </div>

      {/* View Selector Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-950/60 border border-slate-800/80 rounded-xl w-fit">
        <button
          onClick={() => setViewMode("journey")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "journey"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Map className="w-3.5 h-3.5" /> Journey Map
        </button>
        <button
          onClick={() => setViewMode("skills")}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            viewMode === "skills"
              ? "bg-cyan-600 text-white shadow-md shadow-cyan-900/30"
              : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" /> Skill Dependencies
        </button>
      </div>

      {/* Graph Visual Canvas */}
      <div className="relative p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 min-h-[340px] flex flex-col justify-center overflow-x-auto">
        <div className="flex items-center justify-between min-w-[600px] gap-4 relative">
          {currentNodes.map((node, index) => {
            const isSelected = selectedNode?.id === node.id;
            const isCurrent = node.status === "CURRENT";
            const isCompleted = node.status === "COMPLETED" || node.status === "VERIFIED";
            const isBlocked = node.status === "NEEDS_IMPROVEMENT" || node.status === "GAP";

            return (
              <React.Fragment key={node.id}>
                {/* Node Card */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 w-44 flex flex-col justify-between ${
                    isSelected
                      ? "ring-2 ring-cyan-400 border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-900/30 -translate-y-1"
                      : isCurrent
                      ? "border-cyan-500/60 bg-slate-900/90 shadow-md shadow-cyan-950/40"
                      : isCompleted
                      ? "border-emerald-500/40 bg-slate-900/70 hover:border-emerald-500/80"
                      : isBlocked
                      ? "border-amber-500/40 bg-slate-900/70 hover:border-amber-500/80"
                      : "border-slate-800 bg-slate-950/50 hover:border-slate-700 opacity-70"
                  }`}
                >
                  {/* You Are Here Indicator */}
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-cyan-500 text-[10px] font-black text-slate-950 shadow-md flex items-center gap-1 animate-bounce">
                      <Target className="w-3 h-3" /> YOU ARE HERE
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>{node.type}</span>
                      {isCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : isBlocked ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                      ) : isCurrent ? (
                        <Target className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-slate-600" />
                      )}
                    </div>

                    <h4 className="text-xs font-bold text-slate-200 mt-2 line-clamp-2">
                      {node.display_name || node.label}
                    </h4>
                  </div>

                  <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-medium">Score</span>
                    <span
                      className={`font-black ${
                        node.score && node.score >= 80
                          ? "text-emerald-400"
                          : node.score
                          ? "text-cyan-400"
                          : "text-slate-500"
                      }`}
                    >
                      {node.score !== null && node.score !== undefined ? `${node.score}%` : "—"}
                    </span>
                  </div>
                </div>

                {/* Connector Arrow */}
                {index < currentNodes.length - 1 && (
                  <div className="flex items-center text-slate-600">
                    <div className="w-6 h-0.5 bg-slate-800" />
                    <ChevronRight className="w-4 h-4 -ml-1 text-slate-700" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Legend & Instructions */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Verified Complete
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" /> Current Target
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Blocking Gap
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Click any node to inspect detailed evidence, unlocks, and SPAR reasoning.
        </span>
      </div>

      {/* Node Details Slide-over Drawer */}
      <GraphNodeDetailsDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        onAskSpar={onAskSpar}
      />

      {/* Career What-If Simulator Modal */}
      <TransferabilitySimulatorModal
        isOpen={simulatorOpen}
        onClose={() => setSimulatorOpen(false)}
        currentCareerTitle={careerTitle}
        onAskSpar={onAskSpar}
      />
    </div>
  );
};
