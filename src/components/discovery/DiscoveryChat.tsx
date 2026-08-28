import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Bot,
  Check,
  CornerDownLeft,
  HelpCircle,
  MessageSquare,
  Send,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

import { InlineSpinner } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import type { DiscoverySession, DiscoveryTurn } from "@/lib/careerai/types";
import { cn } from "@/lib/utils";

interface Props {
  session: DiscoverySession;
  onRespond: (choiceCodes: string[], message?: string) => Promise<void>;
  isResponding: boolean;
}

export function DiscoveryChat({ session, onRespond, isResponding }: Props) {
  const [selectedChoices, setSelectedChoices] = useState<string[]>([]);
  const [textMessage, setTextMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const turns = session.turns || [];
  const latestTurn = turns[turns.length - 1];
  const isLatestAssistant = latestTurn?.role === "assistant";
  const hasOptions = isLatestAssistant && latestTurn.options && latestTurn.options.length > 0;

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [turns.length, isResponding]);

  const handleToggleChoice = (code: string) => {
    if (selectedChoices.includes(code)) {
      setSelectedChoices(selectedChoices.filter((c) => c !== code));
    } else {
      setSelectedChoices([code]); // Single choice preference for speed
    }
  };

  const handleSubmitChoice = async () => {
    if (selectedChoices.length === 0) return;
    const choicesToSend = [...selectedChoices];
    setSelectedChoices([]);
    await onRespond(choicesToSend);
  };

  const handleSendTextMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msg = textMessage.trim();
    if (!msg) return;
    setTextMessage("");
    await onRespond(selectedChoices, msg);
    setSelectedChoices([]);
  };

  return (
    <div className="flex flex-col h-[75vh] max-h-[800px] rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Top Header & Progress */}
      <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Sparkles className="size-4.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">SPAR AI Career Discovery</h3>
            <p className="text-[11px] text-muted-foreground">Interactive career alignment dialogue</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary">
            Step {session.current_step} of {session.total_steps}
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {turns.map((turn, idx) => {
          const isBot = turn.role === "assistant";
          return (
            <div
              key={turn.id || idx}
              className={cn(
                "flex gap-3 max-w-[88%] animate-in fade-in duration-300",
                isBot ? "mr-auto items-start" : "ml-auto items-end flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold",
                  isBot
                    ? "bg-primary/10 border border-primary/20 text-primary"
                    : "bg-secondary text-foreground"
                )}
              >
                {isBot ? <Bot className="size-4" /> : <User className="size-4" />}
              </div>

              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm",
                  isBot
                    ? "border border-border bg-background text-foreground"
                    : "bg-primary text-primary-foreground font-medium"
                )}
              >
                {turn.content}

                {/* Display past selected badges if user */}
                {!isBot && turn.selected_options && turn.selected_options.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {turn.selected_options.map((opt) => (
                      <span
                        key={opt}
                        className="rounded-md bg-primary-foreground/20 px-1.5 py-0.5 text-[10px]"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Responding Indicator */}
        {isResponding && (
          <div className="flex items-center gap-3 mr-auto animate-in fade-in">
            <div className="flex size-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Bot className="size-4" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-background px-4 py-3 text-xs text-muted-foreground">
              <InlineSpinner className="size-3.5 text-primary" />
              <span>SPAR is thinking…</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Options Area (if current turn has choices) */}
      {hasOptions && !isResponding && (
        <div className="border-t border-border bg-background/60 p-4 space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Select your answer:
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {latestTurn.options?.map((opt) => {
              const isSelected = selectedChoices.includes(opt.code);
              return (
                <button
                  key={opt.code}
                  type="button"
                  onClick={() => handleToggleChoice(opt.code)}
                  className={cn(
                    "flex items-center justify-between rounded-xl border p-3 text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/10 text-primary font-medium shadow-sm"
                      : "border-border bg-background hover:border-primary/40 text-foreground"
                  )}
                >
                  <span className="text-xs">{opt.label}</span>
                  <div
                    className={cn(
                      "flex size-4 shrink-0 items-center justify-center rounded-full border text-[10px]",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30"
                    )}
                  >
                    {isSelected && <Check className="size-2.5 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedChoices.length > 0 && (
            <div className="flex justify-end pt-1">
              <Button
                size="sm"
                onClick={handleSubmitChoice}
                className="gap-2 rounded-xl text-xs bg-primary text-primary-foreground font-semibold px-5"
              >
                Confirm Selection
                <ArrowRight className="size-3.5" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Input Box for custom questions / answers */}
      <form
        onSubmit={handleSendTextMessage}
        className="flex items-center gap-2 border-t border-border bg-background p-3"
      >
        <input
          type="text"
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          placeholder="Ask SPAR a question (e.g. 'What does a Data Engineer do?') or type an answer…"
          disabled={isResponding}
          className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-xs sm:text-sm text-foreground focus:border-primary focus:outline-none"
        />
        <Button
          type="submit"
          size="sm"
          disabled={isResponding || !textMessage.trim()}
          className="rounded-xl px-4 text-xs font-semibold gap-1.5"
        >
          <Send className="size-3.5" />
          Send
        </Button>
      </form>
    </div>
  );
}
