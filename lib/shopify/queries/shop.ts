/** Minimal query to verify Storefront credentials (Phase A). */

export const SHOP_QUERY = `#graphql
  query ShopName {
    shop {
      name
    }
  }
` as const;

export type ShopNameQueryData = {
  shop: {
    name: string;
  };
};
