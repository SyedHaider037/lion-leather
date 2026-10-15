import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/env";
import { storefrontRequest } from "@/lib/shopify/client";
import { logger } from "@/lib/logger";
import { SITEMAP_PAGE_SIZE } from "@/lib/constants";
import {
  COLLECTIONS_QUERY,
  type CollectionsQueryData,
} from "@/lib/shopify/queries/collections";
import {
  PRODUCTS_QUERY,
  type ProductsQueryData,
} from "@/lib/shopify/queries/products";

const STATIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/collections",
  "/leather-care",
  "/size-guide/shoes",
  "/shipping-returns",
  "/faq",
  "/track-order",
  "/privacy-policy",
  "/terms-of-service",
];

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = getSiteUrl();
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
        first: SITEMAP_PAGE_SIZE,
        query: null,
      }),
      storefrontRequest<CollectionsQueryData>(COLLECTIONS_QUERY, {
        first: SITEMAP_PAGE_SIZE,
      }),
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
    logger.error("Shopify fetch failed; static routes only", {
      page: "sitemap",
      err,
    });
  }

  return entries;
}
