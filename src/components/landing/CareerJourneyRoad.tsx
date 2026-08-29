import React, { useEffect, useState } from "react";
import { Sparkles, Compass, CheckCircle2, Award, Briefcase, Terminal, ArrowUpRight } from "lucide-react";

export function CareerJourneyRoad() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Background Hero Glows */}
      <div
        className="absolute inset-0 opacity-40 mix-blend-screen"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 30%, rgba(6, 215, 247, 0.15), rgba(70, 87, 255, 0.08) 50%, transparent 80%)",
        }}
      />
      <div
        className="absolute -top-40 right-1/4 size-[500px] rounded-full blur-[140px] opacity-20 bg-gradient-to-br from-cyan-400 to-indigo-600"
      />

      {/* Luminous Pathway SVG */}
      <div className="relative w-full max-w-[900px] h-[750px] opacity-90 transition-opacity duration-1000 ease-out">
        <svg
          viewBox="0 0 900 750"
          className="size-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Main Road Gradients */}
            <linearGradient id="roadGlow" x1="450" y1="750" x2="450" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06D7F7" stopOpacity="0.05" />
              <stop offset="35%" stopColor="#008CFF" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#4657FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#8247FF" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="roadCore" x1="450" y1="750" x2="450" y2="80" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06D7F7" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#008CFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="1" />
            </linearGradient>

            {/* Target Halo Radial Gradient */}
            <radialGradient id="targetGlow" cx="450" cy="80" r="100" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8247FF" stopOpacity="0.6" />
              <stop offset="40%" stopColor="#4657FF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="transparent" stopOpacity="0" />
            </radialGradient>

            {/* Pulsing Light Filter */}
            <filter id="neonBlur" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Skill Graph Connection Lines */}
          <g className="opacity-25" stroke="currentColor" strokeWidth="1" strokeDasharray="3 4">
            <line x1="220" y1="520" x2="380" y2="460" className="text-cyan-400" />
            <line x1="680" y1="480" x2="520" y2="400" className="text-indigo-400" />
            <line x1="310" y1="360" x2="450" y2="280" className="text-blue-400" />
            <line x1="590" y1="260" x2="450" y2="180" className="text-purple-400" />
          </g>

          {/* Background Knowledge Graph Floating Nodes */}
          <g className="opacity-40">
            <circle cx="220" cy="520" r="4" fill="#06D7F7" />
            <circle cx="680" cy="480" r="4" fill="#4657FF" />
            <circle cx="310" cy="360" r="5" fill="#008CFF" />
            <circle cx="590" cy="260" r="5" fill="#8247FF" />
          </g>

          {/* Wide Perspective Road Base (Glow) */}
          <path
            d="M 450 720 C 450 600, 360 480, 390 360 C 420 240, 450 160, 450 90"
            stroke="url(#roadGlow)"
            strokeWidth="38"
            strokeLinecap="round"
            filter="url(#neonBlur)"
            className="opacity-70"
          />

          {/* Main Road Track */}
          <path
            d="M 450 720 C 450 600, 360 480, 390 360 C 420 240, 450 160, 450 90"
            stroke="url(#roadCore)"
            strokeWidth="6"
            strokeLinecap="round"
          />

          {/* Secondary Parallel Light Trails */}
          <path
            d="M 436 720 C 436 600, 346 480, 376 360 C 406 240, 436 160, 442 90"
            stroke="#06D7F7"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="opacity-40"
          />
          <path
            d="M 464 720 C 464 600, 374 480, 404 360 C 434 240, 464 160, 458 90"
            stroke="#8247FF"
            strokeWidth="1.5"
            strokeDasharray="6 8"
            className="opacity-40"
          />

          {/* Road Destination Glow & Pulse */}
          <circle cx="450" cy="80" r="80" fill="url(#targetGlow)" />
          <circle cx="450" cy="80" r="22" className="fill-purple-900/60 stroke-purple-400" strokeWidth="2" />
          <circle cx="450" cy="80" r="6" fill="#FFFFFF" className="animate-ping opacity-75" />
          <circle cx="450" cy="80" r="4" fill="#FFFFFF" />
        </svg>

        {/* Floating Destination Badge */}
        <div
          className={`absolute top-[48px] left-[50%] -translate-x-1/2 flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-950/80 px-3.5 py-1 text-[11px] font-semibold text-purple-200 shadow-[0_0_20px_rgba(130,71,255,0.4)] backdrop-blur-md transition-all duration-700 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Sparkles className="size-3 text-cyan-300" />
          <span>Career Destination</span>
        </div>

        {/* Milestone Chip 1: Discover */}
        <div
          className={`absolute bottom-[160px] left-[32%] flex items-center gap-2 rounded-2xl border border-cyan-500/30 bg-card/85 px-3 py-1.5 text-xs text-foreground shadow-lg backdrop-blur transition-all duration-700 delay-100 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <div className="grid size-5 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Compass className="size-3" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[11px] leading-tight">Find My Direction</span>
            <span className="text-[9px] text-muted-foreground">AI Career Match</span>
          </div>
        </div>

        {/* Milestone Chip 2: Projects */}
        <div
          className={`absolute top-[320px] right-[24%] flex items-center gap-2 rounded-2xl border border-blue-500/30 bg-card/85 px-3 py-1.5 text-xs text-foreground shadow-lg backdrop-blur transition-all duration-700 delay-200 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 translate-x-6"
          }`}
        >
          <div className="grid size-5 place-items-center rounded-lg bg-blue-500/20 text-blue-400">
            <Terminal className="size-3" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[11px] leading-tight">Build Real Projects</span>
            <span className="text-[9px] text-muted-foreground">Verified Code Artifacts</span>
          </div>
        </div>

        {/* Milestone Chip 3: Proof & Readiness */}
        <div
          className={`absolute top-[180px] left-[30%] flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-card/85 px-3 py-1.5 text-xs text-foreground shadow-lg backdrop-blur transition-all duration-700 delay-300 ${
            mounted ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-6"
          }`}
        >
          <div className="grid size-5 place-items-center rounded-lg bg-indigo-500/20 text-indigo-400">
            <Award className="size-3" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-semibold text-[11px] leading-tight">Prove My Readiness</span>
            <span className="text-[9px] text-muted-foreground">Benchmark Score: 78%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
