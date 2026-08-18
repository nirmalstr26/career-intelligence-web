import { ChevronDown, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGoogleSignInCta } from "@/lib/auth/useGoogleSignInCta";

const LINKS = ["Product", "Careers", "Colleges", "About"];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const signIn = useGoogleSignInCta();

  return (
    <header className="relative z-20 mx-auto w-full max-w-[1440px] px-6 lg:px-10">
      <div className="grid h-20 grid-cols-[minmax(0,1fr)_auto] items-center gap-4 md:flex md:justify-between">
        <a href="/" className="flex min-w-0 items-center gap-2.5">
          <span
            className="grid size-9 shrink-0 place-items-center rounded-xl"
            style={{ backgroundImage: "var(--gradient-primary)" }}
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none">
              <path d="M12 4 20 20H4L12 4Z" stroke="var(--background)" strokeWidth="2" />
            </svg>
          </span>
          <span className="truncate font-display text-xl font-bold tracking-tight">
            Career<span className="text-gradient">AI</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link}
              {link === "Product" ? <ChevronDown className="size-4" aria-hidden="true" /> : null}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="default"
            className="hidden rounded-full px-5 sm:inline-flex"
            onClick={signIn}
          >
            <UserRound />
            Sign In
          </Button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid size-10 cursor-pointer place-items-center rounded-xl border border-border text-muted-foreground transition-colors hover:text-foreground lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          aria-label="Mobile"
          className="surface-panel mb-4 grid gap-1 rounded-2xl p-3 lg:hidden"
        >
          {LINKS.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              {link}
            </a>
          ))}
          <Button
            variant="outline"
            size="default"
            className="mt-1 rounded-full sm:hidden"
            onClick={() => {
              setOpen(false);
              signIn();
            }}
          >
            <UserRound />
            Sign In
          </Button>
        </nav>
      ) : null}
    </header>
  );
}
