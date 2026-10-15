import Link from "next/link";
import { PhotoFrame } from "@/components/ui/PhotoFrame";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import type { CollectionListItem } from "@/lib/shopify/queries/collections";

function Tile({
  collection,
  sizes,
}: {
  collection: CollectionListItem;
  sizes: string;
}) {
  const image =
    collection.image ?? collection.products.nodes[0]?.featuredImage ?? null;
  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <PhotoFrame
        image={image}
        sizes={sizes}
        imageClassName="transition-transform duration-700 ease-luxe group-hover:scale-[1.03]"
      />
      <div className="mt-4">
        <h3 className="font-serif text-h3 font-medium text-ink">
          <span className="relative inline-block">
            {collection.title}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cognac transition-transform duration-500 ease-luxe group-hover:scale-x-100"
            />
          </span>
        </h3>
        <span className="mt-1 block text-eyebrow uppercase text-taupe">
          Explore →
        </span>
      </div>
    </Link>
  );
}

/** Asymmetric category tiles (one large, one smaller) — not a uniform grid. */
export function CategoryShowcase({
  collections,
}: {
  collections: CollectionListItem[];
}) {
  const find = (h: string) => collections.find((c) => c.handle === h);
  const shoes = find("footwear");
  const wallets = find("wallets");
  if (!shoes && !wallets) return null;

  return (
    <Section rhythm="lg">
      <Reveal>
        <SectionTitle eyebrow="Collections" title="Shoes & wallets" />
      </Reveal>
      <Reveal>
        <div className="mt-12 grid items-start gap-6 sm:grid-cols-[3fr_2fr] lg:gap-10">
          {shoes ? (
            <Tile collection={shoes} sizes="(min-width: 640px) 55vw, 100vw" />
          ) : null}
          {wallets ? (
            <div className="sm:pt-16">
              <Tile collection={wallets} sizes="(min-width: 640px) 38vw, 100vw" />
            </div>
          ) : null}
        </div>
      </Reveal>
    </Section>
  );
}
