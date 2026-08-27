import { useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Check, Copy } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

function CodeBlock({ children, className }: { children?: ReactNode; className?: string }) {
  const [copied, setCopied] = useState(false);
  const codeText = String(children).replace(/\n$/, "");
  const match = /language-(\w+)/.exec(className || "");
  const lang = match ? match[1] : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative my-3 overflow-hidden rounded-xl border border-border/80 bg-background/95 font-mono text-xs shadow-inner">
      <div className="flex items-center justify-between border-b border-border/60 bg-secondary/50 px-3 py-1.5 text-[11px] text-muted-foreground">
        <span className="font-semibold uppercase tracking-wider">{lang || "code"}</span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="size-3 text-success" />
              <span className="text-success font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto p-3.5 text-xs text-foreground/90 leading-relaxed font-mono">
        <code>{codeText}</code>
      </pre>
    </div>
  );
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  // Clean lingering raw action tags or empty action blocks
  const cleanContent = (content || "")
    .replace(/\[ACTION:\s*\{[^}]*\}\]/gi, "")
    .replace(/```json\s*\{[\s\S]*?\}\s*```/gi, (match) => {
      if (match.includes('"type"') && match.includes('"title"')) {
        return "";
      }
      return match;
    })
    .trim();

  return (
    <div className={`prose-sm dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="font-display text-base sm:text-lg font-bold text-foreground mt-3 mb-1.5 tracking-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="font-display text-sm sm:text-base font-bold text-foreground mt-3 mb-1 tracking-tight flex items-center gap-1.5">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-xs sm:text-sm font-bold text-foreground mt-2.5 mb-1">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-foreground mt-2 mb-0.5 uppercase tracking-wider text-muted-foreground">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="my-1.5 text-xs sm:text-sm text-foreground/90 leading-relaxed last:mb-0">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-foreground/85">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="my-2 ml-4 list-disc space-y-1 text-xs sm:text-sm text-foreground/90">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="my-2 ml-4 list-decimal space-y-1 text-xs sm:text-sm text-foreground/90">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="my-2.5 rounded-r-xl border-l-4 border-primary/70 bg-primary/5 py-2 px-3.5 italic text-xs text-foreground/85">
              {children}
            </blockquote>
          ),
          hr: () => (
            <hr className="my-3 border-t border-border/60" />
          ),
          table: ({ children }) => (
            <div className="my-3 overflow-x-auto rounded-xl border border-border/80">
              <table className="min-w-full divide-y divide-border/60 text-left text-xs">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-secondary/60 text-xs font-semibold text-foreground">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border/40 bg-background/50">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="transition-colors hover:bg-secondary/30">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 font-semibold text-foreground">{children}</th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-foreground/90">{children}</td>
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children, ...props }: any) => {
            const codeStr = String(children).replace(/\n$/, "");
            const hasLang = /language-(\w+)/.test(className || "");
            const isMultiLine = codeStr.includes("\n");

            if (hasLang || isMultiLine) {
              return <CodeBlock className={className}>{children}</CodeBlock>;
            }

            return (
              <code
                className="rounded-md bg-secondary/80 px-1.5 py-0.5 font-mono text-[11px] font-medium text-primary border border-border/50"
                {...props}
              >
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary font-medium underline underline-offset-2 hover:text-primary/80 transition-colors"
            >
              {children}
            </a>
          ),
        }}
      >
        {cleanContent}
      </ReactMarkdown>
    </div>
  );
}
