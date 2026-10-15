import { PhotoFrame } from "@/components/ui/PhotoFrame";
import Link from "next/link";

import { CollectionView } from "@/components/product/CollectionView";
import { ButtonLink } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  type CollectionByHandleQueryData,
  type CollectionsQueryData,
  type CollectionListItem,
} from "@/lib/shopify/queries/collections";

export const revalidate = 60;

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

function ComingSoon({ title }: { title: string }) {
  return (
    <Section className="pt-14 sm:pt-20">
      <div className="mx-auto max-w-lg text-center">
        <Eyebrow>Collection</Eyebrow>
        <Heading as="h1" className="mt-6">
          {title || "Coming Soon"}
        </Heading>
        <Divider className="mx-auto mt-10 max-w-[12rem]" />
        <p className="mt-10 text-body font-light text-taupe">
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

function RelatedTile({ collection }: { collection: CollectionListItem }) {
  const image =
    collection.image ?? collection.products.nodes[0]?.featuredImage ?? null;
  return (
    <Link href={`/collections/${collection.handle}`} className="group block">
      <PhotoFrame
        image={image}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        imageClassName="transition-transform duration-[280ms] ease-luxe group-hover:scale-[1.03]"
      />
      <h3 className="mt-4 font-serif text-h3 font-medium text-ink">
        <span className="relative inline-block">
          {collection.title}
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cognac transition-transform duration-[280ms] ease-luxe group-hover:scale-x-100"
          />
        </span>
      </h3>
    </Link>
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
  let allCollections: CollectionListItem[] = [];
  try {
    const [colData, listData] = await Promise.all([
      storefrontRequest<CollectionByHandleQueryData>(COLLECTION_BY_HANDLE_QUERY, {
        handle,
        first: 100,
        after: null,
        sortKey: null,
        reverse: null,
      }),
      storefrontRequest<CollectionsQueryData>(COLLECTIONS_QUERY, {
        first: 20,
      }).catch(() => null),
    ]);
    data = colData;
    allCollections = listData?.collections.nodes ?? [];
  } catch (err) {
    console.error("[Collection] Storefront error", err);
  }

  const collection = data?.collection ?? null;
  if (!collection) {
    return <ComingSoon title={humanizeHandle(handle)} />;
  }

  const products = collection.products.nodes;
  const description = collection.description.trim().split(/\n+/)[0] ?? "";
  const headerImage =
    collection.image ?? products[0]?.featuredImage ?? null;
  const related = allCollections.filter(
    (c) => c.handle !== "frontpage" && c.handle !== collection.handle,
  );

  return (
    <Section className="pt-14 sm:pt-20">
      <nav aria-label="Breadcrumb" className="text-eyebrow uppercase text-taupe">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="transition-colors duration-200 ease-luxe hover:text-cognac">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/collections" className="transition-colors duration-200 ease-luxe hover:text-cognac">
              Collections
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-ink">{collection.title}</li>
        </ol>
      </nav>

      {/* Editorial header — left text, large image */}
      <div className="mt-10 grid items-end gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <Eyebrow>Collection</Eyebrow>
          <Heading as="h1" className="mt-6">
            {collection.title}
          </Heading>
          {description ? (
            <p className="mt-6 max-w-md text-body-lg font-light text-taupe">
              {description}
            </p>
          ) : null}
        </div>
        {headerImage ? (
          <PhotoFrame
            image={headerImage}
            alt={headerImage.altText ?? collection.title}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 50vw, 100vw"
            priority
          />
        ) : null}
      </div>

      <div className="mt-14 h-px bg-taupe/30" />

      <div className="mt-12">
        {products.length ? (
          <CollectionView products={products} />
        ) : (
          <div className="mx-auto max-w-lg py-10 text-center">
            <p className="text-body font-light text-taupe">
              New pieces are arriving soon.
            </p>
            <div className="mt-8">
              <ButtonLink href="/" variant="outline">
                Explore the House
              </ButtonLink>
            </div>
          </div>
        )}
      </div>

      {/* Quiet editorial band */}
      <div className="mt-24 max-w-2xl">
        <p className="font-serif text-h3 font-light italic text-taupe">
          Full-grain leather, cut and stitched by hand — pieces meant to age
          well and stay with you.
        </p>
      </div>

      {/* Related rail — other collections */}
      {related.length ? (
        <div className="mt-20 border-t border-gold/30 pt-16">
          <SectionTitle eyebrow="The House" title="Continue exploring" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((c) => (
              <RelatedTile key={c.id} collection={c} />
            ))}
          </div>
        </div>
      ) : null}
    </Section>
  );
}
