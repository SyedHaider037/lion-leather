import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "outline" | "outline-light" | "link";

const base =
  "inline-flex items-center justify-center font-sans text-eyebrow uppercase tracking-[0.15em] transition-all duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid:
    "border border-ink bg-ink px-10 py-4 text-cream hover:border-tan hover:bg-tan",
  outline:
    "border border-ink/40 bg-transparent px-10 py-4 text-ink hover:border-ink hover:bg-ink hover:text-cream",
  "outline-light":
    "border border-cream/50 bg-transparent px-10 py-4 text-cream hover:border-cream hover:bg-cream hover:text-ink",
  link: "relative px-0 py-1 text-ink after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-tan after:transition-transform after:duration-500 after:ease-luxe hover:text-tan hover:after:origin-left hover:after:scale-x-100",
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
