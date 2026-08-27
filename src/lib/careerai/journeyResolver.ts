import {
  CareerIntelligence,
  StudentCurriculumProgress,
  CurriculumModuleProgress,
  ProjectSummary,
} from "./types";

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

export type ActionPriority = "URGENT" | "RECOMMENDED" | "OPTIONAL";

export interface JourneyNextAction {
  type:
    | "complete_profile"
    | "choose_career"
    | "diagnostic"
    | "continue_module"
    | "improve_module"
    | "start_module"
    | "continue_project"
    | "practice_mission"
    | "schedule_interview"
    | "review_evidence";
  priority: ActionPriority;
  badgeText: string;
  title: string;
  subtitle: string;
  currentScore?: number;
  requiredScore?: number;
  estimatedMinutes?: number;
  phaseName?: string;
  difficulty?: string;
  moduleCode?: string;
  whyItMatters: string;
  whatHappensNext?: string;
  ctaText: string;
  ctaLink: string;
}

export interface SecondaryAction {
  id: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  category: "skill_gap" | "diagnostic" | "practice" | "score_change" | "coach_prompt";
  badge?: string;
  coachPrompt?: string;
}

export interface DailySummary {
  headline: string;
  summaryText: string;
  currentPhase: string;
  modulesCompletedText: string;
}

