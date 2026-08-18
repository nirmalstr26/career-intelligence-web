import { ArrowRight, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPreview } from "@/components/landing/AuthPreview";
import { CareerJourneyVisual } from "@/components/landing/CareerJourneyVisual";
import { FeatureHighlights } from "@/components/landing/FeatureHighlights";
import { useGoogleSignInCta } from "@/lib/auth/useGoogleSignInCta";

export function Hero() {
  const startSignIn = useGoogleSignInCta();

  return (
    <section className="relative grid items-center gap-10 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-14 lg:py-14">
      <CareerJourneyVisual />

      <div className="animate-fade-up">
        <span className="inline-flex items-center rounded-full border border-primary/40 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary sm:text-[11px]">
          AI-powered career platform for college students
        </span>

        <h1 className="mt-6 font-display text-4xl font-bold leading-[1.06] sm:text-5xl lg:text-[4rem] lg:leading-[1.05]">
          Build the career <br className="hidden sm:inline" />
          you&rsquo;re <span className="text-gradient">meant for.</span>
        </h1>

        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          AI-powered career discovery, readiness tracking, and placement guidance — all in one
          intelligent platform for college students.
        </p>

        <FeatureHighlights className="mt-8" />

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:mt-9">
          <Button variant="hero" size="pill" className="w-full sm:w-auto" onClick={startSignIn}>
            Start Your Journey
            <ArrowRight />
          </Button>
          <Button variant="outline" size="pill" className="w-full sm:w-auto">
            <Play />
            Explore Platform
          </Button>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex -space-x-2" aria-hidden="true">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="size-8 rounded-full border-2 border-background bg-secondary"
              />
            ))}
          </div>
          <div className="min-w-0">
            <span className="flex text-warning" aria-label="Rated 5 out of 5">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
              ))}
            </span>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Loved by 50K+ students across 500+ colleges
            </p>
          </div>
        </div>
      </div>

      <AuthPreview />
    </section>
  );
}
