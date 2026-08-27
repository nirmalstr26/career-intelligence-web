import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Globe,
  MapPin,
  Mail,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { careerai } from "@/lib/careerai/client";

export const Route = createFileRoute("/recruiter/register")({
  component: RecruiterRegisterPage,
});

function RecruiterRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("Technical Recruiter");
  const [website, setWebsite] = useState("");
  const [location, setLocation] = useState("San Francisco, CA");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !companyName) return;

    setIsSubmitting(true);
    try {
      await careerai.registerRecruiter({
        name,
        email,
        company_name: companyName,
        job_title: jobTitle,
        company_website: website || undefined,
        hiring_location: location,
      });
      setSuccess(true);
      setTimeout(() => {
        void navigate({ to: "/recruiter/dashboard" });
      }, 1200);
    } catch (err) {
      console.error("Failed to register recruiter:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
          <ShieldCheck className="size-3.5" />
          Verified Employer Program
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground">
          Recruiter & Hiring Portal
        </h2>
        <p className="text-xs text-muted-foreground">
          Access verified engineering student talent with deterministic capability matching and explicit student consent.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="surface-panel rounded-3xl p-8 border border-border/80 bg-card shadow-xl space-y-6">
          {success ? (
            <div className="text-center py-8 space-y-3 animate-in zoom-in-95">
              <div className="size-12 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Account Approved for Pilot!</h3>
              <p className="text-xs text-muted-foreground">
                Redirecting to your Recruiter Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <User className="size-3 text-muted-foreground" /> Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Priya Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Mail className="size-3 text-muted-foreground" /> Work Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="priya@acmedatalabs.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Building2 className="size-3 text-muted-foreground" /> Company Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Acme Data Labs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Briefcase className="size-3 text-muted-foreground" /> Job Title
                  </label>
                  <input
                    type="text"
                    placeholder="Principal Technical Recruiter"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <Globe className="size-3 text-muted-foreground" /> Company Website
                  </label>
                  <input
                    type="url"
                    placeholder="https://acmedatalabs.com"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-foreground flex items-center gap-1">
                    <MapPin className="size-3 text-muted-foreground" /> Hiring Location
                  </label>
                  <input
                    type="text"
                    placeholder="San Francisco, CA / Remote"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/[0.03] p-4 text-[11px] text-muted-foreground leading-relaxed">
                <strong className="text-foreground block font-semibold mb-0.5 flex items-center gap-1">
                  <Lock className="size-3 text-primary" /> Privacy & Student Consent Guarantee
                </strong>
                SPAR protects student privacy. Candidate names and contact details remain anonymized until the candidate explicitly reviews and opts into your opportunity invitation.
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full text-xs font-semibold py-2.5 gap-2"
              >
                {isSubmitting ? "Registering..." : "Access Recruiter Portal"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
