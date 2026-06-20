import Image from "next/image";
import Link from "next/link";

import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
  type CollectionListItem,
} from "@/lib/shopify/queries/collections";

export const revalidate = 60;

export const metadata = {
  title: "Collections",
  description: "Explore the Lion Leather collections.",
};

// Shopify's auto-generated "Home page" collection is not a real category.
const HIDDEN_HANDLES = new Set(["frontpage"]);

function CollectionCard({ collection }: { collection: CollectionListItem }) {
  const image =
    collection.image ?? collection.products.nodes[0]?.featuredImage ?? null;

  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? collection.title}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
          />
        ) : null}
      </div>
      <div className="mt-6 text-center">
        <h2 className="font-serif text-2xl font-light text-ink">
          <span className="relative inline-block">
            {collection.title}
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink/40 transition-transform duration-500 ease-luxe group-hover:scale-x-100"
            />
          </span>
        </h2>
      </div>
    </Link>
  );
}

export default async function CollectionsIndexPage() {
  let collections: CollectionListItem[] = [];
  try {
    const data = await storefrontRequest<CollectionsQueryData>(
      COLLECTIONS_QUERY,
      { first: 50 },
    );
    collections = data.collections.nodes.filter(
      (c) => !HIDDEN_HANDLES.has(c.handle),
    );
  } catch (err) {
    console.error("[Collections] Storefront error", err);
  }

  return (
    <Section className="pt-14 sm:pt-20">
      <div className="text-center">
        <Eyebrow>The House</Eyebrow>
        <Heading as="h1" className="mt-6">
          Collections
        </Heading>
        <Divider className="mx-auto mt-10 max-w-xs" withMonogram={false} />
      </div>

      {collections.length ? (
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2">
          {collections.map((c) => (
            <CollectionCard key={c.id} collection={c} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-body font-light text-stone">
          New collections are arriving soon.
        </p>
      )}
    </Section>
  );
}
