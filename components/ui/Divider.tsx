import { cn } from "@/lib/utils/cn";

/**
 * The signature Lion Leather motif: a 1px gold hairline with a small
 * centered serif "LL" monogram. Used as the section divider site-wide.
 */
export function Divider({
  className,
  withMonogram = true,
}: {
  className?: string;
  withMonogram?: boolean;
}) {
  if (!withMonogram) {
    return (
      <div
        role="separator"
        className={cn("h-px w-full bg-gold/30", className)}
      />
    );
  }

  return (
    <div role="separator" className={cn("flex items-center gap-6", className)}>
      <span className="h-px flex-1 bg-gold/30" />
      <span
        aria-hidden
        className="select-none font-serif text-sm tracking-[0.3em] text-gold"
      >
        LL
      </span>
      <span className="h-px flex-1 bg-gold/30" />
    </div>
  );
}
