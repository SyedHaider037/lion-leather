import type { MetadataRoute } from "next";

import { storefrontRequest } from "@/lib/shopify/client";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
} from "@/lib/shopify/queries/collections";
import {
  PRODUCTS_QUERY,
  type ProductsQueryData,
} from "@/lib/shopify/queries/products";

// Set NEXT_PUBLIC_SITE_URL to the production origin; falls back to the domain.
const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://lionleather.pk"
).replace(/\/$/, "");

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/collections",
  "/search",
  "/leather-care",
  "/sizing-guide",
  "/shipping-returns",
  "/faq",
  "/track-order",
  "/privacy-policy",
  "/terms-of-service",
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));

  try {
    const [products, collections] = await Promise.all([
      storefrontRequest<ProductsQueryData>(PRODUCTS_QUERY, {
        first: 250,
        query: null,
      }),
      storefrontRequest<CollectionsQueryData>(COLLECTIONS_QUERY, { first: 250 }),
    ]);

    for (const product of products.products.nodes) {
      entries.push({
        url: `${SITE_URL}/products/${product.handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }

    for (const collection of collections.collections.nodes) {
      if (collection.handle === "frontpage") continue;
      entries.push({
        url: `${SITE_URL}/collections/${collection.handle}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }
  } catch (err) {
    // Degrade gracefully — serve the static routes even if Shopify is down.
    console.error("[sitemap] Shopify fetch failed; static routes only", err);
  }

  return entries;
}
