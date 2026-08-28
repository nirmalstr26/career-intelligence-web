import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  Layers,
  Sparkles,
  ShieldCheck,
  Target,
  Play,
  Bot,
  Search,
  Maximize2,
  Minimize2,
  RotateCcw,
  List,
  Compass,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  GitBranch,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

import { CareerNode } from "./nodes/CareerNode";
import { PhaseNode } from "./nodes/PhaseNode";
import { SkillNode } from "./nodes/SkillNode";
import { ModuleNode } from "./nodes/ModuleNode";
import { ProjectNode } from "./nodes/ProjectNode";
import { InterviewNode } from "./nodes/InterviewNode";
import { EvidenceNode } from "./nodes/EvidenceNode";
import { SemanticEdge } from "./edges/SemanticEdge";
import { GraphIntelligencePanel } from "./GraphIntelligencePanel";
import { getLayoutedElements } from "./layout";
import { useCareerGraph, useTransferabilityAnalysis } from "@/lib/careerai/hooks";
import type { CareerGraphNode, CareerGraphResponse } from "@/lib/careerai/types";
import { TransferabilitySimulatorModal } from "@/components/graph/TransferabilitySimulatorModal";

const nodeTypes = {
  career: CareerNode,
  phase: PhaseNode,
  skill: SkillNode,
  module: ModuleNode,
  project: ProjectNode,
  interview: InterviewNode,
  evidence: EvidenceNode,
};

const edgeTypes = {
  semantic: SemanticEdge,
};

interface CareerKnowledgeGraphV2Props {
  careerCode?: string;
  onAskSpar: (prompt: string) => void;
}

