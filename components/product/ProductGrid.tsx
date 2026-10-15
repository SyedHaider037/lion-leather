import Link from "next/link";

import { PhotoFrame } from "@/components/ui/PhotoFrame";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils/cn";
import { formatMoney } from "@/lib/utils/money";
import type { ProductCard } from "@/lib/shopify/queries/products";

const GRID_SIZES: Record<2 | 3 | 4, string> = {
  2: "(min-width: 640px) 50vw, 100vw",
  3: "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
  4: "(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw",
};

function ProductCardItem({
  product,
  sizes,
}: {
  product: ProductCard;
  sizes: string;
}) {
  const money = product.priceRange.minVariantPrice;
  const price = formatMoney(money.amount, money.currencyCode);

  return (
    <Link href={`/products/${product.handle}`} className="group block">
      <PhotoFrame
        image={product.featuredImage}
        alt={product.featuredImage?.altText ?? product.title}
        sizes={sizes}
        imageClassName="transition-transform duration-[280ms] ease-luxe group-hover:scale-[1.03]"
      />

      <div className="mt-4">
        <p className="font-serif text-card font-medium text-ink">
          <span className="relative inline-block">
            {product.title}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cognac transition-transform duration-[280ms] ease-luxe group-hover:scale-x-100"
            />
          </span>
        </p>
        <p className="mt-2 text-caption text-taupe">{price}</p>
      </div>
    </Link>
  );
}

export function ProductGrid({
  products,
  title,
  eyebrow,
  columns = 4,
  centerWhenSparse = true,
}: {
  products: ProductCard[];
  title?: string;
  eyebrow?: string;
  columns?: 2 | 3 | 4;
  centerWhenSparse?: boolean;
}) {
  // With one or two products a full grid leaves an awkward gap, so center
  // them at a constrained width that reads like a single grid cell — unless
  // the caller (e.g. filtered collection results) opts out.
  const sparse = centerWhenSparse && products.length < 3;

  return (
    <div>
      {title ? <SectionTitle eyebrow={eyebrow} title={title} /> : null}

      {sparse ? (
        <div
          className={cn(
            "flex flex-col items-center gap-x-8 gap-y-16 sm:flex-row sm:flex-wrap sm:justify-center",
            title && "mt-14",
          )}
        >
          {products.map((p) => (
            <div key={p.id} className="w-full max-w-sm">
              <ProductCardItem
                product={p}
                sizes="(min-width: 640px) 24rem, 100vw"
              />
            </div>
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2",
            title && "mt-14",
            columns === 3 && "lg:grid-cols-3",
            columns === 4 && "lg:grid-cols-3 xl:grid-cols-4",
          )}
        >
          {products.map((p) => (
            <ProductCardItem
              key={p.id}
              product={p}
              sizes={GRID_SIZES[columns]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
