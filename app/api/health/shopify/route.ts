import { NextResponse } from "next/server";

import { getShopName } from "@/lib/shopify";
import { logger } from "@/lib/logger";

// Reports only whether the Storefront API answered. It deliberately returns no
// shop details, since this route is public.
export async function GET() {
  try {
    await getShopName();
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error("Shopify health check failed", {
      route: "/api/health/shopify",
      err,
    });
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
