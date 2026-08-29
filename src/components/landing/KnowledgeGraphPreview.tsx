import React, { useState } from "react";
import { Share2, Sparkles, Database, Terminal, ShieldCheck, Briefcase, Award, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GraphNode {
  id: string;
  name: string;
  category: "career" | "skill" | "project" | "evidence" | "opportunity";
  description: string;
  color: string;
  connections: string[];
}

const GRAPH_NODES: GraphNode[] = [
  {
    id: "career",
    name: "Data Engineer",
    category: "career",
    description: "Target role requiring distributed systems, streaming & ETL pipelines.",
    color: "border-cyan-400 bg-cyan-950/60 text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.3)]",
    connections: ["skill-sql", "skill-spark", "skill-python"],
  },
  {
    id: "skill-sql",
    name: "Advanced SQL",
    category: "skill",
    description: "Window functions, partitioning, query optimization & CTEs.",
    color: "border-blue-400 bg-blue-950/60 text-blue-300",
    connections: ["project-etl"],
  },
  {
    id: "skill-spark",
    name: "Apache Spark",
    category: "skill",
    description: "PySpark transformations, DAG execution & distributed shuffles.",
    color: "border-indigo-400 bg-indigo-950/60 text-indigo-300",
    connections: ["project-etl"],
  },
  {
    id: "project-etl",
    name: "Streaming Pipeline Project",
    category: "project",
    description: "Production event ingestion pipeline with automated testing & schema evolution.",
    color: "border-purple-400 bg-purple-950/60 text-purple-300 shadow-[0_0_15px_rgba(130,71,255,0.3)]",
    connections: ["evidence-score"],
  },
  {
    id: "evidence-score",
    name: "Verified Evidence (Score: 84%)",
    category: "evidence",
    description: "Code challenge pass tokens + benchmark readiness evaluation.",
    color: "border-teal-400 bg-teal-950/60 text-teal-300",
    connections: ["opp-role"],
  },
  {
    id: "opp-role",
    name: "Top Tier Opportunities",
    category: "opportunity",
    description: "Direct match against active Data Engineering role requirements.",
    color: "border-amber-400 bg-amber-950/60 text-amber-300 shadow-[0_0_15px_rgba(251,191,36,0.3)]",
    connections: [],
  },
];

export function KnowledgeGraphPreview() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(GRAPH_NODES[0]);

  return (
    <section id="knowledge-graph" className="my-16 scroll-mt-24 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
          <Share2 className="size-3.5" />
          CAREER KNOWLEDGE GRAPH
        </span>
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          See how everything{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            connects.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          SPAR models the explicit relationships between career paths, skills, curriculum, projects, and employer hiring benchmarks.
        </p>
      </div>

      {/* Visual Graph Card */}
      <div className="surface-panel rounded-3xl p-6 sm:p-8 border border-border/80 bg-card/60 backdrop-blur-xl shadow-2xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-center">
          {/* Left Column: Interactive Node Pathway */}
          <div className="relative flex flex-wrap lg:flex-nowrap items-center justify-between gap-3 p-4 rounded-2xl bg-surface/80 border border-border/60 overflow-x-auto">
            {GRAPH_NODES.map((node, idx) => (
              <React.Fragment key={node.id}>
                <button
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border px-3.5 py-3 text-center transition-all duration-200 shrink-0 ${
                    node.color
                  } ${
                    selectedNode.id === node.id
                      ? "ring-2 ring-cyan-400 scale-105"
                      : "opacity-80 hover:opacity-100 hover:scale-102"
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {node.category}
                  </span>
                  <span className="font-display text-xs font-bold mt-1 max-w-[110px] truncate">
                    {node.name}
                  </span>
                </button>

                {idx < GRAPH_NODES.length - 1 && (
                  <ArrowRight className="hidden lg:block size-4 text-muted-foreground/50 shrink-0" />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Right Column: Node Inspector */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/30 p-5 space-y-3 backdrop-blur">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-[10px] uppercase tracking-wider border-cyan-500/40 text-cyan-400 bg-cyan-950/50">
                {selectedNode.category} Node
              </Badge>
              <Sparkles className="size-4 text-cyan-400" />
            </div>

            <h3 className="font-display text-lg font-bold text-foreground">
              {selectedNode.name}
            </h3>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="border-t border-border/60 pt-3 text-[11px] text-cyan-300/90 font-medium">
              Connected across SPAR Career Intelligence Graph
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
