import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Layers, ShieldCheck, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ProjectNode = memo(({ data }: { data: any }) => {
  const isCompleted = data.status === "COMPLETED";

  return (
    <div className="relative rounded-3xl p-4 min-w-[220px] max-w-[260px] bg-gradient-to-br from-card via-card to-emerald-500/[0.05] border-2 border-emerald-500/40 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-[1.02] hover:border-emerald-500">
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-background" />

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <Layers className="size-3.5" />
            Project Artifact
          </span>
          <Badge className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none text-[9px] font-bold">
            Verified Rubric
          </Badge>
        </div>

        <div>
          <h4 className="font-bold text-xs text-foreground leading-snug">
            {data.label}
          </h4>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Grade: {data.score || 88}/100
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
          <span className="flex items-center gap-1">
            <ShieldCheck className="size-3" /> Evidence Proven
          </span>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
});

ProjectNode.displayName = "ProjectNode";
