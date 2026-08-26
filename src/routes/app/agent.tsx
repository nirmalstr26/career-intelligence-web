import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2 } from "lucide-react";

import { SectionCard } from "@/components/app/ui";
import { Button } from "@/components/ui/button";
import { useStudentId } from "@/lib/careerai/hooks";
import { careerai } from "@/lib/careerai/client";
import type { AgentReply } from "@/lib/careerai/types";

export const Route = createFileRoute("/app/agent")({
  component: AgentPage,
});

interface Message {
  role: "user" | "assistant";
  content: string;
  referencedCareers?: string[];
  referencedSkills?: string[];
}

function AgentPage() {
  const studentId = useStudentId();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your CareerAI advisor. I can help you explore career paths, understand your skill gaps, interpret your readiness scores, and recommend your next steps. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string | undefined>(undefined);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed || loading || !studentId) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setLoading(true);

    try {
      const reply = await careerai.sendAgentMessage(studentId, trimmed, conversationId.current);
      // Capture conversation_id from first reply if available
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
          content: "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col gap-4">
      <header>
        <h1 className="font-display text-2xl font-bold sm:text-3xl flex items-center gap-2">
          <Sparkles className="size-6 text-primary" />
          Career Advisor
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your AI-powered career guide — ask about careers, skills, readiness, and next steps.
        </p>
      </header>

      <SectionCard className="flex flex-1 flex-col overflow-hidden p-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                  msg.role === "assistant"
                    ? "bg-primary/10 text-primary"
                    : "bg-secondary text-foreground"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="size-4" />
                ) : (
                  <User className="size-4" />
                )}
              </span>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-secondary text-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.referencedCareers && msg.referencedCareers.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {msg.referencedCareers.map((c) => (
                      <span
                        key={c}
                        className="rounded-full bg-primary/20 px-2 py-0.5 text-[11px] font-medium text-primary"
                      >
                        {c.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-start gap-3">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
              <div className="rounded-2xl bg-secondary px-4 py-3">
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void sendMessage();
            }}
          >
            <input
              type="text"
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="Ask about careers, skills, next steps…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <Button type="submit" variant="hero" size="icon" className="rounded-full shrink-0" disabled={loading || !input.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Powered by AI — answers are for guidance only.
          </p>
        </div>
      </SectionCard>
    </div>
  );
}
