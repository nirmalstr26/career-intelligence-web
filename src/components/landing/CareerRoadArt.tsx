import React from "react";
import { Target, FolderGit2, UserCheck } from "lucide-react";

export function CareerRoadArt() {
  return (
    <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] flex items-center justify-center select-none pointer-events-none">
      {/* 4 Interactive Floating Milestone Chips Overlaying the Seamless Center Pathway */}
      <div className="relative w-full h-full max-w-[440px]">
        
        {/* 1. Dream Career (Top Center inside Glowing Portal) */}
        <div className="absolute top-[85px] sm:top-[95px] left-[32%] sm:left-[35%] flex items-center gap-1.5 rounded-full border border-cyan-500/60 dark:border-cyan-400/60 bg-white/95 dark:bg-[#06102b]/90 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(6,215,247,0.35),0_0_15px_rgba(6,215,247,0.3)] dark:shadow-[0_0_25px_rgba(6,215,247,0.6)] backdrop-blur-md transition-all">
          <Target className="size-3.5 text-cyan-600 dark:text-cyan-400" />
          <span className="font-bold text-[11px] tracking-wide">Dream Career</span>
        </div>

        {/* 2. Build Skills (Middle Left) */}
        <div className="absolute top-[180px] sm:top-[190px] left-[10%] sm:left-[14%] flex items-center gap-1.5 rounded-full border border-purple-500/60 dark:border-purple-400/60 bg-white/95 dark:bg-[#06102b]/90 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(168,85,247,0.35),0_0_15px_rgba(168,85,247,0.3)] dark:shadow-[0_0_25px_rgba(168,85,247,0.6)] backdrop-blur-md transition-all">
          <span className="text-purple-600 dark:text-purple-400 font-mono text-xs font-bold">&lt;/&gt;</span>
          <span className="font-bold text-[11px] tracking-wide">Build Skills</span>
        </div>

        {/* 3. Real Projects (Middle Right) */}
        <div className="absolute top-[215px] sm:top-[225px] right-[8%] sm:right-[12%] flex items-center gap-1.5 rounded-full border border-blue-500/60 dark:border-blue-400/60 bg-white/95 dark:bg-[#06102b]/90 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(59,130,246,0.35),0_0_15px_rgba(59,130,246,0.3)] dark:shadow-[0_0_25px_rgba(59,130,246,0.6)] backdrop-blur-md transition-all">
          <FolderGit2 className="size-3.5 text-blue-600 dark:text-blue-400" />
          <span className="font-bold text-[11px] tracking-wide">Real Projects</span>
        </div>

        {/* 4. Get Hired (Bottom Left) */}
        <div className="absolute top-[275px] sm:top-[285px] left-[6%] sm:left-[10%] flex items-center gap-1.5 rounded-full border border-indigo-500/60 dark:border-indigo-400/60 bg-white/95 dark:bg-[#06102b]/90 px-3.5 py-1.5 text-xs text-slate-900 dark:text-white shadow-[0_4px_20px_rgba(99,102,241,0.35),0_0_15px_rgba(99,102,241,0.3)] dark:shadow-[0_0_25px_rgba(99,102,241,0.6)] backdrop-blur-md transition-all">
          <UserCheck className="size-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-bold text-[11px] tracking-wide">Get Hired</span>
        </div>
      </div>
    </div>
  );
}
