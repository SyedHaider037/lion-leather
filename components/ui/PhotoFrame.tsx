import Image from "next/image";

import { cn } from "@/lib/utils/cn";

export type PhotoSource = {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
};

/**
 * The one frame every product, collection and gallery photo sits in: 4:5, on a
 * neutral tile that works behind dark and white photos alike, cropped from the
 * centre. The photo is never drawn larger than its own pixels — a small source
 * sits as a plate on the tile instead of being blown up.
 */
export function PhotoFrame({
  image,
  alt,
  sizes,
  priority,
  rounded = true,
  aspect = "aspect-[4/5]",
  className,
  imageClassName,
  imageStyle,
}: {
  image: PhotoSource | null;
  alt?: string;
  sizes: string;
  priority?: boolean;
  rounded?: boolean;
  /** Editorial banners only; product photos stay 4:5. */
  aspect?: string;
  className?: string;
  imageClassName?: string;
  imageStyle?: React.CSSProperties;
}) {
  const w = image?.width ?? undefined;
  const h = image?.height ?? undefined;
  // Small sources only need a request as wide as themselves.
  const effectiveSizes = w && w < 640 ? `min(100vw, ${w}px)` : sizes;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-tile",
        aspect,
        rounded && "rounded-[5px]",
        className,
      )}
    >
      {image ? (
        <div
          className="absolute inset-0 m-auto h-full w-full overflow-hidden"
          style={{ maxWidth: w, maxHeight: h }}
        >
          <Image
            src={image.url}
            alt={alt ?? image.altText ?? ""}
            fill
            sizes={effectiveSizes}
            priority={priority}
            style={imageStyle}
            className={cn("object-cover object-center", imageClassName)}
          />
        </div>
      ) : null}
    </div>
  );
}
