"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type Img = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden
    >
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      aria-hidden
    >
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

export function ProductGallery({ images, title }: { images: Img[]; title: string }) {
  const normalized = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const current = normalized[active];
  const count = normalized.length;

  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => {
    if (count > 1) setActive((i) => (i + 1) % count);
  }, [count]);

  const prev = useCallback(() => {
    if (count > 1) setActive((i) => (i - 1 + count) % count);
  }, [count]);

  // While the lightbox is open: lock page scroll, move focus to Close, and
  // wire Escape / arrow-key navigation.
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, next, prev]);

  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0]?.clientX ?? null;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
    if (Math.abs(dx) > 50) {
      if (dx < 0) next();
      else prev();
    }
    touchStartX.current = null;
  }

  return (
    <div className="grid gap-4">
      {/* Main image — opens the fullscreen lightbox */}
      <button
        type="button"
        onClick={() => current && setOpen(true)}
        aria-label="View image full screen"
        className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-white"
      >
        {current ? (
          <Image
            src={current.url}
            alt={current.altText ?? title}
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-cover"
            priority
          />
        ) : null}
      </button>

      {count > 1 ? (
        <div className="grid grid-cols-5 gap-3">
          {normalized.slice(0, 10).map((img, idx) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActive(idx)}
              className={cn(
                "relative aspect-square overflow-hidden border bg-white transition-colors duration-500 ease-luxe",
                idx === active
                  ? "border-tan"
                  : "border-transparent hover:border-gold/50",
              )}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={img.url}
                alt={img.altText ?? title}
                fill
                sizes="10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}

      {/* Fullscreen lightbox — kept mounted so it can fade in/out */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — image viewer`}
        aria-hidden={!open}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "fixed inset-0 z-[60] flex items-center justify-center bg-espresso transition-opacity duration-500 ease-luxe motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center text-cream transition-colors duration-500 ease-luxe hover:text-tan"
        >
          <CloseIcon />
        </button>

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              tabIndex={open ? 0 : -1}
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream transition-colors duration-500 ease-luxe hover:text-tan sm:left-5"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              tabIndex={open ? 0 : -1}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-cream transition-colors duration-500 ease-luxe hover:text-tan sm:right-5"
            >
              <ChevronRight />
            </button>
          </>
        ) : null}

        {current ? (
          <div className="relative h-[78vh] w-[90vw] max-w-4xl">
            <Image
              src={current.url}
              alt={current.altText ?? title}
              fill
              sizes="90vw"
              className="object-contain"
            />
          </div>
        ) : null}

        {count > 1 ? (
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-eyebrow uppercase text-cream/70">
            {active + 1} / {count}
          </p>
        ) : null}
      </div>
    </div>
  );
}
