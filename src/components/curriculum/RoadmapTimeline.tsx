import { useState } from "react";
import { CheckCircle2, ChevronDown, ChevronRight, Layers, Sparkles } from "lucide-react";

import { ModuleCard } from "@/components/curriculum/ModuleCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CurriculumTrack, CurriculumPhase, CurriculumModule } from "@/lib/careerai/types";

interface RoadmapTimelineProps {
  tracks: CurriculumTrack[];
  onStartModule?: (moduleCode: string) => void;
  isStarting?: boolean;
}

export function RoadmapTimeline({
  tracks,
  onStartModule,
  isStarting = false,
}: RoadmapTimelineProps) {
  const [activeTrackCode, setActiveTrackCode] = useState<string>("ALL");
  const [collapsedPhases, setCollapsedPhases] = useState<Record<string, boolean>>({});

  const togglePhase = (phaseCode: string) => {
    setCollapsedPhases((prev) => ({
      ...prev,
      [phaseCode]: !prev[phaseCode],
    }));
  };

  const filteredTracks =
    activeTrackCode === "ALL"
      ? tracks
      : tracks.filter((t) => t.code === activeTrackCode);

  return (
    <div className="space-y-8">
      {/* Track Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
        <Button
          variant={activeTrackCode === "ALL" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveTrackCode("ALL")}
          className="rounded-full text-xs font-semibold"
        >
          All Tracks ({tracks.length})
        </Button>
        {tracks.map((track) => {
          const totalMods = track.phases.reduce((acc, p) => acc + p.modules.length, 0);
          const completedMods = track.phases.reduce(
            (acc, p) =>
              acc +
              p.modules.filter(
                (m) => m.state === "COMPLETED" || m.state === "SKIPPED_BY_ASSESSMENT",
              ).length,
            0,
          );
          const isDone = totalMods > 0 && completedMods === totalMods;

          return (
            <Button
              key={track.code}
              variant={activeTrackCode === track.code ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTrackCode(track.code)}
              className="rounded-full text-xs font-medium gap-1.5"
            >
              {isDone ? <CheckCircle2 className="size-3.5 text-success" /> : null}
              {track.name}
              <span className="ml-1 text-[11px] text-muted-foreground">
                ({completedMods}/{totalMods})
              </span>
            </Button>
          );
        })}
      </div>

      {/* Tracks and Phases Tree */}
      <div className="space-y-12">
        {filteredTracks.map((track, trackIdx) => {
          const allModulesInTrack = track.phases.flatMap((p) => p.modules);
          const completedTrackModules = allModulesInTrack.filter(
            (m) => m.state === "COMPLETED" || m.state === "SKIPPED_BY_ASSESSMENT",
          ).length;
          const trackPct =
            allModulesInTrack.length > 0
              ? Math.round((completedTrackModules / allModulesInTrack.length) * 100)
              : 0;

          return (
            <section
              key={track.code}
              aria-label={track.name}
              className="relative rounded-3xl border border-border/70 bg-surface/40 p-6 sm:p-8 backdrop-blur"
            >
              {/* Track Header */}
              <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      T{trackIdx + 1}
                    </span>
                    <h2 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                      {track.name}
                    </h2>
                  </div>
                  {track.description ? (
                    <p className="mt-1 text-sm text-muted-foreground">{track.description}</p>
                  ) : null}
                </div>

                {/* Track Progress Indicator */}
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-right">
                    <span className="numeric text-sm font-bold">{completedTrackModules} / {allModulesInTrack.length}</span>
                    <p className="text-[11px] text-muted-foreground">Modules completed</p>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${trackPct}%` }}
                    />
                  </div>
                  <Badge variant="secondary" className="font-mono text-xs">
                    {trackPct}%
                  </Badge>
                </div>
              </div>

              {/* Phases within Track */}
              <div className="space-y-8 pl-2 sm:pl-4">
                {track.phases.map((phase, phaseIdx) => {
                  const isCollapsed = collapsedPhases[phase.code] ?? false;
                  const completedPhaseMods = phase.modules.filter(
                    (m) => m.state === "COMPLETED" || m.state === "SKIPPED_BY_ASSESSMENT",
                  ).length;
                  const isPhaseComplete =
                    phase.modules.length > 0 &&
                    completedPhaseMods === phase.modules.length;
                  const hasActiveMod = phase.modules.some(
                    (m) => m.state === "IN_PROGRESS" || m.state === "RECOMMENDED",
                  );

                  return (
                    <div
                      key={phase.code}
                      className={cn(
                        "relative rounded-2xl border bg-card/40 p-5 transition-all",
                        hasActiveMod && "border-primary/40 shadow-sm",
                        isPhaseComplete && "border-success/30 bg-success/[0.01]",
                        !hasActiveMod && !isPhaseComplete && "border-border/40",
                      )}
                    >
                      {/* Phase Header */}
                      <button
                        type="button"
                        onClick={() => togglePhase(phase.code)}
                        className="flex w-full items-center justify-between gap-4 text-left"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              isPhaseComplete
                                ? "bg-success text-success-foreground"
                                : hasActiveMod
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {isPhaseComplete ? (
                              <CheckCircle2 className="size-4" />
                            ) : (
                              `${phaseIdx + 1}`
                            )}
                          </span>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display text-base font-bold text-foreground">
                                {phase.name}
                              </h3>
                              {hasActiveMod ? (
                                <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px]">
                                  Active Phase
                                </Badge>
                              ) : null}
                            </div>
                            {phase.description ? (
                              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                {phase.description}
                              </p>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-medium text-muted-foreground">
                            {completedPhaseMods}/{phase.modules.length}
                          </span>
                          {isCollapsed ? (
                            <ChevronRight className="size-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="size-4 text-muted-foreground" />
                          )}
                        </div>
                      </button>

                      {/* Phase Module Grid */}
                      {!isCollapsed ? (
                        <div className="mt-5 grid gap-4 pt-4 border-t border-border/40 sm:grid-cols-2 lg:grid-cols-3">
                          {phase.modules.map((mod) => (
                            <ModuleCard
                              key={mod.code}
                              module={mod}
                              onStart={onStartModule}
                              isStarting={isStarting}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
