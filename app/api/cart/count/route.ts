import { NextResponse } from "next/server";

import { getCartIdFromCookie } from "@/lib/cart/session";
import { storefrontRequest } from "@/lib/shopify/client";
import { CART_QUERY, type CartQueryData } from "@/lib/shopify/queries/cart";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    const cartId = await getCartIdFromCookie();
    if (!cartId) return NextResponse.json({ count: 0 });

    // The cart is per-user state — bypass the data cache so the header
    // count never lags behind quantity changes.
    const data = await storefrontRequest<CartQueryData>(
      CART_QUERY,
      { cartId },
      { cache: "no-store" },
    );
    return NextResponse.json({ count: data.cart?.totalQuantity ?? 0 });
  } catch (err) {
    logger.error("Cart count request failed", {
      route: "/api/cart/count",
      err,
    });
    return NextResponse.json({ count: 0 });
  }
}
