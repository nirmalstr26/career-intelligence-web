import ELK from "elkjs/lib/elk.bundled.js";
import { Node, Edge } from "@xyflow/react";

const elk = new ELK();

export interface LayoutOptions {
  direction?: "RIGHT" | "DOWN";
  nodeSpacing?: number;
  layerSpacing?: number;
}

export async function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  options: LayoutOptions = {}
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const isHorizontal = (options.direction || "RIGHT") === "RIGHT";

  const elkOptions = {
    "elk.algorithm": "layered",
    "elk.direction": isHorizontal ? "RIGHT" : "DOWN",
    "elk.layered.spacing.nodeNodeBetweenLayers": String(options.layerSpacing || 100),
    "elk.spacing.nodeNode": String(options.nodeSpacing || 50),
    "elk.layered.nodePlacement.strategy": "BRANDES_KOEPF",
    "elk.layered.crossingMinimization.strategy": "LAYER_SWEEP",
  };

  const graph = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((node) => {
      // Estimate dimensions based on node type
      let width = 220;
      let height = 90;

      if (node.type === "career") {
        width = 260;
        height = 110;
      } else if (node.type === "skill" || node.type === "evidence") {
        width = 190;
        height = 65;
      } else if (node.type === "project") {
        width = 240;
        height = 100;
      } else if (node.type === "phase") {
        width = 210;
        height = 80;
      }

      return {
        id: node.id,
        width,
        height,
      };
    }),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);

    const layoutedNodes = nodes.map((node) => {
      const layoutedNode = layoutedGraph.children?.find((lgNode) => lgNode.id === node.id);

      return {
        ...node,
        position: {
          x: layoutedNode?.x || 0,
          y: layoutedNode?.y || 0,
        },
      };
    });

    return { nodes: layoutedNodes, edges };
  } catch (error) {
    console.error("ELK Layout calculation failed, using fallback coordinates:", error);
    // Fallback: simple staggered row
    return {
      nodes: nodes.map((n, i) => ({
        ...n,
        position: { x: (i % 4) * 260, y: Math.floor(i / 4) * 140 },
      })),
      edges,
    };
  }
}
