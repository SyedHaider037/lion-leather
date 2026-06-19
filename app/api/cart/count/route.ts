import { NextResponse } from "next/server";

import { getCartIdFromCookie } from "@/lib/cart/session";
import { storefrontRequest } from "@/lib/shopify/client";
import { CART_QUERY, type CartQueryData } from "@/lib/shopify/queries/cart";

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
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
