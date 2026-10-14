"use server";

import {
  cartLineRemoveSchema,
  cartLineUpdateSchema,
  removeCartLines,
  updateCartLines,
} from "@/lib/cart/api";
import { getCartIdFromCookie } from "@/lib/cart/session";
import type { Cart } from "@/lib/shopify/queries/cart";

// Only the drawer-callable actions live here: every export of a "use server"
// file is a public endpoint. Shared cart helpers are in lib/cart/api.ts.

/**
 * Drawer-callable actions: read the cart id from the cookie, mutate, and
 * return the fresh cart so the client drawer can re-render without a reload.
 */
export async function cartUpdateLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  const input = cartLineUpdateSchema.parse({ lineId, quantity });
  const cartId = await getCartIdFromCookie();
  if (!cartId) return null;
  if (input.quantity <= 0) {
    return removeCartLines({ cartId, lineIds: [input.lineId] });
  }
  return updateCartLines({
    cartId,
    lines: [{ id: input.lineId, quantity: input.quantity }],
  });
}

export async function cartRemoveLineAction(
  lineId: string,
): Promise<Cart | null> {
  const input = cartLineRemoveSchema.parse({ lineId });
  const cartId = await getCartIdFromCookie();
  if (!cartId) return null;
  return removeCartLines({ cartId, lineIds: [input.lineId] });
}
