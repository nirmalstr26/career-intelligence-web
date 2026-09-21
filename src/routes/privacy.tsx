import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Lock, FileText, ArrowLeft, CheckCircle2, AlertCircle, Mail, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SPAR AI Career Intelligence" },
      {
        name: "description",
        content:
          "Privacy Policy for SPAR AI Career Intelligence platform, detailing our data collection, usage, protection policies, and strict adherence to Google API Services User Data Policy.",
      },
      { property: "og:title", content: "Privacy Policy — SPAR AI Career Intelligence" },
      {
        property: "og:description",
        content:
          "Learn how SPAR AI protects your privacy, secures student data, and complies with Google User Data Limited Use policies.",
      },
    ],
  }),
  component: PrivacyPolicyPage,
});

export function PrivacyPolicyPage() {
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
            <Shield className="size-3.5" />
            <span>Public Legal Document</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Last updated: <span className="text-foreground font-medium">{lastUpdated}</span> · Version 1.2 (Pilot Release)
          </p>
        </div>

        {/* Google API Services User Data Policy Mandatory Highlight Banner */}
        <div className="my-8 p-5 sm:p-6 rounded-2xl bg-cyan-950/20 dark:bg-cyan-950/30 border border-cyan-500/40 shadow-[0_0_25px_rgba(6,215,247,0.1)]">
          <div className="flex items-start gap-3.5">
            <div className="size-9 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5 text-cyan-400">
              <Lock className="size-5" />
            </div>
            <div className="space-y-2">
              <h2 className="text-sm sm:text-base font-bold text-foreground">
                Google API Services User Data Policy Compliance
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                SPAR AI's use and transfer to any other app of information received from Google APIs adheres to the{" "}
                <a
                  href="https://developers.google.com/terms/api-services-user-data-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-500 dark:text-cyan-400 font-semibold underline inline-flex items-center gap-0.5 hover:opacity-80"
                >
                  Google API Services User Data Policy
                  <ExternalLink className="size-3 ml-0.5" />
                </a>
                , including the <strong>Limited Use</strong> requirements. We do not sell your personal data or Google user data, nor do we use it for targeted advertising.
              </p>
            </div>
          </div>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-10 text-sm sm:text-base text-muted-foreground leading-relaxed">

          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">1.</span> Introduction & Scope
            </h2>
            <p>
              Welcome to <strong>SPAR AI</strong> ("we", "our", or "us"). SPAR AI is an artificial intelligence-powered career intelligence operating system built for college and university students, institutional placement offices, and recruitment partners.
            </p>
            <p>
              This Privacy Policy explains how we collect, use, disclose, store, and protect your information when you visit our website at{" "}
              <a href="https://pilot.d2lm8cknxaono.amplifyapp.com" className="text-cyan-500 underline font-medium">
                https://pilot.d2lm8cknxaono.amplifyapp.com
              </a>{" "}
              or utilize any of our career discovery, skill evaluation, AI interview coaching, and placement readiness tools.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">2.</span> Information We Collect
            </h2>
            <p>We collect only the minimum information necessary to provide tailored career intelligence to you:</p>

            <div className="grid gap-3 pt-2">
              <div className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-cyan-400" />
                  A. Account & Authentication Information (including Google Sign-In)
                </h3>
                <p className="text-xs sm:text-sm">
                  When you sign in using <strong>Google OAuth</strong> or your institutional email, we receive your basic public profile information permitted by Google: your full name, email address, and profile picture avatar. We use this strictly to authenticate your account and personalize your workspace.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-cyan-400" />
                  B. Educational & Career Profile Data
                </h3>
                <p className="text-xs sm:text-sm">
                  Information you provide during student onboarding, such as your college/university name, degree program, department, graduation year, target career path (e.g. Data Engineer, Full Stack Developer, AI/ML Specialist), and self-reported skills.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-cyan-400" />
                  C. Learning, Diagnostic & Interview Assessment Data
                </h3>
                <p className="text-xs sm:text-sm">
                  Diagnostic quiz responses, completed learning milestones, mock interview practice transcripts, code submissions, and readiness score assessments generated as you progress through skill tracks.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border/70 bg-card/40 space-y-1.5">
                <h3 className="font-semibold text-foreground text-sm flex items-center gap-2">
                  <CheckCircle2 className="size-4 text-cyan-400" />
                  D. Device & Technical Log Data
                </h3>
                <p className="text-xs sm:text-sm">
                  Browser user-agent, operating system, IP address (hashed for telemetry), and session timestamps to protect the application from abusive traffic and ensure high availability.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">3.</span> How We Use Your Information
            </h2>
            <p>We process your personal information strictly for legitimate educational and service purposes:</p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs sm:text-sm">
              <li>To provide seamless single sign-on (SSO) and account security via Google Authentication.</li>
              <li>To generate customized skill roadmaps and personalized curriculum recommendations tailored to your selected target career.</li>
              <li>To power the <strong>SPAR AI Career Coach</strong>, delivering context-aware interview guidance, resume advice, and next best learning actions.</li>
              <li>To compute your objective <strong>Placement Readiness Score</strong> (0–100%) and identify skill strengths and gaps.</li>
              <li>To allow verified college placement coordinators to view aggregate batch diagnostic readiness (without exposing private credentials).</li>
              <li>To protect against fraudulent access, abuse, and system downtime.</li>
            </ul>
          </section>

          {/* Section 4 - CRITICAL FOR GOOGLE OAUTH */}
          <section className="space-y-4 p-5 sm:p-6 rounded-2xl border border-cyan-500/30 bg-card/60">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">4.</span> Google User Data: Strict Limited Use & Non-Disclosure
            </h2>
            <p className="text-xs sm:text-sm">
              SPAR AI values student privacy. Our application requests only basic Google OAuth scopes (<code>openid</code>, <code>email</code>, and <code>profile</code>).
            </p>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Commercial Sale:</strong> We never sell, rent, or trade Google user data to third-party data brokers, marketers, or advertisers.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Targeted Advertising:</strong> We never use Google user data to serve or optimize advertisements.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>No Unauthorized Model Training:</strong> We do not use Google user data to train generalized AI foundation models without explicit consent.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Human Review Restrictions:</strong> Human employees or contractors do not read your raw user data unless you provide explicit permission for technical support, it is necessary for security investigations, or it is required by law.</span>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">5.</span> AI Processing & Cloud Infrastructure
            </h2>
            <p>
              SPAR AI utilizes enterprise cloud services, including <strong>Amazon Web Services (AWS)</strong> Bedrock and secure managed database clusters located in compliant regional cloud zones (e.g. AWS ap-south-1).
            </p>
            <p>
              All interactions with AI models are executed under private enterprise terms that guarantee:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-xs sm:text-sm">
              <li>Your learning queries and prompts are <strong>not</strong> retained for foundational model retraining.</li>
              <li>Data in transit is encrypted using <strong>TLS 1.3</strong>; data at rest is encrypted with <strong>AES-256</strong>.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">6.</span> Student Privacy & Recruiter Anonymity Guarantee
            </h2>
            <p>
              SPAR AI enforces a strict student consent mechanism for employer interactions:
            </p>
            <p>
              Your contact details (phone, personal email, street address) remain <strong>completely anonymized and masked</strong> on institutional and recruiter dashboards until you explicitly review an opportunity invitation and click <em>"I'm Interested"</em> to share your verified profile.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">7.</span> Data Retention & Your Rights (Data Deletion)
            </h2>
            <p>
              You maintain full control over your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-xs sm:text-sm">
              <li><strong>Right of Access & Export:</strong> You may request a copy of your stored learning achievements and profile data at any time.</li>
              <li><strong>Right to Deletion / "Right to be Forgotten":</strong> You may request permanent deletion of your SPAR AI account and associated assessment data by contacting our Privacy Team at{" "}
                <a href="mailto:privacy@sparai.in" className="text-cyan-500 underline font-semibold">
                  privacy@sparai.in
                </a>. Upon receipt, your account data will be permanently wiped from our active databases within 30 days.</li>
              <li><strong>Revoking Google Permissions:</strong> You can disconnect SPAR AI's access to your Google account at any time via{" "}
                <a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer" className="text-cyan-500 underline inline-flex items-center gap-0.5">
                  Google Account Permissions
                  <ExternalLink className="size-3" />
                </a>.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">8.</span> Cookies & Tracking Technologies
            </h2>
            <p>
              We use strictly necessary session cookies and local storage tokens exclusively to maintain your authenticated login state across sessions. We do not employ third-party tracking pixels or behavioral advertising cookies.
            </p>
          </section>

          {/* Section 9 */}
          <section className="space-y-3">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">9.</span> Policy Updates
            </h2>
            <p>
              We may update this Privacy Policy periodically to reflect new features, regulations, or cloud infrastructure enhancements. If material changes are made, we will notify users through an in-app banner or via email. The "Last updated" date at the top of this document indicates when revisions were published.
            </p>
          </section>

          {/* Section 10 */}
          <section className="space-y-3 pt-4 border-t border-border/60">
            <h2 className="font-display text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
              <span className="text-cyan-500">10.</span> Contact Our Privacy Officer
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our compliance with Google API Services User Data Policies, please contact us:
            </p>
            <div className="p-4 rounded-xl border border-border bg-card/50 space-y-1 text-xs sm:text-sm">
              <p><strong>SPAR AI Legal & Privacy Team</strong></p>
              <p className="flex items-center gap-2">
                <Mail className="size-4 text-cyan-400" />
                Email: <a href="mailto:privacy@sparai.in" className="text-cyan-500 underline font-medium">privacy@sparai.in</a> / <a href="mailto:support@sparai.in" className="text-cyan-500 underline font-medium">support@sparai.in</a>
              </p>
              <p>Application: <strong>SPAR AI Career Intelligence</strong></p>
              <p>Production Pilot: <a href="https://pilot.d2lm8cknxaono.amplifyapp.com" className="text-cyan-500 underline">https://pilot.d2lm8cknxaono.amplifyapp.com</a></p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
