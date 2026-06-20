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
        "py-16 sm:py-20 lg:py-32",
        tone === "ink" && "bg-surface text-cream",
        className,
      )}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
