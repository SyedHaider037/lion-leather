import { cn } from "@/lib/utils/cn";

type Tone = "display" | "title" | "subtle";

export function Heading({
  children,
  as: Tag = "h1",
  tone = "display",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  tone?: Tone;
  className?: string;
}) {
  const base = "font-serif font-medium";
  const toneClass =
    tone === "display"
      ? "text-display"
      : tone === "title"
        ? "text-title"
        : "text-2xl leading-snug";

  return <Tag className={cn(base, toneClass, className)}>{children}</Tag>;
}
