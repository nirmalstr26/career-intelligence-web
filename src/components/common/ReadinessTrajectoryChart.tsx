import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
} from "recharts";
import { TrendingUp, Target, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrajectoryPoint {
  date: string;
  score: number;
  label?: string;
  milestone?: string;
}

const DEFAULT_TRAJECTORY: TrajectoryPoint[] = [
  { date: "Baseline", score: 48, label: "Initial Assessment", milestone: "Diagnostic Completed" },
  { date: "Week 2", score: 55, label: "Foundations", milestone: "Tech Fundamentals Verified" },
  { date: "Week 4", score: 63, label: "SQL Ingestion", milestone: "SQL Modules Completed" },
  { date: "Week 6", score: 71, label: "Pipeline Project", milestone: "Data Pipeline Built (88/100)" },
  { date: "Today", score: 78, label: "Current Readiness", milestone: "Technical Defense (68.5/100)" },
];

export function ReadinessTrajectoryChart({
  data = DEFAULT_TRAJECTORY,
  targetScore = 85,
  className,
}: {
  data?: TrajectoryPoint[];
  targetScore?: number;
  className?: string;
}) {
  const latestScore = data[data.length - 1]?.score || 78;
  const baselineScore = data[0]?.score || 48;
  const gain = latestScore - baselineScore;

  return (
    <div className={`surface-panel rounded-3xl p-6 sm:p-7 border border-border/80 bg-card space-y-4 shadow-sm ${className || ""}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-display text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <TrendingUp className="size-5 text-primary" />
              Career Readiness Trajectory
            </span>
            <Badge className="bg-emerald-500/15 text-emerald-600 border-none font-mono font-bold text-[11px]">
              +{gain} pts since baseline
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verified capability trajectory grounded in diagnostic checks, project rubrics, and technical mock interviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2.5 rounded-full bg-primary" /> Current ({latestScore}%)
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground ml-2">
            <span className="size-2.5 rounded-full bg-emerald-500" /> Target ({targetScore}%)
          </div>
        </div>
      </div>

      <div className="h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[30, 100]}
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              ticks={[40, 60, 80, 100]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pt = payload[0].payload as TrajectoryPoint;
                  return (
                    <div className="rounded-2xl border border-border/80 bg-popover p-3 shadow-xl text-xs space-y-1">
                      <div className="font-bold text-foreground flex items-center justify-between gap-3">
                        <span>{pt.date}</span>
                        <span className="text-primary font-mono">{pt.score}%</span>
                      </div>
                      {pt.milestone && (
                        <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1">
                          <Target className="size-3 text-emerald-500" />
                          {pt.milestone}
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              y={targetScore}
              stroke="var(--success)"
              strokeDasharray="3 3"
              label={{
                value: `Placement Target (${targetScore}%)`,
                position: "top",
                fill: "var(--success)",
                fontSize: 10,
                fontWeight: 600,
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#readinessGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Milestone event strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t text-[11px]">
        {data.map((pt, i) => (
          <div key={i} className="p-2.5 rounded-xl border bg-secondary/20">
            <span className="font-mono text-muted-foreground block text-[10px] uppercase font-semibold">
              {pt.date} · {pt.score}%
            </span>
            <span className="font-semibold text-foreground truncate block mt-0.5" title={pt.milestone || pt.label}>
              {pt.milestone || pt.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
