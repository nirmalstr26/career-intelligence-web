import type {
  CareerIntelligence,
  CurriculumData,
  CurriculumModule,
} from "@/lib/careerai/types";

export type JourneyStage =
  | "discover"
  | "assess"
  | "learn"
  | "practice"
  | "demonstrate"
  | "placement_ready";

export interface JourneyStageInfo {
  id: JourneyStage;
  label: string;
  description: string;
  isCurrent: boolean;
  isCompleted: boolean;
  order: number;
}

export interface JourneyNextAction {
  type:
    | "complete_profile"
    | "choose_career"
    | "take_diagnostic"
    | "improve_module"
    | "continue_module"
    | "start_module"
    | "complete_assessment"
    | "practice_mission"
    | "explore_projects";
  priority: "URGENT" | "RECOMMENDED" | "NEXT_UP";
  badgeText: string;
  title: string;
  subtitle: string;
  whyItMatters: string;
  whatHappensNext?: string;
  ctaText: string;
  ctaLink: string;
  currentScore?: number;
  requiredScore?: number;
  estimatedMinutes?: number;
  phaseName?: string;
  difficulty?: string;
  moduleCode?: string;
}

export interface SecondaryAction {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  category: "skill_gap" | "score_change" | "coach_prompt" | "practice";
  badge?: string;
  coachPrompt?: string;
}

export interface DailySummary {
  headline: string;
  summaryText: string;
  currentPhase: string;
  modulesCompletedText: string;
}

export interface ResolvedStudentJourney {
  stage: JourneyStage;
  stages: JourneyStageInfo[];
  primaryAction: JourneyNextAction;
  secondaryActions: SecondaryAction[];
  dailySummary: DailySummary;
  activeCareerName: string;
  activeCareerCode: string;
  learningProgressPct: number;
  modulesCompleted: number;
  totalModules: number;
  readinessScore: number;
}

/**
 * Deterministic Journey State Resolver
 * Computes the student's exact "where am I, what should I do next, and why"
 * using their real profile, career intelligence signals, and curriculum data.
 */
