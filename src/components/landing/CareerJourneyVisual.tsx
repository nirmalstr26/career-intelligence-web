import heroArt from "@/assets/hero-rocket.jpg";

/**
 * Decorative career-journey artwork behind the hero. Purely presentational —
 * hidden on smaller viewports where the focus is content + auth.
 */
export function CareerJourneyVisual() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 hidden lg:block" aria-hidden="true">
      <div
        className="absolute inset-x-0 top-0 h-[900px]"
        style={{ backgroundImage: "var(--gradient-hero-glow)" }}
      />
      <img
        src={heroArt}
        alt=""
        width={1200}
        height={1200}
        loading="lazy"
        className="absolute left-[52%] top-20 w-[560px] -translate-x-1/2 opacity-60 mix-blend-screen"
        style={{
          maskImage: "radial-gradient(closest-side, black 55%, transparent 92%)",
          WebkitMaskImage: "radial-gradient(closest-side, black 55%, transparent 92%)",
        }}
      />
    </div>
  );
}
