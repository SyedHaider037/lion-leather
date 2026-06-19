import { NextResponse } from "next/server";

import { storefrontRequest } from "@/lib/shopify/client";
import {
  PRODUCTS_QUERY,
  type ProductsQueryData,
} from "@/lib/shopify/queries/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const firstRaw = url.searchParams.get("first") ?? "24";
  const first = Math.max(1, Math.min(48, Number(firstRaw) || 24));

  if (!q) {
    return NextResponse.json({ products: [] as ProductsQueryData["products"]["nodes"] });
  }

  const data = await storefrontRequest<ProductsQueryData>(PRODUCTS_QUERY, {
    first,
    query: q,
  });

  return NextResponse.json({ products: data.products.nodes });
}

