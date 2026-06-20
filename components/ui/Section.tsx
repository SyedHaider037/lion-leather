import { cn } from "@/lib/utils/cn";

import { Container } from "./Container";

type Tone = "cream" | "ink";

export function Section({
  children,
  className,
  containerClassName,
  tone = "cream",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: Tone;
}) {
  return (
    <section
      className={cn(
        "py-24 md:py-32 lg:py-40",
        tone === "ink" && "bg-surface text-cream",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
