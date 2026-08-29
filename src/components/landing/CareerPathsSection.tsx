import React from "react";
import { Database, Brain, Code2, Shield, Cloud, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { trackLandingEvent } from "@/lib/analytics/landingEvents";

interface CareerPath {
  id: string;
  title: string;
  category: string;
  description: string;
  skills: string[];
  status: "Full Guided Path" | "Explore Career";
  icon: React.ElementType;
  iconColor: string;
}

const CAREER_PATHS: CareerPath[] = [
  {
    id: "data_engineer",
    title: "Data Engineer",
    category: "Data & Systems",
    description: "Design, build, and scale distributed ETL/ELT pipelines, lakehouse architectures, and real-time streaming infrastructure.",
    skills: ["SQL", "Python", "Apache Spark", "Airflow", "Data Modeling"],
    status: "Full Guided Path",
    icon: Database,
    iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
  },
  {
    id: "ai_engineer",
    title: "AI / Machine Learning Engineer",
    category: "Artificial Intelligence",
    description: "Train, evaluate, and deploy deep learning models, LLM agents, RAG architectures, and scalable inference APIs.",
    skills: ["PyTorch", "Transformers", "RAG", "LangChain", "Model Serving"],
    status: "Full Guided Path",
    icon: Brain,
    iconColor: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    id: "software_engineer",
    title: "Software Engineer",
    category: "Software Development",
    description: "Build robust full-stack web applications, microservices, performant APIs, and distributed database systems.",
    skills: ["TypeScript", "Python/Go", "PostgreSQL", "System Design", "Docker"],
    status: "Full Guided Path",
    icon: Code2,
    iconColor: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  },
  {
    id: "cloud_devops",
    title: "Cloud & DevOps Engineer",
    category: "Cloud Infrastructure",
    description: "Automate cloud deployments, Kubernetes cluster orchestration, CI/CD pipelines, and infrastructure as code.",
    skills: ["AWS", "Kubernetes", "Terraform", "CI/CD", "Linux"],
    status: "Explore Career",
    icon: Cloud,
    iconColor: "text-teal-400 bg-teal-500/10 border-teal-500/20",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity Analyst",
    category: "Information Security",
    description: "Protect systems and networks against vulnerabilities, conduct threat hunting, and implement zero-trust security postures.",
    skills: ["Network Security", "Penetration Testing", "SIEM", "Cryptography"],
    status: "Explore Career",
    icon: Shield,
    iconColor: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  },
  {
    id: "data_analyst",
    title: "Data Analyst",
    category: "Data & BI",
    description: "Transform complex operational datasets into executive dashboards, business insights, and statistical predictive models.",
    skills: ["SQL", "Tableau/PowerBI", "Python Pandas", "Business Intelligence"],
    status: "Full Guided Path",
    icon: BarChart3,
    iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
];

export function CareerPathsSection() {
  const handleCardClick = (title: string) => {
    trackLandingEvent("CAREER_PATH_EXPLORED", { career: title });
    const authCard = document.getElementById("auth-card");
    if (authCard) {
      authCard.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="careers" className="my-16 scroll-mt-24 space-y-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 flex items-center justify-center gap-1.5">
          <Sparkles className="size-3.5" />
          SUPPORTED CAREER DIRECTIONS
        </span>
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl">
          Explore where SPAR can{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            take you.
          </span>
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Each path includes curated competency roadmaps, verified skill assessments, hands-on project artifacts, and interview coaching.
        </p>
      </div>

      {/* Grid of Career Paths */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CAREER_PATHS.map((path) => {
          const Icon = path.icon;
          return (
            <div
              key={path.id}
              onClick={() => handleCardClick(path.title)}
              className="surface-panel group relative rounded-3xl p-6 sm:p-7 border border-border/80 bg-card/60 backdrop-blur-xl shadow-lg cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-2xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`grid size-11 place-items-center rounded-2xl border ${path.iconColor}`}>
                    <Icon className="size-5" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold ${
                      path.status === "Full Guided Path"
                        ? "border-cyan-500/40 text-cyan-300 bg-cyan-950/40"
                        : "border-border text-muted-foreground bg-secondary/80"
                    }`}
                  >
                    {path.status}
                  </Badge>
                </div>

                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {path.category}
                </span>

                <h3 className="font-display text-lg font-bold text-foreground group-hover:text-cyan-400 transition-colors mt-0.5">
                  {path.title}
                </h3>

                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {path.description}
                </p>

                {/* Skill Pills */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg bg-surface/80 border border-border/60 px-2 py-0.5 text-[10px] font-medium text-foreground/80"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:underline">
                <span>Start Path Diagnostic</span>
                <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
