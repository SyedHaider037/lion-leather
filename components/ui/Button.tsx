import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type Variant = "solid" | "outline" | "outline-light" | "link";

const base =
  "inline-flex items-center justify-center font-sans text-eyebrow uppercase tracking-[0.15em] transition-all duration-500 ease-luxe disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  solid:
    "border border-camel bg-camel px-10 py-4 text-espresso hover:brightness-110",
  outline:
    "border border-cream/40 bg-transparent px-10 py-4 text-cream hover:border-camel hover:bg-camel hover:text-espresso",
  "outline-light":
    "border border-cream/40 bg-transparent px-10 py-4 text-cream hover:border-camel hover:bg-camel hover:text-espresso",
  link: "relative px-0 py-1 text-cream after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-right after:scale-x-0 after:bg-camel after:transition-transform after:duration-500 after:ease-luxe hover:text-camel hover:after:origin-left hover:after:scale-x-100",
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
