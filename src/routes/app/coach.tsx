import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  Bot,
  User,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Compass,
  Zap,
  Target,
  Clock,
  Layers,
} from "lucide-react";
import { useCareerIntelligence, useCurriculum, useStudentId } from "@/lib/careerai/hooks";
import { careerai } from "@/lib/careerai/client";
import { AgentReply, RecommendedAction } from "@/lib/careerai/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { humanizeCode } from "@/lib/utils";
import { MarkdownRenderer } from "@/components/common/MarkdownRenderer";

export const Route = createFileRoute("/app/coach")({
  validateSearch: (search: Record<string, unknown>) => ({
    prompt: typeof search.prompt === "string" ? search.prompt : undefined,
    moduleCode: typeof search.moduleCode === "string" ? search.moduleCode : undefined,
  }),
  component: CoachPage,
});

interface Message {
  role: "user" | "assistant";
  content: string;
  referencedCareers?: string[];
  referencedSkills?: string[];
  recommendedAction?: RecommendedAction | null;
}

function CoachPage() {
  const { prompt, moduleCode } = Route.useSearch();
  const navigate = useNavigate();
  const studentId = useStudentId();
  const ciQuery = useCareerIntelligence();
  const ci = ciQuery.data;
  const primaryCareerCode = ci?.career_direction?.primary_career ?? "DATA_ENGINEER";
  const currQuery = useCurriculum(primaryCareerCode);
  const curr = currQuery.data;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(prompt || "");
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string | undefined>(undefined);
  const initializedPrompt = useRef(false);

  // Load conversation history on mount
  useEffect(() => {
    if (!studentId || historyLoaded) return;
    careerai
      .getLatestConversation(studentId)
      .then((history) => {
        if (history && history.messages && history.messages.length > 0) {
          conversationId.current = history.conversation_id;
          const loadedMsgs: Message[] = history.messages.map((m) => {
            const meta = m.message_metadata || {};
            return {
              role: m.role.toLowerCase() === "user" ? "user" : "assistant",
              content: m.content,
              referencedCareers: meta.referenced_careers,
              referencedSkills: meta.referenced_skills,
              recommendedAction: meta.recommended_action,
            };
          });
          setMessages(loadedMsgs);
        }
        setHistoryLoaded(true);
      })
      .catch(() => setHistoryLoaded(true));
  }, [studentId, historyLoaded]);

  // Handle URL pre-seeded prompt
  useEffect(() => {
    if (prompt && !initializedPrompt.current && historyLoaded) {
      initializedPrompt.current = true;
      void handleSend(prompt);
    }
  }, [prompt, historyLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text?: string) {
    const messageToSend = text || input;
    if (!messageToSend.trim() || loading || !studentId) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: messageToSend }]);
    setLoading(true);

    try {
      const reply: AgentReply = await careerai.chat({
        student_id: studentId,
        message: messageToSend,
        conversation_id: conversationId.current,
      });

      if (reply.conversation_id) {
        conversationId.current = reply.conversation_id;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.message,
          referencedCareers: reply.referenced_careers,
          referencedSkills: reply.referenced_skills,
          recommendedAction: reply.recommended_action,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I ran into a temporary issue retrieving that insight. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(action: RecommendedAction) {
    if (action.type === "MODULE" && action.target) {
      void navigate({ to: `/app/learn/${action.target}` });
    } else if (action.type === "DIAGNOSTIC") {
      void navigate({ to: "/app/diagnostic" });
    } else if (action.type === "PRACTICE") {
      void navigate({ to: "/app/practice" });
    } else if (action.type === "CAREER_PATH") {
      void navigate({ to: "/app/path" });
    } else {
      void navigate({ to: "/app/path" });
    }
  }

  const STARTER_ACTIONS = [
    { title: "Plan My Day", desc: "Give me an optimal 30-minute study session plan.", query: "What should I focus on for 30 minutes today?" },
    { title: "Explain My Gap", desc: "Why is Spark my biggest remaining skill gap?", query: "Why is Apache Spark my biggest remaining skill gap and how do I close it?" },
    { title: "Practice With Me", desc: "Quiz me on SQL joins and window aggregations.", query: "Quiz me on SQL window functions and subquery aggregations." },
    { title: "Placement Fit", desc: "Am I ready to apply for Data Engineering internships?", query: "Am I ready to apply for Data Engineer internships? What are my strongest evidence signals?" },
  ];

  return (
    <div className="flex h-[calc(100vh-130px)] flex-col gap-3 animate-in fade-in-50 duration-300">
      {/* Contextual Header */}
      <header className="surface-panel rounded-3xl p-4 sm:p-5 border border-border/80 bg-card shadow-sm space-y-3 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="font-display text-xl sm:text-2xl font-bold flex items-center gap-2 text-foreground">
              <Sparkles className="size-5 text-primary" />
              SPAR AI Career Coach
            </h1>
            <p className="text-xs text-muted-foreground">
              Grounded conversational guidance, real-time code tutoring, and evidence-driven next steps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 text-xs">
              Path: {curr?.career_cluster_name || "Data Engineer"}
            </Badge>
            <Badge variant="outline" className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30 text-xs">
              Readiness: {ci?.placement_readiness?.score ?? 78}/100
            </Badge>
          </div>
        </div>

        {/* Compact Persistent Context Strip: What SPAR Knows About You */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/60 text-[11px]">
          <div className="p-2 rounded-xl border bg-secondary/15">
            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Current Focus</span>
            <strong className="text-foreground truncate block">SQL Fundamentals (82%)</strong>
          </div>

          <div className="p-2 rounded-xl border bg-secondary/15">
            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Top Verified Skill</span>
            <strong className="text-emerald-600 truncate block">SQL Windowing (92%)</strong>
          </div>

          <div className="p-2 rounded-xl border bg-secondary/15">
            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Priority Gap</span>
            <strong className="text-amber-600 truncate block">Spark Compute (-20%)</strong>
          </div>

          <div className="p-2 rounded-xl border bg-secondary/15">
            <span className="text-muted-foreground block text-[9px] uppercase font-bold">Next Milestone</span>
            <strong className="text-primary truncate block">Data Pipeline Project</strong>
          </div>
        </div>
      </header>

      {/* Chat Transcript Panel */}
      <div className="surface-panel flex-1 overflow-y-auto rounded-3xl border border-border/80 p-4 sm:p-6 space-y-4 bg-card">
        {messages.length === 0 && (
          <div className="py-6 space-y-6">
            <div className="text-center space-y-2 max-w-md mx-auto">
              <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Bot className="size-6" />
              </div>
              <h3 className="font-bold text-base text-foreground">How can SPAR assist your journey today?</h3>
              <p className="text-xs text-muted-foreground">
                Ask about your career plan, practice technical questions, or get targeted advice on closing skill gaps.
              </p>
            </div>

            {/* Starter Action Cards */}
            <div className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
              {STARTER_ACTIONS.map((st, i) => (
                <div
                  key={i}
                  onClick={() => handleSend(st.query)}
                  className="p-4 rounded-2xl border border-border/70 hover:border-primary/40 bg-secondary/10 hover:bg-primary/[0.04] cursor-pointer transition-all space-y-1 text-xs"
                >
                  <div className="font-bold text-foreground flex items-center justify-between">
                    <span>{st.title}</span>
                    <ArrowRight className="size-3.5 text-primary" />
                  </div>
                  <p className="text-[11px] text-muted-foreground">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "assistant" && (
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary mt-1">
                <Bot className="size-4" />
              </span>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm space-y-2.5 ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                  : "bg-surface border border-border/70 text-foreground rounded-tl-none"
              }`}
            >
              {msg.role === "user" ? (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              ) : (
                <MarkdownRenderer content={msg.content} />
              )}

              {/* Skills Referenced Pills */}
              {Array.isArray(msg.referencedSkills) && msg.referencedSkills.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Skills referenced:</span>
                  {msg.referencedSkills.map((sk, skIdx) => {
                    const skLabel = typeof sk === "string" ? humanizeCode(sk) : (sk as any)?.name || (sk as any)?.code || "Skill";
                    return (
                      <Badge
                        key={skIdx}
                        variant="secondary"
                        className="text-[10px] py-0 px-2 font-mono"
                      >
                        {skLabel}
                      </Badge>
                    );
                  })}
                </div>
              )}

              {/* Recommended Action CTA */}
              {msg.recommendedAction && (
                <div className="mt-3 pt-3 border-t border-border/40">
                  <div className="rounded-xl border border-primary/30 bg-primary/[0.05] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-foreground text-xs block">
                        {msg.recommendedAction.title || "Recommended Next Action"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {msg.recommendedAction.description}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleActionClick(msg.recommendedAction!)}
                      className="text-xs font-semibold gap-1 shrink-0"
                    >
                      Take Action <ArrowRight className="size-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-xs text-muted-foreground">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
              <Loader2 className="size-4 animate-spin" />
            </span>
            <div className="p-3 rounded-2xl border bg-surface flex items-center gap-2">
              <Sparkles className="size-3.5 text-primary animate-pulse" />
              <span>SPAR Coach is synthesizing personalized career intelligence…</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Message Input Box */}
      <div className="surface-panel rounded-3xl border border-border/80 p-3 bg-card shadow-sm space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSend();
          }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask SPAR about your curriculum, project rubric, or interview preparation..."
            disabled={loading}
            className="flex-1 rounded-xl border bg-background px-4 py-2.5 text-xs sm:text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />

          <Button
            type="submit"
            disabled={loading || !input.trim()}
            className="rounded-xl px-4 text-xs font-semibold gap-1.5"
          >
            <Send className="size-3.5" />
            <span className="hidden sm:inline">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}
