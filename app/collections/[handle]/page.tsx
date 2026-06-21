import Link from "next/link";

import { CollectionView } from "@/components/product/CollectionView";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  type CollectionByHandleQueryData,
} from "@/lib/shopify/queries/collections";

export const revalidate = 60;

/** "leather-bags" → "Leather Bags" — a readable title from a handle. */
function humanizeHandle(handle: string) {
  return handle
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const rawHandle = resolvedParams?.handle;
  const handle =
    typeof rawHandle === "string" ? decodeURIComponent(rawHandle).trim() : "";
  if (!handle) return { title: "Collection" };

  try {
    const data = await storefrontRequest<CollectionByHandleQueryData>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: 1, after: null, sortKey: null, reverse: null },
    );
    const collection = data.collection;
    if (!collection) return { title: humanizeHandle(handle) || "Collection" };

    const description =
      collection.description.trim().split(/\n+/)[0] ||
      `${collection.title} — Lion Leather.`;
    return {
      title: collection.title,
      description,
      openGraph: { title: collection.title, description },
    };
  } catch {
    return { title: "Collection" };
  }
}

/** Calm placeholder for a collection that is missing or not yet stocked. */
function ComingSoon({ title }: { title: string }) {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="mx-auto max-w-lg text-center">
        <Eyebrow>Collection</Eyebrow>
        <Heading as="h1" className="mt-6">
          {title || "Coming Soon"}
        </Heading>
        <Divider className="mx-auto mt-10 max-w-[12rem]" />
        <p className="mt-10 text-body font-light text-stone">
          This collection is being prepared. New pieces are arriving soon.
        </p>
        <div className="mt-10">
          <ButtonLink href="/" variant="outline">
            Explore the House
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const rawHandle = resolvedParams?.handle;
  const handle =
    typeof rawHandle === "string" ? decodeURIComponent(rawHandle).trim() : "";

  if (!handle) {
    return <ComingSoon title="Coming Soon" />;
  }

  let data: CollectionByHandleQueryData | null = null;
  try {
    data = await storefrontRequest<CollectionByHandleQueryData>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: 100, after: null, sortKey: null, reverse: null },
    );
  } catch (err) {
    console.error("[Collection] Storefront error", err);
  }

  const collection = data?.collection ?? null;

  if (!collection) {
    return <ComingSoon title={humanizeHandle(handle)} />;
  }

  const products = collection.products.nodes;
  const description = collection.description.trim().split(/\n+/)[0] ?? "";

  return (
    <Section className="pt-14 sm:pt-20">
      <nav aria-label="Breadcrumb" className="mb-10 text-eyebrow uppercase text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors duration-500 ease-luxe hover:text-cognac">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/collections" className="transition-colors duration-500 ease-luxe hover:text-cognac">
              Collections
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{collection.title}</li>
        </ol>
      </nav>

      {/* Editorial header */}
      <div className="text-center">
        <Eyebrow>Collection</Eyebrow>
        <Heading as="h1" className="mt-6 lg:text-[clamp(2.5rem,5vw,5rem)]">
          {collection.title}
        </Heading>
        {description ? (
          <p className="mx-auto mt-6 max-w-xl text-body font-light text-stone">
            {description}
          </p>
        ) : null}
        <Divider className="mx-auto mt-10 max-w-xs" withMonogram={false} />
      </div>

      <div className="mt-14">
        {products.length ? (
          <CollectionView products={products} />
        ) : (
          <div className="mx-auto max-w-lg text-center">
            <Divider className="mx-auto max-w-[12rem]" />
            <p className="mt-10 text-body font-light text-stone">
              New pieces are arriving soon. Discover the rest of the house in
              the meantime.
            </p>
            <div className="mt-10">
              <ButtonLink href="/" variant="outline">
                Explore the House
              </ButtonLink>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
