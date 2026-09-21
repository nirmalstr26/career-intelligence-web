import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  FileText,
  HelpCircle,
  Layers,
  MapPin,
  MessageSquare,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  careerCode: string;
  careerTitle: string;
  studentName: string;
  department: string;
  year: number;
}

export function JourneyReveal({
  careerCode,
  careerTitle,
  studentName,
  department,
  year,
}: Props) {
  const navigate = useNavigate();

  const roadmapSteps = [
    {
      title: "YOU ARE HERE",
      subtitle: `Year ${year} ${department} Student`,
      desc: "Relevant foundational coursework & technical curiosity.",
      icon: MapPin,
      status: "current",
    },
    {
      title: "1. Baseline Assessment",
      subtitle: "3-Min Skill Pulse (Optional)",
      desc: "Quick 5-question pulse check to benchmark your starting readiness score.",
      icon: Target,
      status: "upcoming",
    },
    {
      title: "2. Foundation Mastery",
      subtitle: "Close critical core gaps",
      desc: "Targeted skill drills in SQL, Python, and system architectures.",
      icon: BookOpen,
      status: "upcoming",
    },
    {
      title: "3. Build Evidence",
      subtitle: "Production Portfolio Projects",
      desc: "Build verifiable, production-grade applications with defense reviews.",
      icon: Code2,
      status: "upcoming",
    },
    {
      title: "4. Prove Readiness",
      subtitle: "AI Mock Interviews & Defense",
      desc: "Defend your code live with SPAR AI Interviewer under realistic conditions.",
      icon: Award,
      status: "upcoming",
    },
    {
      title: "5. TARGET ROLE",
      subtitle: `Entry-Level ${careerTitle}`,
      desc: "Evidence-backed resume, verified portfolio, and direct recruiter readiness.",
      icon: Sparkles,
      status: "goal",
    },
  ];

  const validationAreas = [
    { name: "Programming Foundations", desc: "Core syntax, data structures, and algorithmic logic" },
    { name: "Database & SQL Reasoning", desc: "Query design, indexing concepts, and schema modeling" },
    { name: "System Architecture", desc: "Modular design, API patterns, and component flow" },
    { name: "Technical Communication", desc: "Explaining trade-offs and code decisions clearly" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-600">
      {/* Hero Welcome */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
          <Sparkles className="size-4" />
          <span>Active Career Direction Set</span>
        </div>
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Your {careerTitle} journey starts here.
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground leading-relaxed">
          Welcome {studentName}! You're currently a Year {year} {department} student. You already have a relevant technical foundation. SPAR will now personalize every mission, project, and interview drill around your goal of becoming a high-impact {careerTitle}.
        </p>
      </div>

      {/* Visual Roadmap Sequence */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 space-y-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Your Learning Roadmap with SPAR
        </h3>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roadmapSteps.map((step, idx) => {
            const Icon = step.icon;
            const isCurrent = step.status === "current";
            const isGoal = step.status === "goal";

            return (
              <div
                key={idx}
                className={cn(
                  "relative rounded-xl border p-4 space-y-2 transition-all",
                  isCurrent
                    ? "border-primary bg-primary/10 shadow-sm"
                    : isGoal
                      ? "border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/30"
                      : "border-border bg-background/60"
                )}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg text-xs font-bold",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isGoal
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Step {idx + 1}
                  </span>
                </div>

                <div>
                  <h4 className={cn("text-xs font-bold", isCurrent ? "text-primary" : "text-foreground")}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] font-semibold text-muted-foreground">{step.subtitle}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What we will validate first */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-primary" />
          <h3 className="font-display text-lg font-bold text-foreground">
            What we'll validate first
          </h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
          I know your direction, but I don't yet know exactly where your strengths and gaps are. You can take a fast 3-minute Skill Pulse (5 questions) anytime so I don't make you repeat concepts you already know, or dive straight into your Cockpit now!
        </p>

        <div className="grid gap-3 sm:grid-cols-2 pt-2">
          {validationAreas.map((area, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-border bg-background p-3.5"
            >
              <CheckCircle2 className="size-4 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-foreground">{area.name}</p>
                <p className="text-[11px] text-muted-foreground">{area.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col items-center justify-center gap-3 pt-4 sm:flex-row">
        <Button
          size="lg"
          onClick={() => void navigate({ to: "/app/today" })}
          className="w-full sm:w-auto gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground hover:bg-primary/90 shadow-lg"
        >
          <Sparkles className="size-4 fill-current" />
          Launch My Career Cockpit
          <ArrowRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => void navigate({ to: "/app/diagnostic" })}
          className="w-full sm:w-auto gap-2 rounded-xl text-sm font-semibold border-border hover:bg-secondary/60"
        >
          <Zap className="size-4 text-amber-500 fill-amber-500/20" />
          Take 3-Min Skill Pulse (5 Qs)
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={() => void navigate({ to: "/app/coach" })}
          className="w-full sm:w-auto gap-2 rounded-xl text-xs text-muted-foreground hover:text-foreground"
        >
          <MessageSquare className="size-4" />
          Ask SPAR about my path
        </Button>
      </div>
    </div>
  );
}
