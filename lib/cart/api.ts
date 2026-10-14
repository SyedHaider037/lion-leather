import "server-only";

import { z } from "zod";

import { storefrontRequest } from "@/lib/shopify/client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
  type Cart,
  type CartCreateData,
  type CartLinesAddData,
  type CartLinesRemoveData,
  type CartLinesUpdateData,
  type CartQueryData,
} from "@/lib/shopify/queries/cart";

// Storefront cart helpers. Deliberately NOT a "use server" module: everything
// exported from a "use server" file becomes a publicly callable endpoint, and
// these take a cart id as an argument. Only lib/cart/actions.ts is exposed.

const merchandiseIdSchema = z
  .string()
  .startsWith("gid://shopify/ProductVariant/");
const lineIdSchema = z.string().startsWith("gid://shopify/CartLine/");
// Whole numbers only; Shopify clamps to available stock on its side.
const quantitySchema = z.number().int().min(0).max(99);

const cartLinesInputSchema = z
  .array(
    z.object({
      merchandiseId: merchandiseIdSchema,
      quantity: quantitySchema.min(1),
    }),
  )
  .min(1);
const lineUpdatesSchema = z
  .array(z.object({ id: lineIdSchema, quantity: quantitySchema }))
  .min(1);
const lineIdsSchema = z.array(lineIdSchema).min(1);

export const cartLineUpdateSchema = z.object({
  lineId: lineIdSchema,
  quantity: quantitySchema,
});
export const cartLineRemoveSchema = z.object({ lineId: lineIdSchema });

function assertNoUserErrors(
  errors: { field: string[] | null; message: string }[],
  label: string,
) {
  if (errors.length) {
    const message = errors.map((e) => e.message).join("; ");
    throw new Error(`${label}: ${message}`);
  }
}

export async function getCart(cartId: string): Promise<Cart | null> {
  const data = await storefrontRequest<CartQueryData>(CART_QUERY, { cartId });
  return data.cart;
}

export async function createCart(input?: {
  lines?: { merchandiseId: string; quantity: number }[];
}): Promise<Cart> {
  const lines = input?.lines
    ? cartLinesInputSchema.parse(input.lines)
    : undefined;
  const data = await storefrontRequest<CartCreateData>(CART_CREATE_MUTATION, {
    input: lines ? { lines } : {},
  });
  assertNoUserErrors(data.cartCreate.userErrors, "Cart create failed");
  if (!data.cartCreate.cart) throw new Error("Cart create returned no cart");
  return data.cartCreate.cart;
}

export async function addCartLines(params: {
  cartId: string;
  lines: { merchandiseId: string; quantity: number }[];
}): Promise<Cart> {
  const lines = cartLinesInputSchema.parse(params.lines);
  const data = await storefrontRequest<CartLinesAddData>(
    CART_LINES_ADD_MUTATION,
    { cartId: params.cartId, lines },
  );
  assertNoUserErrors(data.cartLinesAdd.userErrors, "Add to cart failed");
  if (!data.cartLinesAdd.cart) throw new Error("Add to cart returned no cart");
  return data.cartLinesAdd.cart;
}

/**
 * True when an error reflects a stored cart id that Shopify no longer knows
 * about (expired or deleted) — surfaced as "The specified cart does not
 * exist." from cart mutations.
 */
function isCartMissingError(error: unknown): boolean {
  return error instanceof Error && /cart does not exist/i.test(error.message);
}

/**
 * Add lines to an existing cart, transparently creating a fresh cart when the
 * stored cart id is missing or expired. Returns the cart to use plus whether
 * a new one was created, so the caller can refresh the stored cart id cookie.
 */
export async function addLinesOrCreateCart(params: {
  cartId: string | null;
  lines: { merchandiseId: string; quantity: number }[];
}): Promise<{ cart: Cart; created: boolean }> {
  const { cartId, lines } = params;

  if (cartId) {
    try {
      const cart = await addCartLines({ cartId, lines });
      return { cart, created: false };
    } catch (error) {
      // Any error other than a stale cart is a real failure — let it surface.
      if (!isCartMissingError(error)) throw error;
      // Otherwise fall through and start a fresh cart with the same lines.
    }
  }

  const cart = await createCart({ lines });
  return { cart, created: true };
}

export async function updateCartLines(params: {
  cartId: string;
  lines: { id: string; quantity: number }[];
}): Promise<Cart> {
  const lines = lineUpdatesSchema.parse(params.lines);
  const data = await storefrontRequest<CartLinesUpdateData>(
    CART_LINES_UPDATE_MUTATION,
    { cartId: params.cartId, lines },
  );
  assertNoUserErrors(data.cartLinesUpdate.userErrors, "Update cart failed");
  if (!data.cartLinesUpdate.cart) {
    throw new Error("Update cart returned no cart");
  }
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(params: {
  cartId: string;
  lineIds: string[];
}): Promise<Cart> {
  const lineIds = lineIdsSchema.parse(params.lineIds);
  const data = await storefrontRequest<CartLinesRemoveData>(
    CART_LINES_REMOVE_MUTATION,
    { cartId: params.cartId, lineIds },
  );
  assertNoUserErrors(
    data.cartLinesRemove.userErrors,
    "Remove from cart failed",
  );
  if (!data.cartLinesRemove.cart) throw new Error("Remove returned no cart");
  return data.cartLinesRemove.cart;
}