export function resolveStudentJourney(
  ci: CareerIntelligence,
  curr?: CurriculumData,
): ResolvedStudentJourney {
  const student = ci.student;
  const primaryCareerCode = ci.career_direction.primary_career || "DATA_ENGINEER";
  const primaryCareerName = curr?.career_cluster_name || "Data Engineer";

  const totalModules = curr?.total_count ?? 15;
  const modulesCompleted = curr?.completed_count ?? 0;
  const learningProgressPct = curr?.progress_pct ?? 0;
  const readinessScore = ci.placement_readiness?.score ?? 70;

  // Flatten all modules in curriculum for quick state scans
  const allModules: CurriculumModule[] = [];
  if (curr?.tracks) {
    for (const t of curr.tracks) {
      for (const p of t.phases) {
        for (const m of p.modules) {
          allModules.push(m);
        }
      }
    }
  }

  // Find modules by state priority
  const needsImprovementModule = allModules.find((m) => m.state === "NEEDS_IMPROVEMENT");
  const inProgressModule = allModules.find((m) => m.state === "IN_PROGRESS");
  const recommendedModule =
    curr?.current_module ??
    curr?.next_available?.[0] ??
    allModules.find((m) => m.state === "RECOMMENDED" || m.state === "AVAILABLE");

  // Determine current active phase name
  const currentPhase =
    needsImprovementModule?.phase_name ||
    inProgressModule?.phase_name ||
    recommendedModule?.phase_name ||
    curr?.tracks?.[0]?.phases?.[0]?.name ||
    "Foundations & Technology";

  // 1. Determine Journey Stage
  let stage: JourneyStage = "learn";
  if (student.profile_completion < 50) {
    stage = "discover";
  } else if (!ci.placement_readiness && ci.career_landscape.length === 0) {
    stage = "assess";
  } else if (modulesCompleted >= totalModules * 0.8 && readinessScore >= 85) {
    stage = "placement_ready";
  } else if (modulesCompleted >= totalModules * 0.6) {
    stage = "demonstrate";
  } else if (modulesCompleted >= totalModules * 0.3) {
    stage = "practice";
  } else {
    stage = "learn";
  }

  const STAGE_CONFIG: Array<{ id: JourneyStage; label: string; desc: string }> = [
    { id: "discover", label: "Discover", desc: "Map your natural strengths and interests" },
    { id: "assess", label: "Assess", desc: "Diagnostic evaluation of your baseline" },
    { id: "learn", label: "Learn", desc: "Structured core curriculum & foundations" },
    { id: "practice", label: "Practice", desc: "Hands-on coding challenges & quizzes" },
    { id: "demonstrate", label: "Demonstrate", desc: "Real-world portfolio projects & evidence" },
    { id: "placement_ready", label: "Placement Ready", desc: "Interview simulation & job readiness" },
  ];

  const currentStageIndex = STAGE_CONFIG.findIndex((s) => s.id === stage);
  const stages: JourneyStageInfo[] = STAGE_CONFIG.map((s, idx) => ({
    id: s.id,
    label: s.label,
    description: s.desc,
    isCurrent: s.id === stage,
    isCompleted: idx < currentStageIndex,
    order: idx + 1,
  }));

  // 2. Determine Single Primary Next Action
  let primaryAction: JourneyNextAction;

  if (student.profile_completion < 40) {
    primaryAction = {
      type: "complete_profile",
      priority: "URGENT",
      badgeText: "Profile Incomplete",
      title: "Complete Your Academic Profile",
      subtitle: "Add your degree, current year, and target graduation date.",
      whyItMatters:
        "Your academic details calibrate your preparation timeline and placement readiness metrics.",
      whatHappensNext: "Unlocks personalized skill benchmarks and verified readiness scoring.",
      ctaText: "Complete Profile",
      ctaLink: "/app/profile",
    };
  } else if (!ci.career_direction.primary_career && ci.career_landscape.length === 0) {
    primaryAction = {
      type: "choose_career",
      priority: "URGENT",
      badgeText: "Career Direction Needed",
      title: "Choose Your Primary Career Pathway",
      subtitle: "Select the career path you want to prepare for.",
      whyItMatters:
        "Every curriculum roadmap and practice challenge is tailored specifically to your target role.",
      whatHappensNext: "Your personalized track roadmap and AI Tutor context will be configured.",
      ctaText: "Select Career Path",
      ctaLink: "/app/path",
    };
  } else if (needsImprovementModule) {
    const curScore = needsImprovementModule.assessment_score ?? 55;
    const reqScore = needsImprovementModule.min_pass_score ?? 65;
    primaryAction = {
      type: "improve_module",
      priority: "URGENT",
      badgeText: "Needs Review",
      title: needsImprovementModule.title,
      subtitle:
        "You completed the learning content but need to improve your knowledge-check score before moving forward.",
      currentScore: curScore,
      requiredScore: reqScore,
      estimatedMinutes: 15,
      phaseName: needsImprovementModule.phase_name,
      difficulty: needsImprovementModule.difficulty,
      moduleCode: needsImprovementModule.code,
      whyItMatters:
        needsImprovementModule.why_it_matters ||
        `${needsImprovementModule.title} is a core competency for ${primaryCareerName} and is required before the next phase unlocks.`,
      whatHappensNext:
        "Passing with 65%+ unlocks downstream specialization modules and elevates your verified skill score.",
      ctaText: `Continue ${needsImprovementModule.title}`,
      ctaLink: `/app/learn/${needsImprovementModule.code}`,
    };
  } else if (inProgressModule) {
    primaryAction = {
      type: "continue_module",
      priority: "RECOMMENDED",
      badgeText: "In Progress",
      title: inProgressModule.title,
      subtitle: `Pick up where you left off in ${inProgressModule.phase_name}.`,
      estimatedMinutes: inProgressModule.estimated_minutes,
      phaseName: inProgressModule.phase_name,
      difficulty: inProgressModule.difficulty,
      moduleCode: inProgressModule.code,
      whyItMatters:
        inProgressModule.why_it_matters ||
        `Mastering ${inProgressModule.title} fulfills required prerequisites for advanced topics.`,
      whatHappensNext: "Completes this module and unlocks the next milestone in your roadmap.",
      ctaText: `Continue ${inProgressModule.title}`,
      ctaLink: `/app/learn/${inProgressModule.code}`,
    };
  } else if (recommendedModule) {
    primaryAction = {
      type: "start_module",
      priority: "RECOMMENDED",
      badgeText: "Next Recommended",
      title: recommendedModule.title,
      subtitle: `Phase: ${recommendedModule.phase_name} · ~${recommendedModule.estimated_minutes} mins · ${recommendedModule.difficulty}`,
      estimatedMinutes: recommendedModule.estimated_minutes,
      phaseName: recommendedModule.phase_name,
      difficulty: recommendedModule.difficulty,
      moduleCode: recommendedModule.code,
      whyItMatters:
        recommendedModule.why_it_matters ||
        `Essential foundation for your ${primaryCareerName} career path.`,
      whatHappensNext:
        "Progresses your learning curriculum and contributes directly to your Career Readiness score.",
      ctaText: `Start ${recommendedModule.title}`,
      ctaLink: `/app/learn/${recommendedModule.code}`,
    };
  } else {
    primaryAction = {
      type: "practice_mission",
      priority: "RECOMMENDED",
      badgeText: "Practice Challenge",
      title: "Strengthen Core Skill Benchmarks",
      subtitle: "Complete active skill missions and hands-on coding challenges.",
      whyItMatters: "Reinforces your practical application and proves placement readiness.",
      whatHappensNext: "Records verified evidence in your skill portfolio.",
      ctaText: "Go to Practice Hub",
      ctaLink: "/app/practice",
    };
  }

  // 3. Determine Up To 3 Derived Secondary Actions ("Also worth doing")
  const secondaryActions: SecondaryAction[] = [];

  // Secondary 1: Skill Gap
  const topGap = ci.skill_gaps?.[0];
  if (topGap) {
    secondaryActions.push({
      id: "action-skill-gap",
      title: `Strengthen ${topGap.skill_name || "Programming"}`,
      description: `Your ${topGap.skill_name || "Programming"} readiness is below the level expected for your ${primaryCareerName} pathway.`,
      ctaText: "Take 10-minute diagnostic",
      ctaLink: "/app/practice",
      category: "skill_gap",
      badge: "Skill Gap",
    });
  } else {
    secondaryActions.push({
      id: "action-diagnostic",
      title: "Test Your Applied Knowledge",
      description: "Verify your conceptual understanding with targeted skill challenges.",
      ctaText: "Open Practice Challenges",
      ctaLink: "/app/practice",
      category: "practice",
      badge: "Practice",
    });
  }

  // Secondary 2: Progress Review
  secondaryActions.push({
    id: "action-progress-review",
    title: "Review Your Progress",
    description: `Your Career Readiness is at ${readinessScore}/100 with ${modulesCompleted} of ${totalModules} modules completed.`,
    ctaText: "See what improved",
    ctaLink: "/app/progress",
    category: "score_change",
    badge: "Readiness",
  });

  // Secondary 3: Contextual SPAR Coach Prompt
  const coachSubject = needsImprovementModule?.title || recommendedModule?.title || "Data Engineering";
  secondaryActions.push({
    id: "action-spar-coach",
    title: "Ask SPAR Coach",
    description: `Ask why ${coachSubject} is currently your highest-priority topic.`,
    ctaText: "Talk to SPAR",
    ctaLink: `/app/coach?prompt=${encodeURIComponent(`Why is ${coachSubject} currently my highest-priority focus for becoming a ${primaryCareerName}?`)}`,
    category: "coach_prompt",
    badge: "AI Coach",
    coachPrompt: `Why is ${coachSubject} currently my highest-priority focus for becoming a ${primaryCareerName}?`,
  });

  // 4. Generate Personalized Daily Summary
  let summaryText = "";
  if (needsImprovementModule) {
    summaryText = `You're making steady progress on your ${primaryCareerName} foundation (${modulesCompleted} of ${totalModules} modules completed). ${needsImprovementModule.title} is currently the primary focus area preventing the next phase from unlocking. Spend ~15 minutes reviewing the concepts and retrying the knowledge check today.`;
  } else if (inProgressModule) {
    summaryText = `You're actively working through ${inProgressModule.title} in the ${currentPhase} phase. Completing this module will bring your learning roadmap to ${Math.round(((modulesCompleted + 1) / totalModules) * 100)}% completion.`;
  } else {
    summaryText = `You're on track in your ${primaryCareerName} pathway with ${modulesCompleted} of ${totalModules} modules completed and a Career Readiness score of ${readinessScore}/100. Today's priority is advancing ${recommendedModule?.title || "your foundational modules"}.`;
  }

  const dailySummary: DailySummary = {
    headline: `You're preparing to become a ${primaryCareerName}`,
    summaryText,
    currentPhase,
    modulesCompletedText: `${modulesCompleted} of ${totalModules} modules completed`,
  };

  return {
    stage,
    stages,
    primaryAction,
    secondaryActions: secondaryActions.slice(0, 3),
    dailySummary,
    activeCareerName: primaryCareerName,
    activeCareerCode: primaryCareerCode,
    learningProgressPct,
    modulesCompleted,
    totalModules,
    readinessScore,
  };
}
