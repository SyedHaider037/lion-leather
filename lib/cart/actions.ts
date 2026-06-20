"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCartIdFromCookie } from "@/lib/cart/session";
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
  const data = await storefrontRequest<CartCreateData>(CART_CREATE_MUTATION, {
    input: input ?? {},
  });
  assertNoUserErrors(data.cartCreate.userErrors, "Cart create failed");
  if (!data.cartCreate.cart) throw new Error("Cart create returned no cart");
  return data.cartCreate.cart;
}

export async function addCartLines(params: {
  cartId: string;
  lines: { merchandiseId: string; quantity: number }[];
}): Promise<Cart> {
  const data = await storefrontRequest<CartLinesAddData>(
    CART_LINES_ADD_MUTATION,
    params,
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
  const data = await storefrontRequest<CartLinesUpdateData>(
    CART_LINES_UPDATE_MUTATION,
    params,
  );
  assertNoUserErrors(data.cartLinesUpdate.userErrors, "Update cart failed");
  if (!data.cartLinesUpdate.cart) throw new Error("Update cart returned no cart");
  return data.cartLinesUpdate.cart;
}

export async function removeCartLines(params: {
  cartId: string;
  lineIds: string[];
}): Promise<Cart> {
  const data = await storefrontRequest<CartLinesRemoveData>(
    CART_LINES_REMOVE_MUTATION,
    params,
  );
  assertNoUserErrors(data.cartLinesRemove.userErrors, "Remove from cart failed");
  if (!data.cartLinesRemove.cart) throw new Error("Remove returned no cart");
  return data.cartLinesRemove.cart;
}

/**
 * Drawer-callable actions: read the cart id from the cookie, mutate, and
 * return the fresh cart so the client drawer can re-render without a reload.
 */
export async function cartUpdateLineAction(
  lineId: string,
  quantity: number,
): Promise<Cart | null> {
  const cartId = await getCartIdFromCookie();
  if (!cartId || !lineId) return null;
  if (quantity <= 0) {
    return removeCartLines({ cartId, lineIds: [lineId] });
  }
  return updateCartLines({ cartId, lines: [{ id: lineId, quantity }] });
}

export async function cartRemoveLineAction(
  lineId: string,
): Promise<Cart | null> {
  const cartId = await getCartIdFromCookie();
  if (!cartId || !lineId) return null;
  return removeCartLines({ cartId, lineIds: [lineId] });
}

export async function updateCartItemQuantity(formData: FormData) {
  const cartId = formData.get("cartId") as string;
  const lineId = formData.get("lineId") as string;
  const quantity = Number(formData.get("quantity"));

  console.log("[Cart] updateCartItemQuantity triggered", { cartId, lineId, quantity });

  if (!cartId || !lineId || !Number.isFinite(quantity)) {
    console.error("[Cart] Missing required fields", { cartId, lineId, quantity });
    return;
  }

  try {
    if (quantity <= 0) {
      console.log("[Cart] Removing line", lineId);
      await removeCartLines({ cartId, lineIds: [lineId] });
    } else {
      console.log("[Cart] Updating line", lineId, "to quantity", quantity);
      await updateCartLines({
        cartId,
        lines: [{ id: lineId, quantity }],
      });
    }
    revalidatePath("/cart");
    redirect("/cart");
  } catch (e) {
    console.error("[Cart] update failed", e);
    redirect("/cart?error=1");
  }
}

export async function removeCartItem(formData: FormData) {
  const cartId = formData.get("cartId") as string;
  const lineId = formData.get("lineId") as string;

  console.log("[Cart] removeCartItem triggered", { cartId, lineId });

  if (!cartId || !lineId) {
    console.error("[Cart] Missing required fields", { cartId, lineId });
    return;
  }

  try {
    console.log("[Cart] Removing line", lineId);
    await removeCartLines({ cartId, lineIds: [lineId] });
    console.log("[Cart] Remove successful, revalidating");
    revalidatePath("/cart");
    redirect("/cart");
  } catch (e) {
    console.error("[Cart] remove failed", e);
    redirect("/cart?error=1");
  }
}
