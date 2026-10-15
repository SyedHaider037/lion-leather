import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CraftBand } from "@/components/home/CraftBand";
import { CraftTeaser } from "@/components/home/CraftTeaser";
import { FeaturedProduct } from "@/components/home/FeaturedProduct";
import { Hero } from "@/components/home/Hero";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  COLLECTIONS_QUERY,
  type CollectionByHandleQueryData,
  type CollectionsQueryData,
  type CollectionListItem,
} from "@/lib/shopify/queries/collections";
import type { ProductCard } from "@/lib/shopify/queries/products";

const HIDDEN_HANDLES = new Set(["frontpage"]);

const imageOf = (c: CollectionListItem | undefined) =>
  c?.image ?? c?.products.nodes[0]?.featuredImage ?? null;

export default async function Home() {
  let collections: CollectionListItem[] = [];
  let featured: ProductCard | null = null;

  try {
    const [colData, footwear] = await Promise.all([
      storefrontRequest<CollectionsQueryData>(COLLECTIONS_QUERY, { first: 20 }),
      storefrontRequest<CollectionByHandleQueryData>(
        COLLECTION_BY_HANDLE_QUERY,
        {
          handle: "footwear",
          first: 1,
          after: null,
          sortKey: null,
          reverse: null,
        },
      ).catch(() => null),
    ]);
    collections = colData.collections.nodes.filter(
      (c) => !HIDDEN_HANDLES.has(c.handle),
    );
    featured = footwear?.collection?.products.nodes[0] ?? null;
  } catch (err) {
    console.error("[Home] Storefront error", err);
  }

  // Best available imagery stands in until real campaign shots exist.
  const heroImage = featured?.featuredImage ?? imageOf(collections[0]) ?? null;
  const craftImage =
    imageOf(collections[1]) ??
    imageOf(collections[0]) ??
    featured?.featuredImage ??
    null;

  return (
    <>
      <Hero image={heroImage} />
      <FeaturedProduct product={featured} />
      <CraftTeaser image={craftImage} />
      <CategoryShowcase collections={collections} />
      <CraftBand />
      <ClosingCta />
    </>
  );
}
