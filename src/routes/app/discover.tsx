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
  const { session: authSession } = useAuth();
  const student = authSession?.student ?? null;

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

  const studentName = student?.first_name || "Student";
  const deptName = student?.academic_profile?.program?.department || "Engineering";
  const yearNum = student?.academic_profile?.current_year || 1;

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

  // 4. Stage: Hero Welcome & Start Discovery
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 text-center space-y-8 animate-in fade-in duration-300">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
        <Sparkles className="size-4" />
        <span>SPAR AI Career Discovery</span>
      </div>

      <div className="space-y-4">
        <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Let's figure out where you could thrive.
        </h1>
        <p className="mx-auto max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          I'll ask you a few questions about what you enjoy, how you like to solve problems, and what kind of work excites you. Then I'll show you career paths worth exploring.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 max-w-2xl mx-auto text-left">
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            1. Short Chat
          </span>
          <h4 className="text-xs font-bold text-foreground">4–5 Quick Questions</h4>
          <p className="text-[11px] text-muted-foreground">
            No exams or grades — just what you enjoy solving.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            2. Match Analysis
          </span>
          <h4 className="text-xs font-bold text-foreground">Top 3 Career Paths</h4>
          <p className="text-[11px] text-muted-foreground">
            Detailed why-it-fits explanations and challenges.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
            3. Roadmap
          </span>
          <h4 className="text-xs font-bold text-foreground">Personalized Journey</h4>
          <p className="text-[11px] text-muted-foreground">
            Tailored learning missions and mock interviews.
          </p>
        </div>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button
          size="lg"
          onClick={() => handleStartDiscovery(false)}
          className="w-full sm:w-auto gap-2 rounded-xl bg-primary px-8 text-sm font-semibold text-primary-foreground hover:bg-primary/90 shadow-md"
        >
          <Zap className="size-4 fill-current" />
          Start with SPAR
        </Button>

        <Button
          variant="outline"
          size="lg"
          onClick={() => void navigate({ to: "/app/explore" })}
          className="w-full sm:w-auto gap-2 rounded-xl text-sm"
        >
          <Compass className="size-4" />
          Explore Careers Manually
        </Button>
      </div>
    </div>
  );
}
