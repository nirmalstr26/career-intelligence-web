import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ShieldCheck, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const EvidenceNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative rounded-2xl px-3.5 py-2.5 min-w-[170px] bg-card border border-emerald-500/40 shadow-sm transition-all duration-200 hover:scale-[1.02]">
      <Handle type="target" position={Position.Left} className="!bg-emerald-500 !w-2 !h-2" />

      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="size-2.5" />
            Evidence Proof
          </div>
          <h5 className="font-bold text-[11px] text-foreground leading-tight">
            {data.label}
          </h5>
        </div>

        {data.score && (
          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {data.score}%
          </span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="!bg-emerald-500 !w-2 !h-2" />
    </div>
  );
});

EvidenceNode.displayName = "EvidenceNode";
