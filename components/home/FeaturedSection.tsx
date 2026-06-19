import { ProductGrid } from "@/components/product/ProductGrid";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils/cn";
import type { ProductCard } from "@/lib/shopify/queries/products";

export function FeaturedSection({
  eyebrow,
  title,
  products,
  href,
  align = "left",
  className,
}: {
  eyebrow: string;
  title: string;
  products: ProductCard[];
  href: string;
  align?: "left" | "right";
  className?: string;
}) {
  // Degrade gracefully: a missing or empty collection hides the section.
  if (!products.length) return null;

  return (
    <Section className={className}>
      <Reveal>
        <div
          className={cn(
            "flex flex-wrap items-end justify-between gap-6",
            align === "right" && "flex-row-reverse",
          )}
        >
          <SectionTitle eyebrow={eyebrow} title={title} align={align} />
          <ButtonLink variant="link" href={href}>
            View All
          </ButtonLink>
        </div>

        <div className="mt-14">
          <ProductGrid products={products.slice(0, 4)} />
        </div>
      </Reveal>
    </Section>
  );
}
