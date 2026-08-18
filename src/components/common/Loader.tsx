import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

export function FullScreenLoader({ label = "Loading\u2026" }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
        <p className="text-sm">{label}</p>
        <span className="sr-only">{label}</span>
      </div>
    </div>
  );
}

export function InlineSpinner({ className }: { className?: string }) {
  return <Loader2 className={cn("size-4 animate-spin", className)} aria-hidden="true" />;
}
