import { NextResponse } from "next/server";

import { getShopName } from "@/lib/shopify";

// Reports only whether the Storefront API answered. It deliberately returns no
// shop details, since this route is public.
export async function GET() {
  try {
    await getShopName();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
