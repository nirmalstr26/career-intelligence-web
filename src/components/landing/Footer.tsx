import React from "react";
import { Link } from "@tanstack/react-router";
import { Sparkles, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 dark:bg-[#050814] pt-14 pb-10 transition-colors">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 border-b border-border/60">
          {/* Column 1 & 2: Brand Identity */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <img
                src="/brand/icon/spar-ai-icon-64.png"
                srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
                alt="SPAR AI"
                className="size-8 object-contain drop-shadow-sm"
              />
              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                SPAR <span className="text-cyan-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              The AI career intelligence operating system for college students: career discovery, personalized roadmaps, project verification, and institutional placement analytics.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Pilot Platform Active · Release v1.0.0</span>
            </div>
          </div>

          {/* Column 3: Product */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Product
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#capabilities" className="hover:text-foreground transition-colors">
                  Platform Capabilities
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-foreground transition-colors">
                  Connected Architecture
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-foreground transition-colors">
                  Placement Journey
                </a>
              </li>
              <li>
                <a href="#intelligence" className="hover:text-foreground transition-colors">
                  SPAR AI Coach
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-foreground transition-colors">
                  Career Pathways
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: For Colleges */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              For Colleges
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link to="/colleges" className="hover:text-foreground transition-colors">
                  Institutional Portal
                </Link>
              </li>
              <li>
                <a href="#colleges" className="hover:text-foreground transition-colors">
                  Cohort Intelligence
                </a>
              </li>
              <li>
                <a href="#colleges" className="hover:text-foreground transition-colors">
                  Batch Gap Diagnostics
                </a>
              </li>
              <li>
                <Link to="/colleges" className="hover:text-foreground transition-colors">
                  Coordinator Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div className="space-y-3">
            <h4 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              Company & Legal
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-foreground transition-colors">
                  About SPAR
                </a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#safety" className="hover:text-foreground transition-colors">
                  AI Safety & Ethics
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 SPAR AI Inc. All rights reserved.</p>
          <div className="flex items-center gap-1 text-[11px]">
            <span>Crafted for student career empowerment</span>
            <Sparkles className="size-3 text-cyan-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
}
