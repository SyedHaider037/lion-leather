import { BrandStory } from "@/components/home/BrandStory";
import { ClosingCta } from "@/components/home/ClosingCta";
import { CraftBand } from "@/components/home/CraftBand";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { Hero } from "@/components/home/Hero";
import { Reviews } from "@/components/home/Reviews";
import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTION_BY_HANDLE_QUERY,
  type CollectionByHandleQueryData,
} from "@/lib/shopify/queries/collections";

async function getCollection(handle: string) {
  try {
    const data = await storefrontRequest<CollectionByHandleQueryData>(
      COLLECTION_BY_HANDLE_QUERY,
      { handle, first: 4, after: null },
    );
    return data.collection;
  } catch (err) {
    console.error("[Home] Storefront error", err);
    return null;
  }
}

export default async function Home() {
  const [shoes, wallets] = await Promise.all([
    getCollection("footwear"),
    getCollection("wallets"),
  ]);

  const shoeProducts = shoes?.products.nodes ?? [];
  const walletProducts = wallets?.products.nodes ?? [];

  // Best available imagery stands in until real campaign shots exist.
  const heroImage =
    shoeProducts[0]?.featuredImage ?? walletProducts[0]?.featuredImage ?? null;
  const storyImage =
    walletProducts[0]?.featuredImage ?? shoeProducts[1]?.featuredImage ?? null;

  return (
    <>
      <Hero image={heroImage} />
      <FeaturedSection
        eyebrow="Accessories"
        title="Wallets"
        products={walletProducts}
        href="/collections/wallets"
        className="bg-white"
      />
      <BrandStory image={storyImage} />
      <CraftBand />
      <FeaturedSection
        eyebrow="Footwear"
        title="Shoes"
        products={shoeProducts}
        href="/collections/footwear"
        align="right"
        className="bg-white"
      />
      <Reviews />
      <ClosingCta />
    </>
  );
}
