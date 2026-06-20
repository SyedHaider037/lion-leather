import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils/cn";
import type { CollectionListItem } from "@/lib/shopify/queries/collections";

export function FeaturedCollections({
  collections,
}: {
  collections: CollectionListItem[];
}) {
  const tiles = collections.slice(0, 3);
  if (!tiles.length) return null;

  return (
    <Section>
      <Reveal>
        <SectionTitle
          align="center"
          eyebrow="The House"
          title="Explore the collections"
        />
      </Reveal>

      <div
        className={cn(
          "mt-14 grid gap-6 sm:grid-cols-2",
          tiles.length >= 3 && "lg:grid-cols-3",
        )}
      >
        {tiles.map((c, i) => {
          const image = c.image ?? c.products.nodes[0]?.featuredImage ?? null;
          return (
            <Reveal key={c.id} variant="scale" delay={i * 100}>
              <Link
                href={`/collections/${c.handle}`}
                className="group relative block aspect-[4/5] overflow-hidden bg-surface transition-shadow duration-500 ease-luxe hover:shadow-[0_24px_60px_-12px_rgba(194,146,90,0.5)]"
              >
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.altText ?? c.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
                  />
                ) : null}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-espresso/80 via-espresso/10 to-transparent"
                />
                <span className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <span className="font-serif text-2xl font-medium text-cream">
                    {c.title}
                  </span>
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
