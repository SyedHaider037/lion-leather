"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows which variant (e.g. size) is currently selected in the product form,
 * since one is preselected and the radios are visually hidden.
 */
export function SelectedVariant({
  label,
  initial,
}: {
  label: string;
  initial: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [title, setTitle] = useState(initial);

  useEffect(() => {
    const form = ref.current?.closest("form");
    if (!form) return;

    const sync = () => {
      const checked = form.querySelector<HTMLInputElement>(
        'input[name="variantId"]:checked',
      );
      const text = checked?.closest("label")?.textContent?.trim();
      if (text) setTitle(text.replace(/\s*\(sold out\)\s*$/i, ""));
    };

    form.addEventListener("change", sync);
    return () => form.removeEventListener("change", sync);
  }, []);

  return (
    <p
      ref={ref}
      aria-live="polite"
      className="mt-4 text-caption font-light text-taupe"
    >
      Selected {label.toLowerCase()}: <span className="text-ink">{title}</span>
    </p>
  );
}
