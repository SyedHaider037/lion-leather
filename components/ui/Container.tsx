import { cn } from "@/lib/utils/cn";

export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[87.5rem] px-6 md:px-[clamp(2.5rem,6vw,6rem)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
