import React, { memo } from "react";
import { BaseEdge, EdgeLabelRenderer, getSmoothStepPath, EdgeProps } from "@xyflow/react";

export const SemanticEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 16,
  });

  const edgeType = data?.type || "UNLOCKS";
  const isActivePath = Boolean(data?.is_active_path);

  let strokeColor = "hsl(var(--muted-foreground) / 0.4)";
  let strokeDasharray = undefined;
  let strokeWidth = 2;

  if (isActivePath) {
    strokeColor = "hsl(var(--primary))";
    strokeWidth = 2.5;
    strokeDasharray = "5,5";
  } else if (edgeType === "UNLOCKS") {
    strokeColor = "hsl(var(--primary) / 0.8)";
    strokeDasharray = "4,4";
  } else if (edgeType === "DEVELOPS") {
    strokeColor = "#06b6d4"; // cyan
  } else if (edgeType === "VERIFIED_BY") {
    strokeColor = "#10b981"; // emerald
    strokeDasharray = "3,3";
  } else if (edgeType === "BLOCKED_BY") {
    strokeColor = "#f59e0b"; // amber
    strokeDasharray = "4,4";
  } else if (edgeType === "REQUIRES") {
    strokeColor = "hsl(var(--foreground) / 0.6)";
  }

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth,
          strokeDasharray,
          animation: isActivePath || edgeType === "UNLOCKS" ? "dashdraw 1s linear infinite" : undefined,
        }}
      />

      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="rounded-full bg-background/90 px-2 py-0.5 text-[9px] font-bold text-muted-foreground border border-border/60 shadow-xs backdrop-blur-xs transition-colors hover:text-foreground hover:border-primary/50"
            title={data?.explanation || data?.label}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

SemanticEdge.displayName = "SemanticEdge";
