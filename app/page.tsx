import { BrandStory } from "@/components/home/BrandStory";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CraftBand } from "@/components/home/CraftBand";
import { FeaturedCollections } from "@/components/home/FeaturedCollections";
import { Hero } from "@/components/home/Hero";
import { Reviews } from "@/components/home/Reviews";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
  type CollectionListItem,
} from "@/lib/shopify/queries/collections";

const HIDDEN_HANDLES = new Set(["frontpage"]);

const imageOf = (c: CollectionListItem | undefined) =>
  c?.image ?? c?.products.nodes[0]?.featuredImage ?? null;

export default async function Home() {
  let collections: CollectionListItem[] = [];
  try {
    const data = await storefrontRequest<CollectionsQueryData>(
      COLLECTIONS_QUERY,
      { first: 20 },
    );
    collections = data.collections.nodes.filter(
      (c) => !HIDDEN_HANDLES.has(c.handle),
    );
  } catch (err) {
    console.error("[Home] Storefront error", err);
  }

  // Best available imagery stands in until real campaign shots exist.
  const heroImage = imageOf(collections[0]) ?? imageOf(collections[1]) ?? null;
  const storyImage = imageOf(collections[1]) ?? imageOf(collections[0]) ?? null;

  return (
    <>
      <Hero image={heroImage} />
      <FeaturedCollections collections={collections} />
      <BrandStory image={storyImage} />
      <CraftBand />
      <Reviews />
      <ClosingCta />
    </>
  );
}