const GraphInner: React.FC<CareerKnowledgeGraphV2Props> = ({
  careerCode = "DATA_ENGINEER",
  onAskSpar,
}) => {
  const [activeView, setActiveView] = useState<"JOURNEY" | "SKILLS" | "EVIDENCE" | "TARGET">("JOURNEY");
  const [isListView, setIsListView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNode, setSelectedNode] = useState<CareerGraphNode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPlayingTrace, setIsPlayingTrace] = useState(false);
  const [whatIfModalOpen, setWhatIfModalOpen] = useState(false);
  const [narrationModalOpen, setNarrationModalOpen] = useState(false);

  const graphQuery = useCareerGraph(activeView, careerCode);
  const { fitView, setCenter } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Build React Flow nodes & edges whenever query data changes
  useEffect(() => {
    if (!graphQuery.data) return;

    const rawNodes: Node[] = graphQuery.data.nodes.map((n) => {
      const isMatched = searchQuery
        ? n.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (n.display_name && n.display_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true;

      return {
        id: n.id,
        type: n.type.toLowerCase(),
        data: {
          ...n,
          isMatched,
        },
        position: { x: 0, y: 0 },
        style: {
          opacity: searchQuery && !isMatched ? 0.3 : 1,
          transition: "all 0.3s ease",
        },
      };
    });

    const rawEdges: Edge[] = graphQuery.data.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      type: "semantic",
      data: {
        type: e.type,
        label: e.label,
        explanation: e.explanation,
        is_active_path: e.is_active_path,
      },
    }));

    void getLayoutedElements(rawNodes, rawEdges, { direction: "RIGHT" }).then(({ nodes: lNodes, edges: lEdges }) => {
      setNodes(lNodes);
      setEdges(lEdges);
      setTimeout(() => fitView({ padding: 0.2, duration: 400 }), 50);
    });
  }, [graphQuery.data, searchQuery, setNodes, setEdges, fitView]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const rawData = graphQuery.data?.nodes.find((n) => n.id === node.id);
      if (rawData) {
        setSelectedNode(rawData);
      }
    },
    [graphQuery.data]
  );

  const handleFocusCurrent = useCallback(() => {
    const focusNodeId = graphQuery.data?.summary.current_focus_node_id || "module:SPARK_DISTRIBUTED";
    const target = nodes.find((n) => n.id === focusNodeId);
    if (target) {
      void setCenter(target.position.x + 100, target.position.y + 40, { zoom: 1.2, duration: 500 });
      const raw = graphQuery.data?.nodes.find((n) => n.id === focusNodeId);
      if (raw) setSelectedNode(raw);
    }
  }, [nodes, graphQuery.data, setCenter]);

  // "Show My Progress" Trace Animation
  const handlePlayProgressTrace = useCallback(async () => {
    if (isPlayingTrace || !graphQuery.data) return;
    setIsPlayingTrace(true);

    const completedNodes = graphQuery.data.nodes.filter((n) => n.status === "COMPLETED");
    const focusNode = graphQuery.data.nodes.find((n) => n.is_primary_focus || n.status === "CURRENT_FOCUS");

    const sequence = [...completedNodes, ...(focusNode ? [focusNode] : [])];

    for (const node of sequence) {
      const flowNode = nodes.find((n) => n.id === node.id);
      if (flowNode) {
        setSelectedNode(node);
        void setCenter(flowNode.position.x + 100, flowNode.position.y + 40, { zoom: 1.2, duration: 400 });
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    setIsPlayingTrace(false);
    void fitView({ padding: 0.2, duration: 500 });
  }, [isPlayingTrace, graphQuery.data, nodes, setCenter, fitView]);

  if (graphQuery.isLoading && !graphQuery.data) {
    return (
      <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-border/80 bg-card">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="size-6 animate-spin text-primary" />
          <p className="text-xs text-muted-foreground font-medium">
            Projecting Neo4j Knowledge Graph & Career Dependencies...
          </p>
        </div>
      </div>
    );
  }

  const summary = graphQuery.data?.summary || {
    career_code: careerCode,
    career_name: "Data Engineer",
    readiness_score: 82,
    node_count: nodes.length,
  };

  return (
    <div className={`relative flex flex-col rounded-3xl border border-border/80 bg-card overflow-hidden shadow-sm transition-all ${
      isFullscreen ? "fixed inset-4 z-50 rounded-2xl shadow-2xl" : "h-[680px]"
    }`}>
      {/* 1. TOP GRAPH TOOLBAR */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 bg-muted/20 px-5 py-3.5 backdrop-blur-xs shrink-0 z-10">
        {/* View Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "JOURNEY", label: "Journey Path", icon: Compass },
            { id: "SKILLS", label: "Skills Hierarchy", icon: Sparkles },
            { id: "EVIDENCE", label: "Evidence Proof", icon: ShieldCheck },
            { id: "TARGET", label: "Placement Critical Path", icon: Target },
          ].map((v) => {
            const Icon = v.icon;
            const isActive = activeView === v.id;
            return (
              <button
                key={v.id}
                onClick={() => {
                  setActiveView(v.id as any);
                  setIsListView(false);
                }}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <Icon className="size-3" />
                {v.label}
              </button>
            );
          })}
        </div>

        {/* Storytelling & Action CTAs */}
        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search skills, modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-7 w-44 rounded-full border border-border/80 bg-background pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePlayProgressTrace}
            disabled={isPlayingTrace}
            className="text-xs h-7 gap-1 font-semibold border-primary/30 text-primary hover:bg-primary/10"
          >
            <Play className={`size-3 ${isPlayingTrace ? "animate-spin" : "fill-current"}`} />
            {isPlayingTrace ? "Playing Trace..." : "Show My Progress"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setNarrationModalOpen(true)}
            className="text-xs h-7 gap-1 font-semibold"
          >
            <Bot className="size-3 text-primary" />
            Explain Map
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setWhatIfModalOpen(true)}
            className="text-xs h-7 gap-1 font-semibold bg-primary/5 hover:bg-primary/10 text-foreground border-primary/20"
          >
            <GitBranch className="size-3 text-primary" />
            What-If Switch
          </Button>

          <Button
            size="sm"
            variant={isListView ? "default" : "ghost"}
            onClick={() => setIsListView(!isListView)}
            className="text-xs h-7 gap-1"
          >
            <List className="size-3" />
            {isListView ? "Graph Mode" : "List Mode"}
          </Button>

          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="size-7 text-muted-foreground"
          >
            {isFullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
          </Button>
        </div>
      </header>

      {/* 2. GRAPH CANVAS OR ACCESSIBLE LIST MODE */}
      <div className="relative flex-1 w-full h-full bg-background overflow-hidden">
        {isListView ? (
          /* ACCESSIBLE LIST FALLBACK MODE */
          <div className="p-6 overflow-y-auto h-full space-y-4 max-w-4xl mx-auto">
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Accessible Career Journey & Competency Breakdown
                </h3>
                <p className="text-xs text-muted-foreground">
                  Complete structured list of dependencies and mastery scores.
                </p>
              </div>
              <Badge className="bg-primary/20 text-primary font-bold">
                {summary.career_name} · {summary.readiness_score}%
              </Badge>
            </div>

            <div className="grid gap-3">
              {graphQuery.data?.nodes.map((n) => (
                <div
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  className="p-4 rounded-2xl border bg-card hover:border-primary/50 cursor-pointer transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[9px] uppercase font-bold">
                        {n.type}
                      </Badge>
                      <span className="font-bold text-sm text-foreground">{n.display_name || n.label}</span>
                    </div>
                    {n.why_matters && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{n.why_matters}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {n.score !== undefined && n.score !== null && (
                      <span className="font-mono text-xs font-bold text-foreground">
                        {n.score}%
                      </span>
                    )}
                    <Badge
                      className={`text-[10px] font-bold border-none ${
                        n.status === "COMPLETED"
                          ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                          : n.is_primary_focus
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {n.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* INTERACTIVE REACT FLOW GRAPH CANVAS */
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            minZoom={0.3}
            maxZoom={1.8}
            proOptions={{ hideAttribution: true }}
            className="career-graph-canvas"
          >
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="hsl(var(--muted-foreground) / 0.18)" />
            
            {/* Custom Compact Styled Controls */}
            <div className="absolute bottom-5 left-5 z-10 flex items-center gap-1.5 rounded-2xl bg-card/90 border border-border/80 p-1 shadow-lg backdrop-blur-md">
              <Button size="sm" variant="ghost" onClick={() => fitView({ padding: 0.2, duration: 400 })} className="h-7 text-xs font-semibold px-2">
                Fit View
              </Button>
              <Button size="sm" variant="ghost" onClick={handleFocusCurrent} className="h-7 text-xs font-semibold px-2 text-primary">
                Focus Current
              </Button>
              <Button size="icon" variant="ghost" onClick={() => fitView({ padding: 0.2, duration: 300 })} className="size-7 text-muted-foreground">
                <RotateCcw className="size-3" />
              </Button>
            </div>

            {/* Minimap for desktop */}
            <MiniMap
              nodeStrokeColor="#0A66C2"
              nodeColor="hsl(var(--muted) / 0.6)"
              maskColor="hsl(var(--background) / 0.7)"
              className="!hidden lg:!block !rounded-2xl !border !border-border/80 !shadow-md !bg-card"
              style={{ width: 140, height: 90, bottom: 15, right: 15 }}
            />
          </ReactFlow>
        )}

        {/* 3. SLIDE-OUT INTELLIGENCE SIDE PANEL */}
        {selectedNode && (
          <GraphIntelligencePanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onAskSpar={onAskSpar}
          />
        )}
      </div>

      {/* EXPLAIN THIS MAP MODAL */}
      <Dialog open={narrationModalOpen} onOpenChange={setNarrationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="size-4 text-primary" />
              SPAR Career Map Story
            </DialogTitle>
            <DialogDescription className="text-xs">
              AI-synthesized explanation of your learning journey and critical path.
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 rounded-2xl bg-muted/30 border text-xs text-foreground/90 space-y-3 leading-relaxed">
            <p>
              You have solidly verified your foundational competencies in <strong>Python (88%)</strong> and <strong>SQL (92%)</strong>, backed by your Simple Data Pipeline project rubric.
            </p>
            <p className="p-3 bg-primary/10 border border-primary/30 rounded-xl text-primary font-medium">
              <strong>Your Single Bottleneck:</strong> Apache Spark & Distributed Compute (currently at 45%). Completing this module unblocks Phase 4 Workflow Orchestration and advances your readiness past 85%.
            </p>
          </div>
          <div className="flex justify-end pt-2">
            <Button size="sm" onClick={() => setNarrationModalOpen(false)} className="text-xs font-semibold">
              Got It
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* WHAT-IF SIMULATOR MODAL */}
      <TransferabilitySimulatorModal
        open={whatIfModalOpen}
        onOpenChange={setWhatIfModalOpen}
        currentCareerCode={careerCode}
        onSelectCareer={() => {}}
      />
    </div>
  );
};

export const CareerKnowledgeGraphV2: React.FC<CareerKnowledgeGraphV2Props> = (props) => {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
};
