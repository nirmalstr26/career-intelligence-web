import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const SkillNode = memo(({ data }: { data: any }) => {
  const isCompleted = data.status === "COMPLETED";
  const isFocus = data.is_primary_focus || data.status === "CURRENT_FOCUS";
  const isGap = data.score && data.target_score && data.score < data.target_score;

  return (
    <div
      className={`relative rounded-2xl px-4 py-3 min-w-[180px] border transition-all duration-200 ${
        isFocus
          ? "bg-primary/[0.08] border-primary ring-2 ring-primary/40 shadow-lg shadow-primary/10"
          : isCompleted
          ? "bg-emerald-500/[0.04] border-emerald-500/30"
          : "bg-card border-border/80"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />

      <div className="flex items-center justify-between gap-2">
        <div className="space-y-0.5">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="size-2.5 text-primary" />
            Skill
          </div>
          <h4 className="font-bold text-xs text-foreground leading-tight">
            {data.label}
          </h4>
        </div>

        <Badge
          variant="outline"
          className={`text-[10px] font-mono font-bold shrink-0 ${
            isCompleted
              ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
              : isFocus
              ? "border-primary text-primary bg-primary/10"
              : "border-border text-muted-foreground"
          }`}
        >
          {data.score ? `${data.score}%` : "Required"}
        </Badge>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </div>
  );
});

SkillNode.displayName = "SkillNode";
