import { cn } from "@/lib/utils/cn";

import { Container } from "./Container";

type Tone = "paper" | "surface";
type Rhythm = "sm" | "md" | "lg" | "xl";

// Varied vertical rhythm so sections breathe differently, never uniform.
const RHYTHM: Record<Rhythm, string> = {
  sm: "py-12 md:py-16",
  md: "py-16 md:py-24",
  lg: "py-24 md:py-32 lg:py-40",
  xl: "py-32 md:py-44 lg:py-56",
};

export function Section({
  children,
  className,
  containerClassName,
  tone = "paper",
  rhythm = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  /** "paper" = page background; "surface" = a raised tonal band. */
  tone?: Tone | "ink";
  rhythm?: Rhythm;
}) {
  const raised = tone === "surface" || tone === "ink";
  return (
    <section className={cn(RHYTHM[rhythm], raised && "bg-surface", className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
