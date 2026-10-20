import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// getSiteUrl caches its result, so load a fresh copy of the module each time.
async function loadGetSiteUrl() {
  vi.resetModules();
  return (await import("@/lib/env")).getSiteUrl;
}

describe("getSiteUrl", () => {
  const original = process.env.NEXT_PUBLIC_SITE_URL;

  beforeEach(() => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
  });

  afterEach(() => {
    if (original === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = original;
  });

  it("falls back to the default origin", async () => {
    const getSiteUrl = await loadGetSiteUrl();
    expect(getSiteUrl()).toBe("https://example.com");
  });

  it("uses NEXT_PUBLIC_SITE_URL and strips a trailing slash", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://demo.example.org/";
    const getSiteUrl = await loadGetSiteUrl();
    expect(getSiteUrl()).toBe("https://demo.example.org");
  });

  it("throws for a value that is not a URL", async () => {
    process.env.NEXT_PUBLIC_SITE_URL = "not a url";
    const getSiteUrl = await loadGetSiteUrl();
    expect(() => getSiteUrl()).toThrow(/valid URL/);
  });
});
