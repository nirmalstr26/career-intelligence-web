import React from "react";
import { Compass, Map, ShieldCheck, Award } from "lucide-react";

interface NodeItem {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  glowColor: string;
  nodeBorder: string;
  nodeBg: string;
  iconColor: string;
  rippleColor: string;
  animationDelay: string;
}

const NODES: NodeItem[] = [
  {
    title: "Career Discovery",
    subtitle: "Discover roles that fit your strengths",
    icon: Compass,
    glowColor: "shadow-[0_0_25px_rgba(168,85,247,0.6)]",
    nodeBorder: "border-purple-400/70",
    nodeBg: "bg-purple-950/90",
    iconColor: "text-purple-300",
    rippleColor: "border-purple-500/30",
    animationDelay: "0ms",
  },
  {
    title: "Personalized Roadmap",
    subtitle: "Get a step-by-step career plan",
    icon: Map,
    glowColor: "shadow-[0_0_25px_rgba(59,130,246,0.6)]",
    nodeBorder: "border-blue-400/70",
    nodeBg: "bg-blue-950/90",
    iconColor: "text-blue-300",
    rippleColor: "border-blue-500/30",
    animationDelay: "300ms",
  },
  {
    title: "Verified Projects",
    subtitle: "Build real projects. Earn credibility",
    icon: ShieldCheck,
    glowColor: "shadow-[0_0_25px_rgba(6,215,247,0.6)]",
    nodeBorder: "border-cyan-400/70",
    nodeBg: "bg-cyan-950/90",
    iconColor: "text-cyan-300",
    rippleColor: "border-cyan-500/30",
    animationDelay: "600ms",
  },
  {
    title: "Placement Readiness",
    subtitle: "Prepare. Practice. Get placed.",
    icon: Award,
    glowColor: "shadow-[0_0_25px_rgba(16,185,129,0.6)]",
    nodeBorder: "border-emerald-400/70",
    nodeBg: "bg-emerald-950/90",
    iconColor: "text-emerald-300",
    rippleColor: "border-emerald-500/30",
    animationDelay: "900ms",
  },
];

export function ConstellationCapabilityRoadmap() {
  return (
    <div className="relative pt-6 pb-2 w-full max-w-2xl select-none">
      {/* GLOWING SVG SINE-WAVE CONNECTOR PATHWAY */}
      <div className="absolute top-[38px] left-[10%] right-[10%] h-12 -z-0 pointer-events-none hidden sm:block">
        <svg
          className="w-full h-full overflow-visible"
          viewBox="0 0 500 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="constellationGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="70%" stopColor="#06d7f7" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>
          </defs>
          <path
            d="M 10 20 Q 80 5, 160 20 T 320 20 T 490 20"
            stroke="url(#constellationGrad)"
            strokeWidth="2.5"
            filter="url(#glow)"
            strokeDasharray="4 2"
          />
        </svg>
      </div>

      {/* 4 STAGGERED ANIMATED NODES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3 relative z-10">
        {NODES.map((node) => {
          const Icon = node.icon;
          return (
            <div
              key={node.title}
              className="flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Animated Floating Node Container */}
              <div
                className="relative mb-3.5 animate-bounce-subtle"
                style={{ animationDelay: node.animationDelay }}
              >
                {/* Concentric Glow Ripples */}
                <div
                  className={`absolute -inset-2 rounded-full border ${node.rippleColor} opacity-50 animate-ping`}
                  style={{ animationDuration: "3s", animationDelay: node.animationDelay }}
                />
                <div
                  className={`absolute -inset-3.5 rounded-full border ${node.rippleColor} opacity-30`}
                />

                {/* Core Circular Glowing Icon Button */}
                <div
                  className={`relative size-12 sm:size-14 rounded-full border-2 ${node.nodeBorder} ${node.nodeBg} ${node.glowColor} flex items-center justify-center backdrop-blur-xl transition-all duration-300 group-hover:scale-110`}
                >
                  <Icon className={`size-5 sm:size-6 ${node.iconColor}`} />
                </div>
              </div>

              {/* Node Title & Subtitle */}
              <h4 className="font-display text-xs sm:text-[13px] font-bold text-foreground group-hover:text-cyan-400 transition-colors leading-tight">
                {node.title}
              </h4>
              <p className="text-[10px] text-muted-foreground leading-tight mt-1 max-w-[120px]">
                {node.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes bounceSubtle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .animate-bounce-subtle {
          animation: bounceSubtle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
