import React, { useEffect, useRef, useState } from "react";

/**
 * useInView — lightweight IntersectionObserver hook for on-scroll reveals.
 * Returns a ref to attach and a boolean once the element has entered the viewport.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
  sm: "translate-y-[14px]",
  md: "translate-y-6",
  lg: "translate-y-9",
} as const;

/**
 * Reveal — fades + slides its children into view on scroll.
 * Uses opacity + transform transitions (no layout cost), respects reduced motion
 * via the prefers-reduced-motion media query handled in styles.css.
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
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : undefined,
        transition: `opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`,
      }}
    >
      <div
        className={inView ? "" : translateY}
        style={{ transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        {children}
      </div>
    </Tag>
  );
}
