import { cn } from "@/lib/utils/cn";

// page: h1 page title · title: h2 section/product title · subtle: h3 sub-title
type Tone = "page" | "title" | "subtle";

export function Heading({
  children,
  as: Tag = "h1",
  tone = "page",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3" | "h4";
  tone?: Tone;
  className?: string;
}) {
  const base = "font-serif font-medium";
  const toneClass =
    tone === "page"
      ? "text-h1"
      : tone === "title"
        ? "text-title"
        : "text-h3";

  return <Tag className={cn(base, toneClass, className)}>{children}</Tag>;
}
