import { cn } from "@/lib/utils/cn";

export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("font-sans text-eyebrow uppercase text-taupe", className)}>
      {children}
    </p>
  );
}
