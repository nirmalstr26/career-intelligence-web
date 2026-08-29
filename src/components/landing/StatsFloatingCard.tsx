import React from "react";
import { Users, Building2, Star } from "lucide-react";

export function StatsFloatingCard() {
  return (
    <div className="flex flex-col items-center gap-3.5 z-20 w-full max-w-[480px]">
      {/* 3 Metric Card */}
      <div className="w-full rounded-2xl border border-blue-500/30 bg-[#090e24]/85 p-3.5 sm:p-4 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
        <div className="grid grid-cols-3 divide-x divide-border/60 text-center">
          {/* Stat 1 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1.5 text-purple-400 mb-0.5">
              <Users className="size-4" />
              <span className="font-display text-base sm:text-lg font-extrabold text-white">500K+</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Students Empowered</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1.5 text-cyan-400 mb-0.5">
              <Building2 className="size-4" />
              <span className="font-display text-base sm:text-lg font-extrabold text-white">1,200+</span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Colleges Onboarded</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col items-center px-2">
            <div className="flex items-center gap-1.5 text-amber-400 mb-0.5">
              <Star className="size-4 fill-amber-400" />
              <span className="font-display text-base sm:text-lg font-extrabold text-white">4.8<span className="text-xs text-muted-foreground font-normal">/5</span></span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium">Student Satisfaction</span>
          </div>
        </div>
      </div>

      {/* Avatars + Stars + Trust Label */}
      <div className="flex items-center gap-3">
        <div className="flex -space-x-2 overflow-hidden">
          <img
            className="inline-block size-7 rounded-full ring-2 ring-[#090e24] object-cover"
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Student avatar 1"
          />
          <img
            className="inline-block size-7 rounded-full ring-2 ring-[#090e24] object-cover"
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
            alt="Student avatar 2"
          />
          <img
            className="inline-block size-7 rounded-full ring-2 ring-[#090e24] object-cover"
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80"
            alt="Student avatar 3"
          />
          <img
            className="inline-block size-7 rounded-full ring-2 ring-[#090e24] object-cover"
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
            alt="Student avatar 4"
          />
        </div>

        <div className="flex flex-col text-left">
          <div className="flex items-center gap-0.5 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-3 fill-amber-400" />
            ))}
          </div>
          <span className="text-[10px] sm:text-[11px] text-muted-foreground font-medium mt-0.5">
            Trusted by students across top colleges in India
          </span>
        </div>
      </div>
    </div>
  );
}
