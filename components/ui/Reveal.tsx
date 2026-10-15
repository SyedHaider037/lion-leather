"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Scroll-reveal wrapper: fades and rises content once when it enters the
 * viewport. Respects prefers-reduced-motion (content shows immediately).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** "rise" = fade + translate up; "scale" = fade + slight scale (for images). */
  variant?: "rise" | "scale";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion needs no special-casing here: the `motion-reduce:`
    // classes below keep content fully visible regardless of state.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-[opacity,transform] duration-[400ms] ease-luxe motion-reduce:transition-none",
        // Hidden state only applies under html.js (set pre-paint in the root
        // layout), so content stays visible when JavaScript is unavailable.
        !visible &&
          (variant === "scale"
            ? "[.js_&]:scale-[0.98] [.js_&]:opacity-0 [.js_&]:motion-reduce:scale-100 [.js_&]:motion-reduce:opacity-100"
            : "[.js_&]:translate-y-4 [.js_&]:opacity-0 [.js_&]:motion-reduce:translate-y-0 [.js_&]:motion-reduce:opacity-100"),
        className,
      )}
    >
      {children}
    </div>
  );
}
