import { useEffect, useRef, type RefObject } from "react";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * While `active`, keeps Tab focus inside `containerRef`, focuses the first
 * focusable element on open, calls `onEscape` on Escape, and restores focus
 * to the previously focused element on close. For modal drawers/dialogs.
 */
export function useFocusTrap(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  onEscape?: () => void,
) {
  const restoreTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;
    restoreTo.current = document.activeElement as HTMLElement | null;

    const container = containerRef.current;
    const visible = () =>
      container
        ? Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
            (el) => el.offsetParent !== null,
          )
        : [];

    // Focus the first focusable element once the panel is shown.
    const raf = requestAnimationFrame(() => visible()[0]?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onEscape?.();
        return;
      }
      if (e.key !== "Tab") return;
      const items = visible();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      restoreTo.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
}
