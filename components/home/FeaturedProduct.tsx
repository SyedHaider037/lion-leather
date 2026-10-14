import Image from "next/image";

import { ButtonLink } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { formatMoney } from "@/lib/utils/money";
import type { ProductCard } from "@/lib/shopify/queries/products";

/** One product treated as an object — image ~60%, italic line, quiet link. */
export function FeaturedProduct({ product }: { product: ProductCard | null }) {
  if (!product) return null;
  const money = product.priceRange.minVariantPrice;

  return (
    <Section rhythm="xl">
      <Reveal>
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-20">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-surface">
            {product.featuredImage ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText ?? product.title}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="max-w-md">
            <Eyebrow>The Object</Eyebrow>
            <h2 className="mt-6 font-serif text-h2 font-medium text-ink">
              {product.title}
            </h2>
            <p className="mt-5 font-serif text-h3 font-light italic text-taupe">
              Considered down to the last stitch — made to be lived in.
            </p>
            <p className="mt-6 text-body-lg font-light text-taupe">
              {formatMoney(money.amount, money.currencyCode)}
            </p>
            <div className="mt-8">
              <ButtonLink variant="link" className="py-3.5! after:bottom-3.5!" href={`/products/${product.handle}`}>
                View the piece
              </ButtonLink>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
