import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LogOut, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app/home", label: "Home" },
  { to: "/app/plan", label: "Career Plan" },
  { to: "/app/career", label: "Career" },
  { to: "/app/explore", label: "Explore" },
  { to: "/app/readiness", label: "Readiness" },
  { to: "/app/missions", label: "Missions" },
  { to: "/app/skills", label: "Skills" },
  { to: "/app/evidence", label: "Evidence" },
  { to: "/app/agent", label: "AI Advisor" },
  { to: "/app/profile", label: "Profile" },
] as const;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + second).toUpperCase() || "?";
}

/** Authenticated app chrome: brand, primary navigation, user, and logout. */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-secondary text-foreground"
        : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Link to="/app/home" className="flex items-center gap-2.5">
              <span
                className="grid size-8 shrink-0 place-items-center rounded-lg"
                style={{ backgroundImage: "var(--gradient-primary)" }}
                aria-hidden="true"
              >
                <svg viewBox="0 0 24 24" className="size-4" fill="none">
                  <path d="M12 4 20 20H4L12 4Z" stroke="var(--background)" strokeWidth="2" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold tracking-tight">
                Career<span className="text-gradient">AI</span>
              </span>
            </Link>
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} activeProps={{ "aria-current": "page" }}>
                {({ isActive }) => <span className={navLinkClass({ isActive })}>{item.label}</span>}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {user !== null ? (
              <div className="hidden items-center gap-2.5 sm:flex">
                {user.picture !== null ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="size-8 rounded-full border border-border object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span className="grid size-8 place-items-center rounded-full bg-secondary text-xs font-semibold">
                    {initialsOf(user.name)}
                  </span>
                )}
                <span className="max-w-[140px] truncate text-sm text-muted-foreground">
                  {user.name}
                </span>
              </div>
            ) : null}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => void logout()}
            >
              <LogOut />
              <span className="hidden sm:inline">Sign out</span>
            </Button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              className="grid size-9 place-items-center rounded-lg border border-border text-muted-foreground md:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <nav aria-label="Primary mobile" className="border-t border-border px-4 py-2 md:hidden">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: "block rounded-lg px-3 py-2.5 text-sm bg-secondary text-foreground",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
