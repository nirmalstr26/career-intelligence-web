import React from "react";
import { Target, FolderGit2, UserCheck } from "lucide-react";

export function CareerRoadArt() {
  return (
    <div className="relative w-full h-[500px] sm:h-[540px] lg:h-[600px] flex items-center justify-center select-none pointer-events-none">
      {/* Ambient background neon aura */}
      <div
        className="absolute inset-0 opacity-70 mix-blend-screen pointer-events-none"
        style={{
          background:
            "radial-gradient(circle 320px at 50% 35%, rgba(6, 215, 247, 0.25), rgba(70, 87, 255, 0.2) 45%, rgba(130, 71, 255, 0.1) 70%, transparent 95%)",
        }}
      />

      {/* Main Integrated Hero Background Artwork with Seamless Radial & Linear Edge Fades */}
      <div className="relative w-full h-full max-w-[560px] flex items-center justify-center overflow-visible">
        <img
          src="/brand/hero_background_home.png"
          alt="SPAR AI Career Path Journey"
          className="w-full h-full object-cover object-center scale-105"
          style={{
            maskImage:
              "radial-gradient(ellipse 78% 72% at 50% 46%, black 30%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 80%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 72% at 50% 46%, black 30%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.3) 80%, transparent 100%)",
          }}
        />

        {/* Soft edge gradient blends */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030712]/60 via-transparent to-transparent opacity-70" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-80" />

        {/* 4 Interactive Floating Milestone Chips */}

        {/* 1. Dream Career (Top Left near portal) */}
        <div className="absolute top-[125px] left-[20%] sm:left-[24%] flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_18px_rgba(6,215,247,0.35)] backdrop-blur">
          <Target className="size-3.5 text-cyan-400" />
          <span className="font-semibold text-[11px]">Dream Career</span>
        </div>

        {/* 2. Build Skills (Middle Left) */}
        <div className="absolute top-[215px] left-[8%] sm:left-[12%] flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_18px_rgba(130,71,255,0.35)] backdrop-blur">
          <span className="text-purple-400 font-mono text-xs font-bold">&lt;/&gt;</span>
          <span className="font-semibold text-[11px]">Build Skills</span>
        </div>

        {/* 3. Real Projects (Middle Right) */}
        <div className="absolute top-[250px] right-[6%] sm:right-[10%] flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_18px_rgba(0,140,255,0.35)] backdrop-blur">
          <FolderGit2 className="size-3.5 text-blue-400" />
          <span className="font-semibold text-[11px]">Real Projects</span>
        </div>

        {/* 4. Get Hired (Bottom Left) */}
        <div className="absolute top-[305px] left-[4%] sm:left-[8%] flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_18px_rgba(70,87,255,0.35)] backdrop-blur">
          <UserCheck className="size-3.5 text-indigo-400" />
          <span className="font-semibold text-[11px]">Get Hired</span>
        </div>
      </div>
    </div>
  );
}
