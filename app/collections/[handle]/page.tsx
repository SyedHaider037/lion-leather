import Link from "next/link";

import { ProductGrid } from "@/components/product/ProductGrid";
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
import { cn } from "@/lib/utils/cn";

export const revalidate = 60;

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

const SORT_OPTIONS = [
  { key: "featured", label: "Featured" },
  { key: "price-asc", label: "Price, Low to High" },
  { key: "price-desc", label: "Price, High to Low" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["key"];

function sortVariables(sort: SortKey) {
  if (sort === "price-asc") return { sortKey: "PRICE", reverse: false };
  if (sort === "price-desc") return { sortKey: "PRICE", reverse: true };
  return { sortKey: null, reverse: null };
}

/** "leather-bags" → "Leather Bags" — a readable title from a handle. */
function humanizeHandle(handle: string) {
  return handle
    .split(/[-_]/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
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
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams: Promise<{ cursor?: string; sort?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;

  const rawHandle = resolvedParams?.handle;
  const handle =
    typeof rawHandle === "string" ? decodeURIComponent(rawHandle).trim() : "";

  const after =
    typeof resolvedSearch?.cursor === "string" && resolvedSearch.cursor.length
      ? resolvedSearch.cursor
      : null;

  const sort: SortKey = SORT_OPTIONS.some((o) => o.key === resolvedSearch?.sort)
    ? (resolvedSearch.sort as SortKey)
    : "featured";

  if (!handle) {
    return <ComingSoon title="Coming Soon" />;
  }

  let data: CollectionByHandleQueryData | null = null;
  try {
    data = await storefrontRequest<CollectionByHandleQueryData>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: 12, after, ...sortVariables(sort) },
    );
  } catch (err) {
    console.error("[Collection] Storefront error", err);
  }

  const collection = data?.collection ?? null;

  if (!collection) {
    // Missing handle (e.g. a collection not yet created in Shopify) shows a
    // calm "Coming Soon" rather than an error — future-proof for new lines.
    return <ComingSoon title={humanizeHandle(handle)} />;
  }

  const products = collection.products.nodes;
  const pageInfo = collection.products.pageInfo;
  const description = collection.description.trim().split(/\n+/)[0] ?? "";

  const nextPageHref = (cursor: string) => {
    const qs = new URLSearchParams();
    qs.set("cursor", cursor);
    if (sort !== "featured") qs.set("sort", sort);
    return `/collections/${collection.handle}?${qs.toString()}`;
  };

  return (
    <Section className="bg-white pt-14 sm:pt-20">
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

      {/* Quiet sort controls */}
      {products.length > 1 || sort !== "featured" ? (
        <nav
          aria-label="Sort"
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {SORT_OPTIONS.map((option) => (
            <Link
              key={option.key}
              href={
                option.key === "featured"
                  ? `/collections/${collection.handle}`
                  : `/collections/${collection.handle}?sort=${option.key}`
              }
              aria-current={sort === option.key ? "true" : undefined}
              className={cn(
                "text-eyebrow uppercase transition-colors duration-500 ease-luxe",
                sort === option.key
                  ? "text-tan underline decoration-tan/60 decoration-1 underline-offset-8"
                  : "text-stone hover:text-ink",
              )}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      ) : null}

      <div className="mt-16">
        {products.length ? (
          <>
            <ProductGrid products={products} columns={3} />

            {pageInfo.hasNextPage && pageInfo.endCursor ? (
              <div className="mt-16 flex justify-center">
                <ButtonLink
                  variant="link"
                  href={nextPageHref(pageInfo.endCursor)}
                >
                  View more
                </ButtonLink>
              </div>
            ) : null}
          </>
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
