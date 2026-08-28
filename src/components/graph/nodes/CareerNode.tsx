import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Target, Trophy, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const CareerNode = memo(({ data }: { data: any }) => {
  return (
    <div className="relative group rounded-3xl p-5 min-w-[240px] max-w-[280px] bg-gradient-to-br from-card via-card to-primary/[0.08] border-2 border-primary/50 shadow-xl shadow-primary/10 transition-all duration-300 hover:scale-[1.02] hover:border-primary">
      <Handle type="target" position={Position.Left} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-primary">
            <Trophy className="size-3.5" />
            Career Goal
          </span>
          <Badge className="bg-primary/20 text-primary border-none text-[10px] font-bold">
            {data.score || 82}% Ready
          </Badge>
        </div>

        <div>
          <h3 className="font-display font-extrabold text-base text-foreground leading-tight">
            {data.label || "Data Engineer"}
          </h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Placement Ready Target
          </p>
        </div>

        <div className="flex items-center gap-1.5 pt-1 text-[10px] text-primary/90 font-semibold">
          <Sparkles className="size-3" /> Target Destination
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary !w-3 !h-3 !border-2 !border-background" />
    </div>
  );
});

CareerNode.displayName = "CareerNode";
