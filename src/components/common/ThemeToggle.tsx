import React, { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle({ className }: { className?: string }) {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const saved = (localStorage.getItem("careerai-theme") as ThemeMode) || "dark";
    setTheme(saved);
    applyTheme(saved);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
        root.classList.remove("light");
      } else {
        root.classList.add("light");
        root.classList.remove("dark");
      }
    } else if (mode === "light") {
      root.classList.add("light");
      root.classList.remove("dark");
    } else {
      root.classList.add("dark");
      root.classList.remove("light");
    }
  };

  const handleToggle = () => {
    const next: ThemeMode = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
    setTheme(next);
    localStorage.setItem("careerai-theme", next);
    applyTheme(next);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      className={`size-8 p-0 rounded-xl hover:bg-secondary/60 transition-colors ${className || ""}`}
      title={`Current Theme: ${theme.toUpperCase()} (Click to toggle)`}
    >
      {theme === "dark" && <Moon className="size-4 text-primary" />}
      {theme === "light" && <Sun className="size-4 text-amber-500" />}
      {theme === "system" && <Monitor className="size-4 text-muted-foreground" />}
      <span className="sr-only">Toggle Theme</span>
    </Button>
  );
}
