import { useState, useRef, useEffect } from "react";
import {
  Bot,
  Send,
  Sparkles,
  User,
  Loader2,
  AlertCircle,
  HelpCircle,
  Minimize2,
  Maximize2,
  MessageSquare,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStudentId } from "@/lib/careerai/hooks";
import { careerai } from "@/lib/careerai/client";
import { humanizeCode } from "@/components/app/ui";
import { cn } from "@/lib/utils";
import type { CurriculumModule } from "@/lib/careerai/types";

interface ModuleAITutorProps {
  module: CurriculumModule;
  careerClusterCode?: string;
  defaultExpanded?: boolean;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Explain this in simple terms",
  "Give me a real-world example",
  "Why do I need this for my career?",
  "Quiz me with 2 quick questions",
  "Give me a practice exercise",
  "What is the most common mistake here?",
];

export function ModuleAITutor({
  module,
  careerClusterCode = "DATA_ENGINEER",
  defaultExpanded = true,
}: ModuleAITutorProps) {
  const studentId = useStudentId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      content: `Hello! I'm your AI Tutor for **${module.title}**. Ask me to explain concepts simply, walk through code, or quiz you on this topic!`,
      timestamp: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (expanded) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, expanded]);

  async function handleSend(textToSend?: string) {
    const messageContent = (textToSend ?? input).trim();
    if (!messageContent || loading || !studentId) return;

    setInput("");
    setErrorBanner(null);

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      // Prepend module context silently to the first prompt or as targeted query
      const contextualPrompt = `[Context: Active Career=${careerClusterCode}, Track=${module.track_name}, Phase=${module.phase_name}, Module=${module.title} (${module.code}), Objective=${module.learning_objective ?? "N/A"}, Skills=${(module.skill_codes ?? []).join(", ")}]\n\nStudent asks: ${messageContent}`;

      const reply = await careerai.sendAgentMessage(
        studentId,
        messages.length === 1 ? contextualPrompt : messageContent,
        conversationId.current,
      );

      const assistantMsg: ChatMessage = {
        id: `ast_${Date.now()}`,
        role: "assistant",
        content: reply.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setErrorBanner(
        "The AI tutor is temporarily unavailable. You can continue the module normally.",
      );
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: "assistant",
          content:
            "I'm having a brief connection issue, but you can continue reading the module and practicing normally!",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <aside
      aria-label="Ask SPAR AI Tutor"
      className={cn(
        "flex flex-col rounded-3xl border border-border/80 bg-surface/90 shadow-xl backdrop-blur transition-all duration-300",
        expanded ? "h-[640px]" : "h-auto",
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-xl bg-primary/20 text-primary shadow-sm">
            <Sparkles className="size-4" />
          </span>
          <div>
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-1.5">
              Ask SPAR AI Tutor
              <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0">Module Guide</Badge>
            </h3>
            <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
              {module.title}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="size-8 p-0 text-muted-foreground hover:text-foreground"
          aria-label={expanded ? "Minimize AI Tutor" : "Expand AI Tutor"}
        >
          {expanded ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </Button>
      </div>

      {expanded ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-2.5",
                  m.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground border border-border/60",
                  )}
                >
                  {m.role === "user" ? <User className="size-3.5" /> : <Bot className="size-3.5 text-primary" />}
                </div>

                <div
                  className={cn(
                    "max-w-[82%] rounded-2xl p-3.5 leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-card/80 text-foreground border border-border/60 rounded-tl-sm shadow-sm",
                  )}
                >
                  {m.role === "user" ? (
                    <p className="whitespace-pre-wrap">{m.content}</p>
                  ) : (
                    <MarkdownRenderer content={m.content} />
                  )}
                  <span
                    className={cn(
                      "mt-1.5 block text-[10px]",
                      m.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground",
                    )}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 pl-9">
                <Loader2 className="size-3.5 animate-spin text-primary" />
                <span>SPAR AI is thinking...</span>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          {/* Error Banner */}
          {errorBanner ? (
            <div className="flex items-center gap-2 border-t border-destructive/30 bg-destructive/10 px-4 py-2 text-[11px] text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{errorBanner}</span>
            </div>
          ) : null}

          {/* Quick Prompts */}
          <div className="border-t border-border/50 px-4 py-2.5 bg-background/50">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {SUGGESTED_PROMPTS.map((promptText) => (
                <button
                  key={promptText}
                  type="button"
                  disabled={loading}
                  onClick={() => void handleSend(promptText)}
                  className="shrink-0 rounded-full border border-border/80 bg-card/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:border-primary/50 hover:bg-primary/10 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {promptText}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend();
            }}
            className="border-t border-border/50 p-3 bg-surface"
          >
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this module..."
                disabled={loading}
                className="flex-1 rounded-xl border border-border/80 bg-background/80 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Button
                type="submit"
                size="sm"
                variant="hero"
                disabled={!input.trim() || loading}
                className="size-8 p-0 shrink-0"
              >
                <Send className="size-3.5" />
              </Button>
            </div>
          </form>
        </>
      ) : (
        <div className="p-3 text-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(true)}
            className="w-full text-xs text-primary font-semibold gap-1.5"
          >
            <MessageSquare className="size-3.5" />
            Open AI Tutor
          </Button>
        </div>
      )}
    </aside>
  );
}
