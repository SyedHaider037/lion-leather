import { NextResponse } from "next/server";

import { getShopName } from "@/lib/shopify";

export async function GET() {
  const name = await getShopName();
  return NextResponse.json({ ok: true, shop: name });
}

