import { NextResponse } from "next/server";

import { storefrontRequest } from "@/lib/shopify/client";
import { SEARCH_DEFAULT_RESULTS, SEARCH_MAX_RESULTS } from "@/lib/constants";
import {
  PRODUCTS_QUERY,
  type ProductsQueryData,
} from "@/lib/shopify/queries/products";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = (url.searchParams.get("q") ?? "").trim();
  const firstRaw = url.searchParams.get("first");
  const first = Math.max(
    1,
    Math.min(SEARCH_MAX_RESULTS, Number(firstRaw) || SEARCH_DEFAULT_RESULTS),
  );

  if (!q) {
    return NextResponse.json({
      products: [] as ProductsQueryData["products"]["nodes"],
    });
  }

  const data = await storefrontRequest<ProductsQueryData>(PRODUCTS_QUERY, {
    first,
    query: q,
  });

  return NextResponse.json({ products: data.products.nodes });
}
