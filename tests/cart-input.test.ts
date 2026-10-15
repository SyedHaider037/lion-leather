import { describe, expect, it } from "vitest";

import {
  addCartLines,
  cartLineRemoveSchema,
  cartLineUpdateSchema,
  removeCartLines,
  updateCartLines,
} from "@/lib/cart/api";

const LINE = "gid://shopify/CartLine/abc123";
const VARIANT = "gid://shopify/ProductVariant/42";

describe("cart line update input", () => {
  it.each([0, 1, 50, 99])("accepts quantity %i", (quantity) => {
    expect(
      cartLineUpdateSchema.safeParse({ lineId: LINE, quantity }).success,
    ).toBe(true);
  });

  it.each([-1, 100, 1.5, Number.NaN])("rejects quantity %s", (quantity) => {
    expect(
      cartLineUpdateSchema.safeParse({ lineId: LINE, quantity }).success,
    ).toBe(false);
  });

  it("rejects a line id without the CartLine prefix", () => {
    expect(
      cartLineUpdateSchema.safeParse({
        lineId: "gid://shopify/Product/1",
        quantity: 1,
      }).success,
    ).toBe(false);
    expect(
      cartLineUpdateSchema.safeParse({ lineId: "", quantity: 1 }).success,
    ).toBe(false);
  });
});

describe("cart line remove input", () => {
  it("accepts a CartLine id and rejects anything else", () => {
    expect(cartLineRemoveSchema.safeParse({ lineId: LINE }).success).toBe(true);
    expect(cartLineRemoveSchema.safeParse({ lineId: "abc" }).success).toBe(
      false,
    );
  });
});

// These helpers validate their input before any network call, so a bad value
// throws here without a request being made.
describe("cart mutations validate input before calling Shopify", () => {
  it("addCartLines rejects a bad variant id", async () => {
    await expect(
      addCartLines({
        cartId: "c",
        lines: [{ merchandiseId: "bad", quantity: 1 }],
      }),
    ).rejects.toThrow();
  });

  it("addCartLines rejects quantity 0, quantity 100 and an empty list", async () => {
    await expect(
      addCartLines({
        cartId: "c",
        lines: [{ merchandiseId: VARIANT, quantity: 0 }],
      }),
    ).rejects.toThrow();
    await expect(
      addCartLines({
        cartId: "c",
        lines: [{ merchandiseId: VARIANT, quantity: 100 }],
      }),
    ).rejects.toThrow();
    await expect(addCartLines({ cartId: "c", lines: [] })).rejects.toThrow();
  });

  it("updateCartLines rejects an out-of-range quantity", async () => {
    await expect(
      updateCartLines({ cartId: "c", lines: [{ id: LINE, quantity: 100 }] }),
    ).rejects.toThrow();
  });

  it("removeCartLines rejects a bad line id", async () => {
    await expect(
      removeCartLines({ cartId: "c", lineIds: ["nope"] }),
    ).rejects.toThrow();
  });
});
