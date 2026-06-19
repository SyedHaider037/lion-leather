import { cn } from "@/lib/utils/cn";

import { Eyebrow } from "./Eyebrow";
import { Heading } from "./Heading";

type Align = "left" | "center" | "right";

export function SectionTitle({
  eyebrow,
  title,
  align = "left",
  as = "h2",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  align?: Align;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" && "text-center",
        align === "right" && "text-right",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Heading as={as} tone="title" className={eyebrow ? "mt-4" : undefined}>
        {title}
      </Heading>
    </div>
  );
}
