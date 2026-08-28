import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { Bot, MessageSquare, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const InterviewNode = memo(({ data }: { data: any }) => {
  const isCompleted = data.status === "COMPLETED";

  return (
    <div className="relative rounded-2xl p-4 min-w-[200px] bg-card border border-purple-500/40 shadow-sm transition-all duration-200 hover:border-purple-500 hover:scale-[1.02]">
      <Handle type="target" position={Position.Left} className="!bg-purple-500 !w-2.5 !h-2.5" />

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
            <Bot className="size-3.5" />
            AI Mock Defense
          </span>
          <Badge className="bg-purple-500/20 text-purple-600 dark:text-purple-400 border-none text-[9px] font-bold">
            {data.score ? `${data.score}%` : "Ready"}
          </Badge>
        </div>

        <h4 className="font-bold text-xs text-foreground leading-snug">
          {data.label}
        </h4>

        <p className="text-[10px] text-muted-foreground">
          Live technical interview defense
        </p>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-purple-500 !w-2.5 !h-2.5" />
    </div>
  );
});

InterviewNode.displayName = "InterviewNode";
