"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils/cn";

type Img = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden>
      <path d="M5 5l14 14M19 5L5 19" />
    </svg>
  );
}
function ChevronLeft() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}
function ChevronRight() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}

/** Desktop stacked image with cursor-following ~2× magnify; click opens the lightbox. */
function ZoomImage({
  img,
  title,
  index,
  onOpen,
}: {
  img: Img;
  title: string;
  index: number;
  onOpen: (i: number) => void;
}) {
  const [origin, setOrigin] = useState("50% 50%");
  const [zoom, setZoom] = useState(false);
  // Magnifying a small photo only makes it soft, so only large sources zoom.
  const canZoom = (img.width ?? 0) >= 1000;

  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      onMouseEnter={() => setZoom(canZoom)}
      onMouseLeave={() => setZoom(false)}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        setOrigin(`${x}% ${y}%`);
      }}
      aria-label={`Zoom image ${index + 1}, opens full screen`}
      className={cn(
        "relative block aspect-[4/5] w-full overflow-hidden bg-tile",
        canZoom ? "cursor-zoom-in" : "cursor-pointer",
      )}
    >
      <div
        className="absolute inset-0 m-auto h-full w-full overflow-hidden"
        style={{ maxWidth: img.width ?? undefined, maxHeight: img.height ?? undefined }}
      >
        <Image
          src={img.url}
          alt={img.altText ?? title}
          fill
          sizes={img.width && img.width < 720 ? `${img.width}px` : "(min-width: 1024px) 720px, 100vw"}
          priority={index === 0}
          style={{ transformOrigin: origin }}
          className={cn(
            "object-cover object-center transition-transform duration-[260ms] ease-out motion-reduce:!scale-100 motion-reduce:transition-none",
            zoom ? "scale-[2]" : "scale-100",
          )}
        />
      </div>
    </button>
  );
}

export function ProductGallery({ images, title }: { images: Img[]; title: string }) {
  const normalized = useMemo(() => images.filter(Boolean).slice(0, 7), [images]);
  const count = normalized.length;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const current = normalized[active];

  const openAt = useCallback((i: number) => {
    setActive(i);
    setOpen(true);
  }, []);
  const next = useCallback(() => {
    if (count > 1) setActive((i) => (i + 1) % count);
  }, [count]);
  const prev = useCallback(() => {
    if (count > 1) setActive((i) => (i - 1 + count) % count);
  }, [count]);

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

  function onTrackScroll() {
    const el = trackRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setActive((p) => (p === i ? p : i));
  }

  return (
    <div>
      {/* Desktop: large stacked images, one per row, this column scrolls */}
      <div className="hidden gap-4 lg:grid">
        {normalized.map((img, i) =>
          // The first image is above the fold: show it at once instead of
          // waiting for hydration to fade it in.
          i === 0 ? (
            <ZoomImage
              key={img.url}
              img={img}
              title={title}
              index={i}
              onOpen={openAt}
            />
          ) : (
            <Reveal key={img.url} variant="scale" delay={i * 80}>
              <ZoomImage img={img} title={title} index={i} onOpen={openAt} />
            </Reveal>
          ),
        )}
      </div>

      {/* Mobile: full-width swipeable carousel + dot indicators */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          onScroll={onTrackScroll}
          className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {normalized.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => openAt(i)}
              aria-label={`View image ${i + 1} full screen`}
              className="relative aspect-[4/5] w-full shrink-0 snap-center overflow-hidden bg-tile"
            >
              <div
                className="absolute inset-0 m-auto h-full w-full overflow-hidden"
                style={{ maxWidth: img.width ?? undefined, maxHeight: img.height ?? undefined }}
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? title}
                  fill
                  sizes={img.width && img.width < 640 ? `min(100vw, ${img.width}px)` : "100vw"}
                  priority={i === 0}
                  className="object-cover object-center"
                />
              </div>
            </button>
          ))}
        </div>
        {count > 1 ? (
          <div className="mt-3 flex justify-center gap-2">
            {normalized.map((img, i) => (
              <span
                key={img.url}
                aria-hidden
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-colors duration-200 ease-luxe",
                  i === active ? "bg-cognac" : "bg-ink/30",
                )}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Fullscreen lightbox — kept mounted so it can fade in/out */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`${title} — image viewer`}
        aria-hidden={!open}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className={cn(
          "fixed inset-0 z-[60] flex items-center justify-center bg-paper transition-opacity duration-[260ms] ease-luxe motion-reduce:transition-none",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <button
          ref={closeRef}
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close"
          tabIndex={open ? 0 : -1}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center text-ink transition-colors duration-200 ease-luxe hover:text-cognac"
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
              className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ink transition-colors duration-200 ease-luxe hover:text-cognac sm:left-5"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              tabIndex={open ? 0 : -1}
              className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center text-ink transition-colors duration-200 ease-luxe hover:text-cognac sm:right-5"
            >
              <ChevronRight />
            </button>
          </>
        ) : null}

        {current ? (
          <div
            className="relative h-[78vh] w-[90vw] max-w-4xl"
            style={{ maxWidth: current.width ?? undefined, maxHeight: current.height ?? undefined }}
          >
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
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-eyebrow uppercase text-ink/70">
            {active + 1} / {count}
          </p>
        ) : null}
      </div>
    </div>
  );
}
