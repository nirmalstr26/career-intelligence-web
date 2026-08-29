import React from "react";
import { Target, FolderGit2, UserCheck } from "lucide-react";
import heroBgImage from "@/assets/hero_background_home.png";

export function CareerRoadArt() {
  return (
    <div className="relative w-full h-[520px] sm:h-[560px] lg:h-[620px] flex items-center justify-center select-none pointer-events-none">
      {/* Background Neon Aura */}
      <div
        className="absolute inset-0 opacity-60 mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle 300px at 50% 35%, rgba(6, 215, 247, 0.25), rgba(70, 87, 255, 0.2) 45%, rgba(130, 71, 255, 0.1) 70%, transparent 95%)",
        }}
      />

      {/* Seamless Integrated Hero Background Artwork */}
      <div className="relative w-full h-full max-w-[560px] flex items-center justify-center overflow-visible">
        <img
          src={heroBgImage || "/brand/hero_background_home.png"}
          alt="SPAR AI Career Journey"
          className="w-full h-full object-cover object-center scale-105 select-none"
          style={{
            maskImage:
              "radial-gradient(ellipse 76% 70% at 50% 45%, black 30%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.25) 80%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 76% 70% at 50% 45%, black 30%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,0.25) 80%, transparent 100%)",
          }}
        />

        {/* Soft edge gradient fades for zero hard rectangular lines */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent opacity-95" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#030712]/50 via-transparent to-transparent opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712] opacity-75" />

        {/* 4 Interactive Floating Milestone Chips */}

        {/* 1. Dream Career (Top Center near portal) */}
        <div className="absolute top-[120px] left-[22%] sm:left-[26%] flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] backdrop-blur-md">
          <Target className="size-3.5 text-cyan-400" />
          <span className="font-semibold text-[11px]">Dream Career</span>
        </div>

        {/* 2. Build Skills (Middle Left) */}
        <div className="absolute top-[210px] left-[6%] sm:left-[10%] flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(130,71,255,0.4)] backdrop-blur-md">
          <span className="text-purple-400 font-mono text-xs font-bold">&lt;/&gt;</span>
          <span className="font-semibold text-[11px]">Build Skills</span>
        </div>

        {/* 3. Real Projects (Middle Right) */}
        <div className="absolute top-[245px] right-[4%] sm:right-[8%] flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(0,140,255,0.4)] backdrop-blur-md">
          <FolderGit2 className="size-3.5 text-blue-400" />
          <span className="font-semibold text-[11px]">Real Projects</span>
        </div>

        {/* 4. Get Hired (Bottom Left) */}
        <div className="absolute top-[300px] left-[4%] sm:left-[8%] flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(70,87,255,0.4)] backdrop-blur-md">
          <UserCheck className="size-3.5 text-indigo-400" />
          <span className="font-semibold text-[11px]">Get Hired</span>
        </div>
      </div>
    </div>
  );
}
