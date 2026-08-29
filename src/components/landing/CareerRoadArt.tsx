import React from "react";
import { Target, FolderGit2, UserCheck } from "lucide-react";

export function CareerRoadArt() {
  return (
    <div className="relative w-full h-[480px] sm:h-[520px] lg:h-[580px] flex items-center justify-center select-none pointer-events-none">
      {/* 4 Interactive Floating Milestone Chips Overlaying the Center Pathway */}
      <div className="relative w-full h-full max-w-[480px]">
        {/* 1. Dream Career (Top Center near portal) */}
        <div className="absolute top-[100px] sm:top-[115px] left-[26%] sm:left-[30%] flex items-center gap-1.5 rounded-xl border border-cyan-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(6,215,247,0.4)] backdrop-blur-md">
          <Target className="size-3.5 text-cyan-400" />
          <span className="font-semibold text-[11px]">Dream Career</span>
        </div>

        {/* 2. Build Skills (Middle Left) */}
        <div className="absolute top-[195px] sm:top-[210px] left-[10%] sm:left-[14%] flex items-center gap-1.5 rounded-xl border border-purple-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(130,71,255,0.4)] backdrop-blur-md">
          <span className="text-purple-400 font-mono text-xs font-bold">&lt;/&gt;</span>
          <span className="font-semibold text-[11px]">Build Skills</span>
        </div>

        {/* 3. Real Projects (Middle Right) */}
        <div className="absolute top-[235px] sm:top-[250px] right-[8%] sm:right-[12%] flex items-center gap-1.5 rounded-xl border border-blue-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(0,140,255,0.4)] backdrop-blur-md">
          <FolderGit2 className="size-3.5 text-blue-400" />
          <span className="font-semibold text-[11px]">Real Projects</span>
        </div>

        {/* 4. Get Hired (Bottom Left) */}
        <div className="absolute top-[290px] sm:top-[305px] left-[6%] sm:left-[10%] flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-[#090e24]/90 px-3 py-1.5 text-xs text-white shadow-[0_0_20px_rgba(70,87,255,0.4)] backdrop-blur-md">
          <UserCheck className="size-3.5 text-indigo-400" />
          <span className="font-semibold text-[11px]">Get Hired</span>
        </div>
      </div>
    </div>
  );
}
