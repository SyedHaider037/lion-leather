import "server-only";

import { getEnv, getShopifyStoreDomain } from "@/lib/env";
import { SHOPIFY_REVALIDATE_SECONDS } from "@/lib/constants";

export type StorefrontErrorDetail = {
  message: string;
  field?: string[];
};

export class StorefrontApiError extends Error {
  constructor(
    message: string,
    public readonly errors?: StorefrontErrorDetail[],
  ) {
    super(message);
    this.name = "StorefrontApiError";
  }
}

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

function storefrontEndpoint(): string {
  const { SHOPIFY_STOREFRONT_API_VERSION } = getEnv();
  const host = getShopifyStoreDomain();
  return `https://${host}/api/${SHOPIFY_STOREFRONT_API_VERSION}/graphql.json`;
}

/**
 * Server-only Storefront API request. Use from Server Components, Route Handlers, or Server Actions.
 * Pass `init.cache: "no-store"` for per-user data (e.g. carts) that must never be served stale.
 */
export async function storefrontRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  init?: { cache?: RequestCache },
): Promise<T> {
  const { SHOPIFY_STOREFRONT_ACCESS_TOKEN } = getEnv();
  const res = await fetch(storefrontEndpoint(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    ...(init?.cache
      ? { cache: init.cache }
      : { next: { revalidate: SHOPIFY_REVALIDATE_SECONDS } }),
  });

  if (!res.ok) {
    throw new StorefrontApiError(
      `Storefront HTTP ${res.status}: ${res.statusText}`,
    );
  }

  const json = (await res.json()) as GraphQLResponse<T>;

  if (json.errors?.length) {
    throw new StorefrontApiError(
      json.errors.map((e) => e.message).join("; "),
      json.errors.map((e) => ({ message: e.message })),
    );
  }

  if (!json.data) {
    throw new StorefrontApiError("Empty Storefront response");
  }

  return json.data;
}
