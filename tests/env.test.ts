import { afterEach, describe, expect, it, vi } from "vitest";

const KEYS = [
  "SHOPIFY_STORE_DOMAIN",
  "SHOPIFY_STOREFRONT_ACCESS_TOKEN",
  "NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

// The env module caches its result, so load a fresh copy for each test.
async function freshEnv() {
  vi.resetModules();
  return import("@/lib/env");
}

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("Shopify environment", () => {
  it("throws a clear error when required values are missing", async () => {
    delete process.env.SHOPIFY_STORE_DOMAIN;
    delete process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    const { getEnv } = await freshEnv();
    expect(() => getEnv()).toThrow(/Invalid environment/);
  });

  it("strips protocol and trailing slash from the store domain", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "https://shop.example.com/";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "placeholder";
    const { getShopifyStoreDomain } = await freshEnv();
    expect(getShopifyStoreDomain()).toBe("shop.example.com");
  });

  it("falls back to the server domain for the public domain", async () => {
    process.env.SHOPIFY_STORE_DOMAIN = "shop.example.com";
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN = "placeholder";
    delete process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const { getPublicStoreDomain } = await freshEnv();
    expect(getPublicStoreDomain()).toBe("shop.example.com");
  });
});