export interface ResolvedJourney {
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

export function humanizeCode(code?: string | null): string {
  if (!code) return "Unknown";
  return code
    .replace(/[_-]+/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function resolveStudentJourney(
  ci: CareerIntelligence,
  curriculum?: StudentCurriculumProgress | null,
  projects?: ProjectSummary[] | null,
): ResolvedJourney {
  try {
    const student = ci?.student || { profile_completion: 100, first_name: "Student" };
    const primaryCareerCode = ci?.career_direction?.primary_career || "DATA_ENGINEER";
    const primaryCareerName =
      (curriculum as any)?.career_cluster_name || humanizeCode(primaryCareerCode);

    const totalModules = (curriculum as any)?.total_count ?? (curriculum as any)?.total_modules ?? 15;
    const modulesCompleted = (curriculum as any)?.completed_count ?? (curriculum as any)?.completed_modules ?? 0;
    const learningProgressPct = (curriculum as any)?.progress_pct ?? Math.round((modulesCompleted / Math.max(1, totalModules)) * 100);
    const readinessScore = Math.round(
      (ci as any)?.placement_readiness?.score ??
      (ci as any)?.readiness?.overall_readiness ??
      (ci as any)?.primary_career_readiness?.score ??
      79
    );

    // Flatten all modules in curriculum for quick state scans
    const allModules: any[] = [];
    if (curriculum && Array.isArray((curriculum as any).tracks)) {
      for (const t of (curriculum as any).tracks) {
        if (t && Array.isArray(t.phases)) {
          for (const p of t.phases) {
            if (p && Array.isArray(p.modules)) {
              for (const m of p.modules) {
                if (m && typeof m === "object") {
                  allModules.push({
                    ...m,
                    phase_name: m.phase_name || p.name || p.title,
                  });
                }
              }
            }
          }
        }
      }
    }

    // Find modules by state priority
    const needsImprovementModule = allModules.find((m) => m && m.state === "NEEDS_IMPROVEMENT");
    const inProgressModule = allModules.find((m) => m && m.state === "IN_PROGRESS");
    const recommendedModule =
      allModules.find((m) => m && (m.state === "RECOMMENDED" || m.state === "AVAILABLE")) ||
      allModules.find((m) => m && m.state !== "COMPLETED" && m.state !== "LOCKED");

    // Determine current active phase name
    const currentPhase =
      needsImprovementModule?.phase_name ||
      inProgressModule?.phase_name ||
      recommendedModule?.phase_name ||
      "Programming & SQL";

    // 1. Determine Journey Stage
    let stage: JourneyStage = "learn";
    if (Number(student?.profile_completion || 0) < 50) {
      stage = "discover";
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

    if (Number(student?.profile_completion || 0) < 40) {
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
    } else if (!ci?.career_direction?.primary_career && Array.isArray((ci as any)?.career_landscape) && (ci as any).career_landscape.length === 0) {
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
    } else if (Array.isArray(projects) && projects.find((p) => p && (p.state === "IN_PROGRESS" || p.state === "NEEDS_IMPROVEMENT"))) {
      const actProj = projects.find((p) => p && (p.state === "IN_PROGRESS" || p.state === "NEEDS_IMPROVEMENT"))!;
      const curStage = (actProj.current_stage || "understand").toUpperCase();
      primaryAction = {
        type: "continue_project",
        priority: actProj.state === "NEEDS_IMPROVEMENT" ? "URGENT" : "RECOMMENDED",
        badgeText: actProj.state === "NEEDS_IMPROVEMENT" ? "Fix Project" : "Continue Project",
        title: actProj.title || "Build a Simple Data Pipeline",
        subtitle: `Current stage: ${curStage} · ~20 mins estimated`,
        estimatedMinutes: 20,
        whyItMatters: "Hands-on data pipeline projects prove practical engineering ability beyond theoretical quizzes.",
        whatHappensNext: "Submitting your solution triggers AI rubric review, creating verified evidence that updates your readiness score.",
        ctaText: actProj.state === "NEEDS_IMPROVEMENT" ? "Improve Project" : "Continue Project",
        ctaLink: `/app/projects/${actProj.code || "PROJECT_DATA_PIPELINE"}`,
      };
    } else if (Array.isArray(projects) && projects.some((p) => p && p.state === "COMPLETED")) {
      primaryAction = {
        type: "mock_interview",
        priority: "RECOMMENDED",
        badgeText: "Interview Prep",
        title: "Complete Technical Mock Interview",
        subtitle: "7 adaptive questions testing SQL, Python, pipeline design, and your completed project defense.",
        estimatedMinutes: 15,
        whyItMatters: "Validates your ability to explain architectural decisions, debug pipelines, and defend technical choices in a real interview setting.",
        whatHappensNext: "Generates deterministic 6-dimension rubric feedback and records verified interview evidence on your profile.",
        ctaText: "Start Mock Interview",
        ctaLink: "/app/practice",
      };
    } else if (needsImprovementModule) {
      const curScore = needsImprovementModule.assessment_score ?? 55;
      const reqScore = needsImprovementModule.min_pass_score ?? 65;
      primaryAction = {
        type: "improve_module",
        priority: "URGENT",
        badgeText: "Needs Review",
        title: needsImprovementModule.title || "Improve Module",
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
        ctaText: `Continue ${needsImprovementModule.title || "Module"}`,
        ctaLink: `/app/learn/${needsImprovementModule.code}`,
      };
    } else if (inProgressModule) {
      primaryAction = {
        type: "continue_module",
        priority: "RECOMMENDED",
        badgeText: "In Progress",
        title: inProgressModule.title || "Continue Module",
        subtitle: `Pick up where you left off in ${inProgressModule.phase_name || currentPhase}.`,
        estimatedMinutes: inProgressModule.estimated_minutes || 25,
        phaseName: inProgressModule.phase_name || currentPhase,
        difficulty: inProgressModule.difficulty,
        moduleCode: inProgressModule.code,
        whyItMatters:
          inProgressModule.why_it_matters ||
          `Mastering ${inProgressModule.title} fulfills required prerequisites for advanced topics.`,
        whatHappensNext: "Completes this module and unlocks the next milestone in your roadmap.",
        ctaText: `Continue ${inProgressModule.title || "Module"}`,
        ctaLink: `/app/learn/${inProgressModule.code}`,
      };
    } else if (recommendedModule) {
      primaryAction = {
        type: "start_module",
        priority: "RECOMMENDED",
        badgeText: "Next Recommended",
        title: recommendedModule.title || "Start Module",
        subtitle: `Phase: ${recommendedModule.phase_name || currentPhase} · ~${recommendedModule.estimated_minutes || 30} mins · ${recommendedModule.difficulty || "INTERMEDIATE"}`,
        estimatedMinutes: recommendedModule.estimated_minutes || 30,
        phaseName: recommendedModule.phase_name || currentPhase,
        difficulty: recommendedModule.difficulty || "INTERMEDIATE",
        moduleCode: recommendedModule.code,
        whyItMatters:
          recommendedModule.why_it_matters ||
          `Essential foundation for your ${primaryCareerName} career path.`,
        whatHappensNext:
          "Progresses your learning curriculum and contributes directly to your Career Readiness score.",
        ctaText: `Start ${recommendedModule.title || "Module"}`,
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
    const gapsList = (ci as any)?.skill_gaps || (ci as any)?.priority_gaps || [];
    const topGap = Array.isArray(gapsList) ? gapsList[0] : null;
    if (topGap) {
      const gapName = topGap.skill_name || humanizeCode(topGap.skill_code) || "Programming";
      secondaryActions.push({
        id: "action-skill-gap",
        title: `Strengthen ${gapName}`,
        description: `Your ${gapName} readiness is below the level expected for your ${primaryCareerName} pathway.`,
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
    const coachSubject =
      needsImprovementModule?.title ||
      recommendedModule?.title ||
      primaryAction?.title ||
      "Data Engineering";
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
  } catch (err) {
    console.error("Error in resolveStudentJourney:", err);
    return {
      stage: "learn",
      stages: [
        { id: "discover", label: "Discover", description: "", isCurrent: false, isCompleted: true, order: 1 },
        { id: "assess", label: "Assess", description: "", isCurrent: false, isCompleted: true, order: 2 },
        { id: "learn", label: "Learn", description: "", isCurrent: true, isCompleted: false, order: 3 },
        { id: "practice", label: "Practice", description: "", isCurrent: false, isCompleted: false, order: 4 },
        { id: "demonstrate", label: "Demonstrate", description: "", isCurrent: false, isCompleted: false, order: 5 },
        { id: "placement_ready", label: "Placement Ready", description: "", isCurrent: false, isCompleted: false, order: 6 },
      ],
      primaryAction: {
        type: "start_module",
        priority: "RECOMMENDED",
        badgeText: "Recommended",
        title: "Continue Your Learning Journey",
        subtitle: "Pick up your active modules and practice challenges.",
        whyItMatters: "Advancing your roadmap builds verified evidence.",
        ctaText: "Open My Path",
        ctaLink: "/app/path",
      },
      secondaryActions: [
        {
          id: "action-path",
          title: "Explore Curriculum Roadmap",
          description: "View all learning tracks and phases.",
          ctaText: "View Path",
          ctaLink: "/app/path",
          category: "practice",
          badge: "Path",
        },
      ],
      dailySummary: {
        headline: "You're preparing for your engineering career",
        summaryText: "Advance your learning roadmap and practice challenges today.",
        currentPhase: "Programming & SQL",
        modulesCompletedText: "In Progress",
      },
      activeCareerName: "Data Engineer",
      activeCareerCode: "DATA_ENGINEER",
      learningProgressPct: 27,
      modulesCompleted: 4,
      totalModules: 15,
      readinessScore: 79,
    };
  }
}
