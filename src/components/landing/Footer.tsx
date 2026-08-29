import React from "react";
import { Link } from "@tanstack/react-router";
import { Lock, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/75 dark:bg-[#090e24]/75 backdrop-blur-xl pt-14 pb-8 text-xs text-muted-foreground select-none transition-colors">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-5 pb-12 border-b border-border/60">
          {/* Brand & Mission Column */}
          <div className="space-y-4 md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/brand/icon/spar-ai-icon-64.png"
                srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
                alt="SPAR AI"
                className="size-8 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display text-base font-bold tracking-tight text-foreground">
                SPAR <span className="text-cyan-500 dark:text-cyan-400">AI</span>
              </span>
            </Link>

            <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
              Adaptive Career Intelligence & University Placement Operating System. Evidence-based discovery, continuous readiness scoring, and structured career progression for college students.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="size-4 text-cyan-500 dark:text-cyan-400" />
              <span>Enterprise-grade privacy & student data protection</span>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              Product
            </p>
            <ul className="space-y-2">
              <li><a href="#discovery" className="hover:text-foreground transition-colors">AI Career Discovery</a></li>
              <li><a href="#roadmap" className="hover:text-foreground transition-colors">Personalized Roadmap</a></li>
              <li><a href="#projects" className="hover:text-foreground transition-colors">Practical Projects</a></li>
              <li><a href="#interviews" className="hover:text-foreground transition-colors">Mock Interviews</a></li>
              <li><a href="#readiness" className="hover:text-foreground transition-colors">Readiness Scoring</a></li>
              <li><a href="#opportunities" className="hover:text-foreground transition-colors">Job Gap Optimizer</a></li>
            </ul>
          </div>

          {/* For Colleges Links */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              For Colleges
            </p>
            <ul className="space-y-2">
              <li><Link to="/colleges" className="hover:text-foreground transition-colors">University Platform</Link></li>
              <li><Link to="/colleges" className="hover:text-foreground transition-colors">Register Institution</Link></li>
              <li><Link to="/colleges" className="hover:text-foreground transition-colors">Cohort Analytics</Link></li>
              <li><a href="#colleges-section" className="hover:text-foreground transition-colors">Placement Intelligence</a></li>
            </ul>
          </div>

          {/* Resources & Legal Links */}
          <div className="space-y-3">
            <p className="font-display text-xs font-bold text-foreground uppercase tracking-wider">
              Company & Legal
            </p>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-foreground transition-colors">About SPAR AI</a></li>
              <li><a href="#privacy" className="hover:text-foreground transition-colors">Privacy Notice</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#ai-notice" className="hover:text-foreground transition-colors">AI Usage & Safety</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar with Admin Lock */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© {new Date().getFullYear()} SPAR AI Inc. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#terms" className="hover:text-foreground transition-colors">Terms</a>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors border border-border/40 rounded-md px-2 py-0.5"
            >
              <Lock className="size-3" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
