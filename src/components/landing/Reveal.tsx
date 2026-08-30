import React, { useEffect, useRef, useState } from "react";

/**
 * useInView — lightweight IntersectionObserver hook for on-scroll reveals.
 * Returns a ref to attach and a boolean once the element has entered the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.05, rootMargin: "0px 0px 50px 0px" },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true); // Default true for SSR safety, will animate when mounted

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(entry.target);
        }
      });
    }, options);
    observer.observe(el);
    return () => observer.disconnect();
  }, [options]);

  return { ref, inView };
}

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in milliseconds */
  delay?: number;
  /** Translate distance; "sm" = 14px, "md" = 24px (default), "lg" = 36px */
  distance?: "sm" | "md" | "lg";
  as?: React.ElementType;
}

const distanceMap = {
  sm: "translate-y-[10px]",
  md: "translate-y-4",
  lg: "translate-y-6",
} as const;

/**
 * Reveal — smooth fade + slide on scroll.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = "md",
  as: Tag = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLElement>();
  const translateY = distanceMap[distance];

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={className}
      style={{
        opacity: inView ? 1 : 0.85,
        transition: `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className={inView ? "translate-y-0" : translateY}
        style={{ transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {children}
      </div>
    </Tag>
  );
}
