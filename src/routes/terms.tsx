import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, FileText, ArrowLeft, CheckCircle2, AlertTriangle, Mail } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — SPAR AI Career Intelligence" },
      {
        name: "description",
        content:
          "Terms of Service governing the use of the SPAR AI Career Intelligence platform, AI coaching tools, and student learning environments.",
      },
      { property: "og:title", content: "Terms of Service — SPAR AI Career Intelligence" },
      {
        property: "og:description",
        content:
          "Review terms and conditions for students, colleges, and recruiters using SPAR AI Career Intelligence.",
      },
    ],
  }),
  component: TermsOfServicePage,
});

export function TermsOfServicePage() {
  const lastUpdated = "March 20, 2026";

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-600 dark:selection:text-cyan-200">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors mb-6 group"
        >
          <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
          <span>Back to SPAR AI Home</span>
        </Link>

        {/* Header */}
        <div className="space-y-3 pb-8 border-b border-border/60">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 text-xs font-semibold">
            <FileText className="size-3.5" />
            <span>Public Legal Document</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Last updated: <span className="text-foreground font-medium">{lastUpdated}</span> · Version 1.2 (Pilot Release)
          </p>
        </div>

        {/* Summary Card */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-card/60 border border-border/70">
          <h2 className="text-sm sm:text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <ShieldCheck className="size-4 text-cyan-400" />
            <span>Summary of Key Principles</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            By accessing or using SPAR AI, you agree to these Terms of Service. SPAR AI provides educational and career acceleration tools, including AI-driven diagnostic testing, customized skill roadmaps, mock interview practice, and placement readiness tracking. We are committed to transparency, student data protection, and fair usage.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">1.</span> Acceptance of Terms
            </h2>
            <p>
              These Terms of Service ("Terms") constitute a legally binding agreement between you (whether as an individual student, institutional coordinator, or recruiter) and <strong>SPAR AI</strong> ("we", "us", or "our"), governing your access to and use of our web application at{" "}
              <a href="https://pilot.d2lm8cknxaono.amplifyapp.com" className="text-cyan-500 underline font-medium">
                https://pilot.d2lm8cknxaono.amplifyapp.com
              </a>{" "}
              and all related services.
            </p>
            <p>
              By creating an account, signing in via Google OAuth, or using any feature of the platform, you confirm that you have read, understood, and agree to be bound by these Terms and our <Link to="/privacy" className="text-cyan-500 underline font-medium">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">2.</span> Description of Service & Educational Purpose
            </h2>
            <p>
              SPAR AI is an intelligent career acceleration platform designed to assist university and college students in preparing for technical and professional employment. Key features include:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Career trajectory exploration and role-matching recommendations.</li>
              <li>Personalized, sequenced curriculum modules and hands-on coding milestones.</li>
              <li>AI-powered mock interview practice with automated technical feedback.</li>
              <li>Dynamic placement readiness scoring and diagnostic gap analysis.</li>
            </ul>
            <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 text-xs sm:text-sm space-y-1">
              <p className="font-semibold text-foreground flex items-center gap-1.5 text-amber-500 dark:text-amber-400">
                <AlertTriangle className="size-4 shrink-0" />
                <span>Educational Guidance Notice:</span>
              </p>
              <p>
                SPAR AI is an advisory and preparation tool. While our benchmark scores reflect industry placement standards, SPAR AI does not guarantee employment, job offers, or specific compensation packages from participating recruiters. Hiring decisions are made solely at the discretion of individual hiring organizations.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">3.</span> Account Registration & Authentication
            </h2>
            <p>
              You may register for SPAR AI using <strong>Google Sign-In</strong> or your college institutional credentials. You agree to:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Provide accurate, current, and complete academic and contact information.</li>
              <li>Maintain the security of your authentication tokens and credentials.</li>
              <li>Notify us immediately at <code>support@sparai.in</code> if you discover unauthorized access to your account.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">4.</span> User Conduct & Acceptable Use Policy
            </h2>
            <p>When using SPAR AI, you agree that you will <strong>not</strong>:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Use automated scripts, bots, scrapers, or crawlers to extract curriculum content, assessment questions, or student profiles.</li>
              <li>Attempt to reverse engineer, decompile, or compromise the underlying AI models, prompt architectures, or infrastructure.</li>
              <li>Submit plagiarized code or project solutions during diagnostic or verified portfolio assessments.</li>
              <li>Upload any defamatory, unlawful, abusive, or malicious code to the platform.</li>
              <li>Circumvent or attempt to manipulate placement readiness scores or diagnostic benchmarks.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">5.</span> Intellectual Property Rights
            </h2>
            <p>
              <strong>SPAR AI Proprietary Assets:</strong> All software, user interfaces, branding, visual designs, algorithmic benchmarks, and proprietary curriculum content are the exclusive property of SPAR AI and its licensors.
            </p>
            <p>
              <strong>Your Submissions:</strong> You retain ownership of any original code, portfolio projects, or text you write or build while using the platform. By submitting work for automated assessment, you grant SPAR AI a limited license to evaluate, process, and display that content within your student profile.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">6.</span> Third-Party Integrations (Google Services)
            </h2>
            <p>
              SPAR AI utilizes Google OAuth for secure identity verification. Your use of Google Sign-In is subject to Google's Terms of Service and Privacy Policy. SPAR AI strictly adheres to the{" "}
              <a
                href="https://developers.google.com/terms/api-services-user-data-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-500 underline font-medium"
              >
                Google API Services User Data Policy
              </a>
              , including Limited Use provisions.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">7.</span> Disclaimers & Limitation of Liability
            </h2>
            <p className="text-xs sm:text-sm">
              SPAR AI IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMISSIBLE BY APPLICABLE LAW, SPAR AI DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-xs sm:text-sm">
              IN NO EVENT SHALL SPAR AI, ITS OFFICERS, DIRECTORS, OR EMPLOYEES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF YOUR USE OF OR INABILITY TO USE THE PLATFORM.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">8.</span> Account Termination
            </h2>
            <p>
              We reserve the right to suspend or terminate your account if you breach these Terms or engage in conduct detrimental to other students or the integrity of the platform. You may delete your account at any time by contacting{" "}
              <a href="mailto:support@sparai.in" className="text-cyan-500 underline font-medium">
                support@sparai.in
              </a>.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3 pt-4 border-t border-border/60">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">9.</span> Contact Us
            </h2>
            <p>
              For legal inquiries, questions regarding these Terms, or support requests:
            </p>
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-1 text-xs sm:text-sm">
              <p><strong>SPAR AI Legal & Compliance</strong></p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-cyan-400" />
                Email: <a href="mailto:legal@sparai.in" className="text-cyan-500 underline font-medium">legal@sparai.in</a> / <a href="mailto:support@sparai.in" className="text-cyan-500 underline font-medium">support@sparai.in</a>
              </p>
              <p>Platform: <strong>SPAR AI Career Intelligence</strong></p>
              <p>Web: <a href="https://pilot.d2lm8cknxaono.amplifyapp.com" className="text-cyan-500 underline">https://pilot.d2lm8cknxaono.amplifyapp.com</a></p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
