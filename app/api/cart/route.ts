import { NextResponse } from "next/server";

import { getCartIdFromCookie } from "@/lib/cart/session";
import { storefrontRequest } from "@/lib/shopify/client";
import { CART_QUERY, type CartQueryData } from "@/lib/shopify/queries/cart";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const cartId = await getCartIdFromCookie();
    if (!cartId) return NextResponse.json({ cart: null });

    const data = await storefrontRequest<CartQueryData>(
      CART_QUERY,
      { cartId },
      { cache: "no-store" },
    );
    return NextResponse.json({ cart: data.cart });
  } catch (err) {
    logger.error("Cart request failed", { route: "/api/cart", err });
    return NextResponse.json({ cart: null });
  }
}
