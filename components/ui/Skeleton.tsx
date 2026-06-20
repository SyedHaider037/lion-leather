import { cn } from "@/lib/utils/cn";

/**
 * Loading placeholder in the brand's stone tone with a soft opacity
 * shimmer — no gray pulse boxes.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-shimmer bg-cream/10 motion-reduce:animate-none",
        className,
      )}
    />
  );
}
