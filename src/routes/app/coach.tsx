import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, MessageSquare, ArrowRight } from "lucide-react";

import { SectionCard } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudentId, useCareerIntelligence, useCurriculum } from "@/lib/careerai/hooks";
import { careerai } from "@/lib/careerai/client";
import { humanizeCode } from "@/lib/utils";
import type { AgentReply } from "@/lib/careerai/types";

interface CoachSearchParams {
  prompt?: string;
}

export const Route = createFileRoute("/app/coach")({
  validateSearch: (search: Record<string, unknown>): CoachSearchParams => {
    return {
      prompt: typeof search.prompt === "string" ? search.prompt : undefined,
    };
  },
  head: () => ({
    meta: [{ title: "SPAR Coach — AI Career Advisor · CareerAI" }],
  }),
  component: CoachPage,
});

interface Message {
  role: "user" | "assistant";
  content: string;
  referencedCareers?: string[];
  referencedSkills?: string[];
}

function CoachPage() {
  const { prompt } = Route.useSearch();
  const studentId = useStudentId();
  const ciQuery = useCareerIntelligence();
  const ci = ciQuery.data;
  const primaryCareerCode = ci?.career_direction.primary_career ?? "DATA_ENGINEER";
  const currQuery = useCurriculum(primaryCareerCode);
  const curr = currQuery.data;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello! I'm your SPAR AI Career Coach. I am calibrated with your active pathway (${curr?.career_cluster_name || "Data Engineer"}), your current readiness score (${ci?.placement_readiness?.score ?? 79}/100), and your learning roadmap progress. How can I assist your career journey today?`,
    },
  ]);
  const [input, setInput] = useState(prompt || "");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string | undefined>(undefined);
  const initializedPrompt = useRef(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // If prompt was passed via search query, set input or automatically prepare it
  useEffect(() => {
    if (prompt && !initializedPrompt.current) {
      setInput(prompt);
      initializedPrompt.current = true;
    }
  }, [prompt]);

  async function handleSend(customText?: string) {
    const textToSend = (customText || input).trim();
    if (!textToSend || loading || !studentId) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: textToSend }]);
    setLoading(true);

    try {
      const reply = await careerai.sendAgentMessage(studentId, textToSend, conversationId.current);
      const replyAny = reply as AgentReply & { conversation_id?: string };
      if (replyAny.conversation_id) conversationId.current = replyAny.conversation_id;

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply.message,
          referencedCareers: reply.referenced_careers,
          referencedSkills: reply.referenced_skills,
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

  const QUICK_PROMPTS = [
    `What should I focus on next for ${curr?.career_cluster_name || "Data Engineering"}?`,
    "Why is my Programming score lower than Databases?",
    "How can I reach 85+ Placement Readiness?",
    "Explain the difference between ETL and ELT simply.",
  ];

  return (
    <div className="flex h-[calc(100vh-130px)] flex-col gap-3">
      {/* Contextual Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl flex items-center gap-2 text-foreground">
            <Sparkles className="size-6 text-primary" />
            SPAR AI Career Coach
          </h1>
          <p className="text-xs text-muted-foreground">
            Contextual career intelligence, skill gap analysis, and placement guidance.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-primary/15 text-primary border-primary/30 text-xs">
            Path: {curr?.career_cluster_name || "Data Engineer"}
          </Badge>
          <Badge variant="outline" className="bg-success/15 text-success border-success/30 text-xs">
            Readiness: {ci?.placement_readiness?.score ?? 79}/100
          </Badge>
        </div>
      </header>

      {/* Chat Transcript Panel */}
      <div className="surface-panel flex-1 overflow-y-auto rounded-3xl border border-border/80 p-4 sm:p-6 space-y-4">
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
              className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground font-medium rounded-tr-none"
                  : "bg-surface border border-border/70 text-foreground rounded-tl-none"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {msg.referencedSkills && msg.referencedSkills.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-muted-foreground">Skills referenced:</span>
                  {msg.referencedSkills.map((sk) => (
                    <Badge key={sk} variant="outline" className="text-[9px] bg-secondary">
                      {humanizeCode(sk)}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {msg.role === "user" && (
              <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-secondary text-foreground mt-1">
                <User className="size-4" />
              </span>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start items-center text-muted-foreground text-xs">
            <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-primary/20 text-primary">
              <Bot className="size-4 animate-pulse" />
            </span>
            <span className="flex items-center gap-1.5 bg-surface border border-border/60 rounded-2xl px-4 py-2.5">
              <Loader2 className="size-3.5 animate-spin text-primary" />
              SPAR is formulating your guidance...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick Prompts Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        <span className="text-[10px] text-muted-foreground font-medium shrink-0">Suggestions:</span>
        {QUICK_PROMPTS.map((qp, i) => (
          <button
            key={i}
            type="button"
            onClick={() => void handleSend(qp)}
            disabled={loading}
            className="shrink-0 rounded-full border border-border/70 bg-surface px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary hover:bg-primary/10 hover:text-foreground"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void handleSend();
            }
          }}
          placeholder="Ask SPAR about your career roadmap, skill gaps, or learning concepts..."
          disabled={loading}
          className="flex-1 rounded-2xl border border-border/80 bg-surface px-4 py-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60"
        />

        <Button
          onClick={() => void handleSend()}
          disabled={loading || !input.trim()}
          size="lg"
          variant="hero"
          className="rounded-2xl px-5 gap-2 font-semibold shadow-md"
        >
          <Send className="size-4" />
          <span className="hidden sm:inline">Ask Coach</span>
        </Button>
      </div>
    </div>
  );
}
