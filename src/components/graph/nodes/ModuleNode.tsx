import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { BookOpen, CheckCircle2, Clock, Lock, Sparkles, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const ModuleNode = memo(({ data }: { data: any }) => {
  const isCompleted = data.status === "COMPLETED";
  const isPrimaryFocus = Boolean(data.is_primary_focus || data.status === "CURRENT_FOCUS");
  const isLocked = data.status === "LOCKED";
  const isAvailable = data.status === "AVAILABLE" || data.status === "ACTIVE";

  return (
    <div
      className={`relative rounded-2xl p-4 min-w-[210px] max-w-[240px] border shadow-sm transition-all duration-300 hover:scale-[1.02] ${
        isPrimaryFocus
          ? "bg-gradient-to-br from-card to-primary/[0.08] border-primary ring-2 ring-primary/50 shadow-xl shadow-primary/20"
          : isCompleted
          ? "bg-card border-emerald-500/30 hover:border-emerald-500/60"
          : isLocked
          ? "bg-muted/20 border-border/40 opacity-70"
          : "bg-card border-border/80 hover:border-primary/50"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary/80 !w-2.5 !h-2.5" />

      {/* Primary Authoritative "YOU ARE HERE" Pulse Ring */}
      {isPrimaryFocus && (
        <div className="absolute -top-3 left-4 flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[9px] font-extrabold tracking-wide text-primary-foreground shadow-md animate-pulse">
          <Sparkles className="size-2.5" />
          YOU ARE HERE
        </div>
      )}

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <BookOpen className="size-3 text-primary/80" />
            Module
          </span>

          <Badge
            variant="outline"
            className={`text-[9px] font-bold ${
              isCompleted
                ? "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                : isPrimaryFocus
                ? "border-primary text-primary bg-primary/10"
                : isLocked
                ? "border-border text-muted-foreground"
                : "border-purple-500/40 text-purple-600 bg-purple-500/5"
            }`}
          >
            {isCompleted ? "Verified" : isPrimaryFocus ? "In Progress" : isLocked ? "Locked" : "Available"}
          </Badge>
        </div>

        <div>
          <h4 className="font-bold text-xs text-foreground leading-snug line-clamp-2">
            {data.label}
          </h4>
        </div>

        <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1 border-t border-border/40">
          {data.estimated_time && (
            <span className="flex items-center gap-1">
              <Clock className="size-2.5" /> {data.estimated_time}
            </span>
          )}
          {data.score !== undefined && data.score !== null ? (
            <span className="font-mono font-bold text-foreground">
              Score: {data.score}%
            </span>
          ) : isLocked ? (
            <span className="flex items-center gap-1 text-muted-foreground">
              <Lock className="size-2.5" /> Prereqs required
            </span>
          ) : null}
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="!bg-primary/80 !w-2.5 !h-2.5" />
    </div>
  );
});

ModuleNode.displayName = "ModuleNode";
