import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "outline" | "link";

const base =
  "inline-flex items-center justify-center rounded-[5px] font-sans text-eyebrow uppercase tracking-[0.15em] transition-all duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid:
    "border border-cognac bg-cognac px-10 py-4 text-paper hover:brightness-90",
  outline:
    "border border-ink/30 bg-transparent px-10 py-4 text-ink hover:border-cognac hover:bg-cognac hover:text-paper",
  link: "relative rounded-none px-0 py-1 text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-cognac after:transition-transform after:duration-500 after:ease-luxe hover:text-cognac hover:after:origin-left hover:after:scale-x-100",
};

export function Button({
  children,
  className,
  variant = "solid",
  type,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
}) {
  return (
    <button
      type={type ?? "submit"}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  children,
  className,
  variant = "solid",
  href,
  ...props
}: React.ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
