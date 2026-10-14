/**
 * Maps a Shopify collection handle to its size guide page. Only products in a
 * collection listed here show a "Size Guide" link; belts, wallets and bags
 * have none. To add a guide (e.g. Peshawari chappal), create the page and add
 * one line: `chappal: "/size-guide/chappal"`.
 */
const SIZE_GUIDES: Record<string, string> = {
  footwear: "/size-guide/shoes",
};

/** First size guide that matches any of the product's collection handles. */
export function getSizeGuideHref(collectionHandles: string[]): string | null {
  for (const handle of collectionHandles) {
    const href = SIZE_GUIDES[handle];
    if (href) return href;
  }
  return null;
}
