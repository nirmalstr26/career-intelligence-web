import { Compass, LineChart, Rocket } from "lucide-react";
import { CareerInsight } from "@/components/career/CareerInsight";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Compass,
    title: "Discover your path",
    body: "AI matches your skills, interests, and goals to the right careers.",
  },
  {
    icon: LineChart,
    title: "Track readiness",
    body: "Real-time insight on skills, strengths, and improvement areas.",
  },
  {
    icon: Rocket,
    title: "Get placement ready",
    body: "Personalized roadmaps, practice, and resources to crack top opportunities.",
  },
];

export function FeatureHighlights({ className }: { className?: string }) {
  return (
    <ul className={cn("space-y-5 sm:space-y-6", className)}>
      {FEATURES.map((f) => (
        <li key={f.title}>
          <CareerInsight {...f} />
        </li>
      ))}
    </ul>
  );
}
