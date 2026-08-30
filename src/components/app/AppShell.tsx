import { useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  LogOut,
  Menu,
  X,
  Sun,
  Compass,
  Wrench,
  TrendingUp,
  Bot,
  User,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { useAuth } from "@/lib/auth/AuthProvider";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/app/today", label: "Today", icon: Sun },
  { to: "/app/discover", label: "Discover", icon: Sparkles },
  { to: "/app/path", label: "My Path", icon: Compass },
  { to: "/app/practice", label: "Practice", icon: Wrench },
  { to: "/app/progress", label: "Progress", icon: TrendingUp },
  { to: "/app/coach", label: "SPAR Coach", icon: Bot },
  { to: "/app/profile", label: "Profile", icon: User },
] as const;

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? (parts[parts.length - 1]?.[0] ?? "") : "";
  return (first + second).toUpperCase() || "?";
}

/** Authenticated app chrome: brand, 6-item guided student navigation, user, and logout. */
export function AppShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all flex items-center gap-1.5",
      isActive
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <Link to="/app/today" className="flex items-center gap-2.5 group">
              <img
                src="/brand/icon/spar-ai-icon-64.png"
                srcSet="/brand/icon/spar-ai-icon-64.png 1x, /brand/icon/spar-ai-icon-128.png 2x"
                alt="SPAR AI"
                className="size-8 object-contain drop-shadow-sm transition-transform duration-200 group-hover:scale-105"
              />
              <span className="font-display text-lg font-bold tracking-tight">
                SPAR <span className="text-cyan-400">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <Link key={item.to} to={item.to} activeProps={{ "aria-current": "page" }}>
                {({ isActive }) => (
                  <span className={navLinkClass({ isActive })}>
                    <item.icon className="size-3.5" />
                    {item.label}
                  </span>
                )}
              </Link>
            ))}
          </nav>

          {/* User Profile & Sign Out */}
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
                <span className="max-w-[140px] truncate text-xs font-medium text-muted-foreground">
                  {user.name}
                </span>
              </div>
            ) : null}

            <ThemeToggle />

            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs font-semibold"
              onClick={() => void logout()}
            >
              <LogOut className="size-3.5 sm:mr-1" />
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

        {/* Mobile Navigation Dropdown */}
        {open ? (
          <nav aria-label="Primary mobile" className="border-t border-border px-4 py-3 md:hidden space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
                activeProps={{
                  className: "flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold bg-primary text-primary-foreground",
                }}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-border/60 mt-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 hover:border-destructive/30"
                onClick={() => {
                  setOpen(false);
                  void logout();
                }}
              >
                <LogOut className="size-3.5" />
                Sign Out
              </Button>
            </div>
          </nav>
        ) : null}
      </header>

      <main className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
