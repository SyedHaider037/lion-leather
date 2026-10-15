import "server-only";

import { cookies } from "next/headers";

import { SHOPIFY_CART_COOKIE } from "./constants";

export async function getCartIdFromCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(SHOPIFY_CART_COOKIE)?.value ?? null;
}

export async function setCartIdCookie(cartId: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SHOPIFY_CART_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}
