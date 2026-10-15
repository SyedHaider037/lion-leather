"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils/cn";

/**
 * Below 768px, shows a fixed bottom add-to-cart bar once the main
 * "Add to Selection" button has scrolled up out of view, and hides again when
 * it returns. Submits the existing PDP form (so the chosen variant is honored)
 * via the `form` attribute — no duplicate server action.
 */
export function MobileAddToCartBar({
  productName,
  formId,
  anchorId,
  soldOut = false,
}: {
  productName: string;
  formId: string;
  anchorId: string;
  soldOut?: boolean;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const anchor = document.getElementById(anchorId);
    if (!anchor) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only show once the main button has scrolled up past the viewport top.
        const scrolledPast =
          !entry.isIntersecting && entry.boundingClientRect.top < 0;
        setVisible(scrolledPast);
      },
      { threshold: 0 },
    );

    observer.observe(anchor);
    return () => observer.disconnect();
  }, [anchorId]);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 transition-transform duration-500 ease-luxe md:hidden motion-reduce:transition-none",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center justify-between gap-4 border-t border-gold/30 bg-surface px-5 py-4 text-ink">
        <p className="min-w-0 flex-1 truncate font-serif text-card font-light">
          {productName}
        </p>
        <button
          type="submit"
          form={formId}
          disabled={soldOut}
          tabIndex={visible ? 0 : -1}
          className="shrink-0 border border-cognac bg-cognac px-6 py-3 font-sans text-eyebrow uppercase text-paper transition-all duration-500 ease-luxe hover:brightness-110 disabled:pointer-events-none disabled:opacity-40"
        >
          {soldOut ? "Sold out" : "Add to Selection"}
        </button>
      </div>
    </div>
  );
}
