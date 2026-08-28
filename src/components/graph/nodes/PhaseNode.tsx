import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Layers, CheckCircle2, Clock, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const PhaseNode = memo(({ data }: { data: any }) => {
  const isCompleted = data.status === "COMPLETED";
  const isLocked = data.status === "LOCKED";

  return (
    <div
      className={`relative rounded-2xl p-4 min-w-[200px] border shadow-sm transition-all duration-200 ${
        isCompleted
          ? "bg-emerald-500/[0.04] border-emerald-500/30"
          : isLocked
          ? "bg-muted/30 border-border/40 opacity-75"
          : "bg-card border-primary/30 ring-1 ring-primary/20"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary/70 !w-2.5 !h-2.5" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <Layers className="size-3" />
            {data.code || "Phase"}
          </span>
          <Badge
            variant="outline"
            className={`text-[9px] font-bold ${
              isCompleted
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                : isLocked
                ? "border-border text-muted-foreground"
                : "border-primary text-primary"
            }`}
          >
            {isCompleted ? "100% Done" : isLocked ? "Locked" : `${data.score || 45}%`}
          </Badge>
        </div>

        <h4 className="font-bold text-xs text-foreground leading-snug">
          {data.label}
        </h4>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary/70 !w-2.5 !h-2.5" />
    </div>
  );
});

PhaseNode.displayName = "PhaseNode";
