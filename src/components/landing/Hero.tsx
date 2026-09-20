import React, { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import heroBgDark from "@/assets/landing/hero-bg-dark.png";
import heroBgLight from "@/assets/landing/hero-bg-light.png";
import { CareerRoadArt } from "@/components/landing/CareerRoadArt";
import { AuthCard } from "@/components/landing/AuthCard";
import { ConstellationCapabilityRoadmap } from "@/components/landing/ConstellationCapabilityRoadmap";

/**
 * Subtle, performance-safe hero parallax: translates the background layer
 * with scroll using requestAnimationFrame. SSR renders an identity transform
 * (the listener is attached in useEffect), so there is no hydration mismatch.
 */
function useHeroParallax(strength = 0.18) {
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setOffset(window.scrollY * strength);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength]);
  return offset;
}

export function Hero() {
  const parallax = useHeroParallax(0.18);

  return (
    <section className="relative isolate pt-6 pb-12 overflow-hidden">
      {/* EXPANSIVE HIGH-VISIBILITY BACKGROUND ARTWORK LAYER */}
      <div className="pointer-events-none absolute inset-0 -top-10 -bottom-14 flex items-center justify-center select-none overflow-hidden">
        <div className="relative w-full max-w-[1920px] h-full min-h-[760px] lg:min-h-[880px] flex items-center justify-center">
          {/* Theme-aware rich background imagery — z-0 so it's above the page bg but below z-10 content */}
          <div
            className="absolute inset-0 z-0 will-change-transform"
            style={{ transform: `translate3d(0, ${parallax}px, 0)` }}
          >
            {/* Light-theme background */}
            <img
              src={heroBgLight}
              alt=""
              aria-hidden="true"
              width={1536}
              height={1024}
              className="absolute inset-0 h-full w-full object-cover object-center select-none dark:hidden"
              style={{ filter: "saturate(1.05) brightness(1.02)" }}
            />
            {/* Dark-theme background */}
            <img
              src={heroBgDark}
              alt=""
              aria-hidden="true"
              width={1536}
              height={1024}
              className="absolute inset-0 hidden h-full w-full object-cover object-center select-none dark:block"
              style={{ filter: "contrast(1.16) saturate(1.32) brightness(1.02)" }}
            />

            {/* Slowly drifting luminous aura — keeps the background alive in both themes */}
            <div
              className="absolute inset-0 animate-aura-drift"
              style={{
                background:
                  "radial-gradient(ellipse 80% 70% at 50% 42%, rgba(6, 215, 247, 0.26), rgba(99, 102, 241, 0.20) 42%, rgba(168, 85, 247, 0.13) 68%, transparent 95%)",
                mixBlendMode: "screen",
              }}
            />
          </div>

          {/* Minimal seamless bottom fade into trusted colleges strip */}
          <div className="absolute bottom-0 inset-x-0 z-10 h-24 bg-gradient-to-t from-background to-transparent opacity-80" />
        </div>
      </div>

      {/* 3-Column Clean Three-Zone Composition */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.15fr_0.95fr_420px] xl:grid-cols-[1.2fr_1fr_430px] items-center gap-8 lg:gap-6 xl:gap-8">
        
        {/* LEFT COLUMN: Value Proposition + Animated Constellation Capability Roadmap */}
        <div className="space-y-6 pt-2">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-card/90 dark:bg-[#090e24]/90 px-3.5 py-1.5 text-xs text-cyan-600 dark:text-cyan-300 shadow-[0_0_15px_rgba(6,215,247,0.15)] backdrop-blur-md">
            <Sparkles className="size-3.5 text-cyan-500" />
            <span className="font-semibold text-[10px] sm:text-[11px] tracking-wider uppercase">
              AI Career Intelligence for College Students
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.8rem] font-extrabold tracking-tight text-foreground leading-[1.08] drop-shadow-sm">
            Turn ambition <br />
            into a career <br />
            <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-500 dark:to-purple-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(6,215,247,0.35)] animate-gradient-text">
              roadmap.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-foreground/85 dark:text-muted-foreground leading-relaxed max-w-lg font-medium">
            SPAR AI helps you discover the right careers, build in-demand skills, track your readiness, and get placement ready with continuous AI guidance.
          </p>

          {/* ANIMATED CONSTELLATION CAPABILITY ROADMAP */}
          <div className="pt-2">
            <ConstellationCapabilityRoadmap />
          </div>
        </div>

        {/* CENTER COLUMN: Visual Career Path */}
        <div className="flex flex-col items-center justify-center h-full pt-1">
          <CareerRoadArt />
        </div>

        {/* RIGHT COLUMN: Radiant Light Glowing Glassmorphic Auth Panel */}
        <div className="flex justify-center lg:justify-end pt-1">
          <AuthCard />
        </div>

      </div>
    </section>
  );
}
