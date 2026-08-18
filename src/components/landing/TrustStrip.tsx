import { Brain, Lock, Users } from "lucide-react";
import { CareerInsight } from "@/components/career/CareerInsight";

const TRUST = [
  {
    icon: Users,
    title: "Built for students",
    body: "Designed for college students to grow, improve, and achieve more.",
  },
  {
    icon: Brain,
    title: "AI career intelligence",
    body: "Smart models that understand you and guide you to the right opportunities.",
  },
  {
    icon: Lock,
    title: "Private & secure",
    body: "Your data is protected with enterprise-grade, privacy-first practices.",
  },
];

export function TrustStrip() {
  return (
    <section
      aria-label="Why CareerAI"
      className="surface-panel grid gap-8 rounded-3xl p-6 sm:p-8 md:grid-cols-3 md:gap-10"
    >
      {TRUST.map((t) => (
        <CareerInsight key={t.title} {...t} />
      ))}
    </section>
  );
}
