import React from "react";
import { Sparkles, Code2, FolderGit2, Target, UserCheck } from "lucide-react";

export function CareerRoadArt() {
  return (
    <div className="relative w-full h-[520px] lg:h-[580px] flex items-center justify-center select-none pointer-events-none">
      {/* Background radial cosmic glow */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle 280px at 50% 30%, rgba(6, 215, 247, 0.25), rgba(70, 87, 255, 0.2) 40%, rgba(130, 71, 255, 0.1) 70%, transparent 90%)",
        }}
      />

      {/* Center Target Portal at top */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
        {/* Outer pulsating concentric rings */}
        <div className="relative grid size-28 place-items-center">
          <div className="absolute inset-0 rounded-full border border-cyan-400/30 animate-ping opacity-30" />
          <div className="absolute inset-2 rounded-full border border-blue-500/40 opacity-70" />
          <div className="absolute inset-4 rounded-full border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(6,215,247,0.8)]" />

          {/* Inner Portal Circle */}
          <div className="relative grid size-16 place-items-center rounded-full bg-gradient-to-tr from-cyan-500/40 via-blue-600/60 to-purple-600/80 backdrop-blur-md border border-cyan-300/80 shadow-[0_0_25px_rgba(6,215,247,0.9)]">
            <svg viewBox="0 0 24 24" className="size-8 text-cyan-200 drop-shadow-[0_0_8px_#06d7f7]" fill="none">
              <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Luminous Serpentine SVG Road */}
      <svg
        viewBox="0 0 500 580"
        className="w-full h-full max-w-[480px] overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Road Gradient */}
          <linearGradient id="serpentineGlow" x1="250" y1="560" x2="250" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#06D7F7" stopOpacity="0.8" />
            <stop offset="30%" stopColor="#008CFF" stopOpacity="0.9" />
            <stop offset="65%" stopColor="#8247FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#06D7F7" stopOpacity="1" />
          </linearGradient>

          {/* Inner Core Road Gradient */}
          <linearGradient id="serpentineCore" x1="250" y1="560" x2="250" y2="70" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E0F7FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#E0F7FF" stopOpacity="0.9" />
          </linearGradient>

          {/* Road Blur for realistic glow */}
          <filter id="roadNeonBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Wide Road Glow */}
        <path
          d="M 250 560 C 230 460, 370 410, 330 330 C 290 250, 180 230, 220 160 C 240 120, 250 100, 250 80"
          stroke="url(#serpentineGlow)"
          strokeWidth="32"
          strokeLinecap="round"
          filter="url(#roadNeonBlur)"
          className="opacity-75"
        />

        {/* Secondary Blue Ribbon Layer */}
        <path
          d="M 250 560 C 230 460, 370 410, 330 330 C 290 250, 180 230, 220 160 C 240 120, 250 100, 250 80"
          stroke="url(#serpentineGlow)"
          strokeWidth="16"
          strokeLinecap="round"
        />

        {/* Core Electric Bright White-Cyan Trail */}
        <path
          d="M 250 560 C 230 460, 370 410, 330 330 C 290 250, 180 230, 220 160 C 240 120, 250 100, 250 80"
          stroke="url(#serpentineCore)"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Light Particle Ribbons */}
        <path
          d="M 240 560 C 220 460, 360 410, 320 330 C 280 250, 170 230, 210 160 C 230 120, 245 100, 245 80"
          stroke="#06D7F7"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="opacity-60"
        />
        <path
          d="M 260 560 C 240 460, 380 410, 340 330 C 300 250, 190 230, 230 160 C 250 120, 255 100, 255 80"
          stroke="#8247FF"
          strokeWidth="1.5"
          strokeDasharray="4 6"
          className="opacity-60"
        />
      </svg>

      {/* Floating Chips along the Serpentine Road */}

      {/* 1. Dream Career (Top Left near target) */}
      <div className="absolute top-[120px] left-[26%] flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_15px_rgba(6,215,247,0.3)] backdrop-blur">
        <Target className="size-3.5 text-cyan-400" />
        <span className="font-semibold text-[11px]">Dream Career</span>
      </div>

      {/* 2. Build Skills (Middle Left) */}
      <div className="absolute top-[210px] left-[14%] flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_15px_rgba(130,71,255,0.3)] backdrop-blur">
        <span className="text-purple-400 font-mono text-xs font-bold">&lt;/&gt;</span>
        <span className="font-semibold text-[11px]">Build Skills</span>
      </div>

      {/* 3. Real Projects (Middle Right) */}
      <div className="absolute top-[245px] right-[12%] flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_15px_rgba(0,140,255,0.3)] backdrop-blur">
        <FolderGit2 className="size-3.5 text-blue-400" />
        <span className="font-semibold text-[11px]">Real Projects</span>
      </div>

      {/* 4. Get Hired (Bottom Left) */}
      <div className="absolute top-[295px] left-[8%] flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_15px_rgba(70,87,255,0.3)] backdrop-blur">
        <UserCheck className="size-3.5 text-indigo-400" />
        <span className="font-semibold text-[11px]">Get Hired</span>
      </div>
    </div>
  );
}
