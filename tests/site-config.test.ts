import { afterEach, describe, expect, it, vi } from "vitest";

const KEYS = [
  "NEXT_PUBLIC_WHATSAPP_NUMBER",
  "NEXT_PUBLIC_CONTACT_EMAIL",
] as const;
const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));

// The config reads the environment when it loads, so import a fresh copy.
async function freshConfig() {
  vi.resetModules();
  return import("@/lib/site-config");
}

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("site config", () => {
  it("uses placeholders when nothing is set", async () => {
    delete process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
    delete process.env.NEXT_PUBLIC_CONTACT_EMAIL;
    const config = await freshConfig();
    expect(config.WHATSAPP_NUMBER).toBe("+92 300 0000000");
    expect(config.CONTACT_EMAIL).toBe("hello@example.com");
    expect(config.WHATSAPP_URL).toBe("https://wa.me/923000000000");
  });

  it("reads the number and email from the environment", async () => {
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER = "+44 20 7946 0000";
    process.env.NEXT_PUBLIC_CONTACT_EMAIL = "support@example.org";
    const config = await freshConfig();
    expect(config.WHATSAPP_NUMBER).toBe("+44 20 7946 0000");
    expect(config.CONTACT_EMAIL).toBe("support@example.org");
    expect(config.WHATSAPP_URL).toBe("https://wa.me/442079460000");
  });
});

describe("buildWhatsappUrl", () => {
  it("keeps digits only, whatever the number format", async () => {
    const { buildWhatsappUrl } = await freshConfig();
    expect(buildWhatsappUrl("+92 300-000 0000")).toBe(
      "https://wa.me/923000000000",
    );
    expect(buildWhatsappUrl("(0300) 000.0000")).toBe(
      "https://wa.me/03000000000",
    );
  });

  it("adds a URL-encoded message when given one", async () => {
    const { buildWhatsappUrl } = await freshConfig();
    expect(buildWhatsappUrl("+92 300 0000000", "Order #1024 & more")).toBe(
      "https://wa.me/923000000000?text=Order%20%231024%20%26%20more",
    );
  });
});
