import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Compass,
  MessageSquare,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { DiscoveryChat } from "@/components/discovery/DiscoveryChat";
import { RecommendationReveal } from "@/components/discovery/RecommendationReveal";
import { JourneyReveal } from "@/components/discovery/JourneyReveal";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  useCurrentCareerDiscovery,
  useRespondCareerDiscovery,
  useSelectDiscoveryCareer,
  useStartCareerDiscovery,
} from "@/lib/careerai/hooks";

export const Route = createFileRoute("/app/discover")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const navigate = useNavigate();
  const { student, user } = useAuth();

  const { data: sessionData, isLoading, refetch } = useCurrentCareerDiscovery();
  const startDiscovery = useStartCareerDiscovery();
  const respondDiscovery = useRespondCareerDiscovery();
  const selectCareer = useSelectDiscoveryCareer();

  const [hasStartedChat, setHasStartedChat] = useState(false);

  const handleStartDiscovery = async (reset = false) => {
    setHasStartedChat(true);
    await startDiscovery.mutateAsync(reset);
  };

  const handleRespond = async (choiceCodes: string[], message?: string) => {
    if (!sessionData?.id) return;
    await respondDiscovery.mutateAsync({
      sessionId: sessionData.id,
      choiceCodes,
      message,
    });
  };

  const handleSelectCareer = async (careerCode: string) => {
    if (!sessionData?.id) return;
    await selectCareer.mutateAsync({
      sessionId: sessionData.id,
      careerCode,
    });
  };

  if (isLoading || startDiscovery.isPending) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <InlineSpinner className="size-8 text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Connecting with SPAR AI Coach…
        </p>
      </div>
    );
  }

  const session = sessionData;
  const isCompleted = session?.status === "COMPLETED";
  const hasSelectedCareer = Boolean(session?.selected_career_code);

  const selectedCareerInfo = session?.recommendations.find(
    (r) => r.career_code === session?.selected_career_code
  );

  const studentName = student?.first_name || user?.name?.split(" ")[0] || "Student";
  const deptName = (student as any)?.academic_profile?.program?.department || "Engineering";
  const yearNum = (student as any)?.academic_profile?.current_year || 1;

  // 1. Stage: Career Selected -> Journey Reveal
  if (hasSelectedCareer && session?.selected_career_code) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStartDiscovery(true)}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Explore Other Careers with SPAR
          </Button>
        </div>

        <JourneyReveal
          careerCode={session.selected_career_code}
          careerTitle={selectedCareerInfo?.career_title || session.selected_career_code}
          studentName={studentName}
          department={deptName}
          year={yearNum}
        />
      </div>
    );
  }

  // 2. Stage: Recommendations Ready -> Reveal & Compare
  if (isCompleted && session && session.recommendations.length > 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleStartDiscovery(true)}
            className="text-xs text-muted-foreground gap-1.5"
          >
            <RefreshCw className="size-3.5" />
            Restart Career Discovery
          </Button>
        </div>

        <RecommendationReveal
          sessionId={session.id}
          recommendations={session.recommendations}
          onSelectCareer={handleSelectCareer}
          onExploreOther={() => void navigate({ to: "/app/explore" })}
          isSelecting={selectCareer.isPending}
        />
      </div>
    );
  }

  // 3. Stage: Conversational Chat in Progress
  if (session && session.status === "IN_PROGRESS" && (hasStartedChat || session.turns.length > 0)) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-6">
        <DiscoveryChat
          session={session}
          onRespond={handleRespond}
          isResponding={respondDiscovery.isPending}
        />
      </div>
    );
  }

  const handleSelectDirectTrack = async (careerCode: string) => {
    try {
      let activeSession = sessionData;
      if (!activeSession?.id) {
        activeSession = await startDiscovery.mutateAsync(false);
      }
      if (activeSession?.id) {
        await selectCareer.mutateAsync({
          sessionId: activeSession.id,
          careerCode,
        });
      }
    } catch (err) {
      console.error("Failed to select track:", err);
    }
  };

  // 4. Stage: Hero Welcome & Start Discovery
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 text-center space-y-8 animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
        <Sparkles className="size-4" />
        <span>SPAR AI Career Discovery & Setup</span>
      </div>

      <div className="space-y-3">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Choose your career direction to unlock your personalized roadmap
        </h1>
        <p className="mx-auto max-w-xl text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Select a career track below to immediately personalize your curriculum and practice challenges, or chat with SPAR to discover the best fit for your strengths.
        </p>
      </div>

      {/* Quick-Pick Career Tracks */}
      <div className="grid gap-4 sm:grid-cols-3 max-w-3xl mx-auto text-left">
        <div
          onClick={() => void handleSelectDirectTrack("DATA_ENGINEER")}
          className="group relative rounded-2xl border border-primary/30 hover:border-primary bg-primary/[0.03] hover:bg-primary/[0.08] p-5 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/15 px-2 py-0.5 rounded-full inline-block">
              Data & Cloud Track
            </span>
            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Data Engineer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Build robust ETL data pipelines, SQL transformations, warehouse schemas, and distributed data systems.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-primary">
            <span>Select Data Pathway</span>
            <Zap className="size-3.5 fill-current" />
          </div>
        </div>

        <div
          onClick={() => void handleSelectDirectTrack("AI_ENGINEER")}
          className="group relative rounded-2xl border border-border hover:border-primary/60 bg-card hover:bg-primary/[0.04] p-5 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-500/15 px-2 py-0.5 rounded-full inline-block">
              AI / ML Track
            </span>
            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              AI & ML Engineer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Fine-tune models, implement LLM orchestration, evaluation pipelines, and intelligent AI agent workflows.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-muted-foreground group-hover:text-primary">
            <span>Select AI Pathway</span>
            <Zap className="size-3.5 fill-current" />
          </div>
        </div>

        <div
          onClick={() => void handleSelectDirectTrack("FULL_STACK_DEVELOPER")}
          className="group relative rounded-2xl border border-border hover:border-primary/60 bg-card hover:bg-primary/[0.04] p-5 cursor-pointer transition-all shadow-xs flex flex-col justify-between"
        >
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-500/15 px-2 py-0.5 rounded-full inline-block">
              Software Engineering
            </span>
            <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
              Full-Stack Software Engineer
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Build full-stack web applications, REST/GraphQL backend APIs, system architectures, and cloud deployments.
            </p>
          </div>
          <div className="pt-4 flex items-center justify-between text-xs font-bold text-muted-foreground group-hover:text-primary">
            <span>Select Software Pathway</span>
            <Zap className="size-3.5 fill-current" />
          </div>
        </div>
      </div>

      {/* Alternative: Chat with SPAR */}
      <div className="pt-4 max-w-xl mx-auto border-t border-border/60">
        <p className="text-xs text-muted-foreground mb-3">
          Not sure which pathway is right for you?
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            size="default"
            variant="outline"
            onClick={() => handleStartDiscovery(false)}
            className="w-full sm:w-auto gap-2 rounded-xl text-xs font-semibold"
          >
            <MessageSquare className="size-3.5 text-primary" />
            Explore with SPAR AI Coach (3 Quick Qs)
          </Button>

          <Button
            variant="ghost"
            size="default"
            onClick={() => void navigate({ to: "/app/explore" })}
            className="w-full sm:w-auto gap-2 rounded-xl text-xs text-muted-foreground"
          >
            <Compass className="size-3.5" />
            Browse All Pathways
          </Button>
        </div>
      </div>
    </div>
  );
}
