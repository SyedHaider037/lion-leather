import { z } from "zod";

const envSchema = z.object({
  SHOPIFY_STORE_DOMAIN: z
    .string()
    .min(1, "SHOPIFY_STORE_DOMAIN is required (e.g. your-store.myshopify.com)"),
  SHOPIFY_STOREFRONT_ACCESS_TOKEN: z
    .string()
    .min(1, "SHOPIFY_STOREFRONT_ACCESS_TOKEN is required"),
  SHOPIFY_STOREFRONT_API_VERSION: z.string().optional().default("2025-01"),
  NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function readEnv(): Env {
  const parsed = envSchema.safeParse({
    SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_STOREFRONT_ACCESS_TOKEN:
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    SHOPIFY_STOREFRONT_API_VERSION: process.env.SHOPIFY_STOREFRONT_API_VERSION,
    NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN:
      process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
  });

  if (!parsed.success) {
    const message = parsed.error.issues.map((i) => i.message).join("; ");
    throw new Error(`Invalid environment: ${message}`);
  }

  return parsed.data;
}

let cached: Env | null = null;

/** Validated Shopify + app env. Throws at runtime if misconfigured. */
export function getEnv(): Env {
  if (!cached) {
    cached = readEnv();
  }
  return cached;
}

/** Store hostname for Storefront API (no protocol). */
export function getShopifyStoreDomain(): string {
  return getEnv()
    .SHOPIFY_STORE_DOMAIN.replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
}

/** Public store domain for checkout URLs / client (falls back to server domain). */
export function getPublicStoreDomain(): string {
  const env = getEnv();
  return (
    env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(
      /\/$/,
      "",
    ) ?? getShopifyStoreDomain()
  );
}

const DEFAULT_SITE_URL = "https://example.com";

const siteUrlSchema = z
  .string()
  .url("NEXT_PUBLIC_SITE_URL must be a valid URL");

let cachedSiteUrl: string | null = null;

/**
 * Public origin of the site (no trailing slash). Validated on its own so
 * metadata, robots and sitemap don't need the Shopify variables.
 */
export function getSiteUrl(): string {
  if (!cachedSiteUrl) {
    const raw = process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL;
    const parsed = siteUrlSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(`Invalid environment: ${parsed.error.issues[0].message}`);
    }
    cachedSiteUrl = parsed.data.replace(/\/$/, "");
  }
  return cachedSiteUrl;
}
