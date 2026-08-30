import React, { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

interface Slide {
  image: string;
  step: string;
  title: string;
  blurb: string;
  accent: string;
}

import slideDiscovery from "@/assets/landing/outcome-discovery.png";
import slideBuild from "@/assets/landing/outcome-build.png";
import slideProjects from "@/assets/landing/outcome-projects.png";
import slideReadiness from "@/assets/landing/outcome-readiness.png";
import slidePlacement from "@/assets/landing/outcome-placement.png";

const SLIDES: Slide[] = [
  {
    image: slideDiscovery,
    step: "01",
    title: "Discover your fit",
    blurb: "AI maps your strengths to high-trajectory careers in minutes.",
    accent: "from-cyan-400/30 to-cyan-400/0",
  },
  {
    image: slideBuild,
    step: "02",
    title: "Build real skills",
    blurb: "Curated modules and production-grade projects that prove capability.",
    accent: "from-indigo-400/30 to-indigo-400/0",
  },
  {
    image: slideProjects,
    step: "03",
    title: "Prove with evidence",
    blurb: "Verified projects and placement tokens recruiters can trust.",
    accent: "from-amber-400/30 to-amber-400/0",
  },
  {
    image: slideReadiness,
    step: "04",
    title: "Track readiness",
    blurb: "Objective 6-dimensional placement scoring with live gap analysis.",
    accent: "from-purple-400/30 to-purple-400/0",
  },
  {
    image: slidePlacement,
    step: "05",
    title: "Get placed",
    blurb: "Role-specific mock interviews and targeted JD gap closure.",
    accent: "from-emerald-400/30 to-emerald-400/0",
  },
];

export function OutcomesSlider() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const goTo = useCallback((index: number) => {
    const el = trackRef.current;
    if (!el) return;
    const child = el.children[index] as HTMLElement | undefined;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
    setActive(index);
  }, []);

  const next = useCallback(() => {
    setActive((cur) => {
      const n = (cur + 1) % SLIDES.length;
      const el = trackRef.current;
      if (el) {
        const child = el.children[n] as HTMLElement | undefined;
        if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
      }
      return n;
    });
  }, []);

  const prev = () => {
    setInteracted(true);
    setActive((cur) => {
      const n = (cur - 1 + SLIDES.length) % SLIDES.length;
      const el = trackRef.current;
      if (el) {
        const child = el.children[n] as HTMLElement | undefined;
        if (child) el.scrollTo({ left: child.offsetLeft - el.offsetLeft, behavior: "smooth" });
      }
      return n;
    });
  };

  // Auto-advance
  useEffect(() => {
    if (paused || interacted) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const t = setInterval(next, 5500);
    return () => clearInterval(t);
  }, [next, paused, interacted, active]);

  // Track active index from scroll position
  const onScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    const center = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((child, i) => {
      const c = child as HTMLElement;
      const mid = c.offsetLeft - el.offsetLeft + c.clientWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!el) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - el.offsetLeft;
    scrollLeftRef.current = el.scrollLeft;
    setInteracted(true);
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const el = trackRef.current;
    if (!isDraggingRef.current || !el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeftRef.current - (x - startXRef.current) * 1.4;
  };
  const stopDrag = () => {
    isDraggingRef.current = false;
  };

  return (
    <section id="outcomes" className="my-24 scroll-mt-24 space-y-8 select-none">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 px-4">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300 shadow-sm backdrop-blur">
          <Sparkles className="size-3.5 text-purple-500" />
          The Student Journey
        </span>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
          Where SPAR{" "}
          <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)] animate-gradient-text">
            Placement Milestones.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          A guided arc from first curiosity to a signed offer — visualized as one connected, placement-ready journey.
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => setPaused((v) => !v)}
            aria-label={paused ? "Resume auto-play" : "Pause auto-play"}
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            {paused ? <Play className="size-3.5 text-cyan-500" /> : <Pause className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setInteracted(true);
              next();
            }}
            aria-label="Next slide"
            className="grid size-9 place-items-center rounded-2xl border border-border/80 bg-card/90 dark:bg-[#090e24]/90 text-muted-foreground hover:text-foreground hover:border-cyan-500/40 transition-all backdrop-blur shadow-sm"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>

      {/* Slider track */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        onMouseDown={handleMouseDown}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={handleMouseMove}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing px-4"
        style={{ scrollBehavior: "smooth" }}
      >
        {SLIDES.map((slide, i) => {
          const isActive = active === i;
          return (
            <div
              key={slide.step}
              className="snap-center shrink-0 w-full sm:w-[92%] lg:w-[88%] max-w-[1080px] mx-auto px-1"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border/80 shadow-2xl bg-slate-950">
                <img
                  src={slide.image}
                  alt={slide.title}
                  loading={i === 0 ? "eager" : "lazy"}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${
                    isActive ? "ken-burns" : "scale-100"
                  }`}
                />
                {/* Readability overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-slate-950/20" />
                <div className={`absolute inset-0 bg-gradient-to-tr ${slide.accent}`} />

                {/* Step index */}
                <span className="absolute top-5 left-5 font-mono text-5xl sm:text-6xl font-black text-white/15 select-none">
                  {slide.step}
                </span>

                {/* Caption */}
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-8">
                  <div className="max-w-xl space-y-2">
                    <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                      {slide.title}
                    </h3>
                    <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-lg">
                      {slide.blurb}
                    </p>
                    <a
                      href="#signup"
                      className="inline-flex items-center gap-2 mt-2 rounded-full bg-white/10 border border-white/25 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:translate-x-0.5"
                    >
                      Begin this step
                      <ChevronRight className="size-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 pt-1">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.step}
            type="button"
            onClick={() => {
              setInteracted(true);
              goTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              active === i
                ? "w-8 bg-gradient-to-r from-cyan-400 to-purple-500"
                : "w-2 bg-muted-foreground/40 hover:bg-muted-foreground/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
