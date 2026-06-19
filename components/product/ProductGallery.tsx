"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { cn } from "@/lib/utils/cn";

type Img = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

export function ProductGallery({ images, title }: { images: Img[]; title: string }) {
  const normalized = useMemo(() => images.filter(Boolean), [images]);
  const [active, setActive] = useState(0);
  const current = normalized[active];

  return (
    <div className="grid gap-4">
      <div className="relative aspect-[4/5] overflow-hidden bg-white">
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
      </div>

      {normalized.length > 1 ? (
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
    </div>
  );
}
