import "server-only";

import { storefrontRequest } from "./client";
import { SHOP_QUERY, type ShopNameQueryData } from "./queries/shop";

export async function getShopName(): Promise<string> {
  const data = await storefrontRequest<ShopNameQueryData>(SHOP_QUERY);
  return data.shop.name;
}
