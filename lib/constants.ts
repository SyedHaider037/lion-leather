// Numbers used in more than one place, or that are easy to misread inline.
//
// Not here: the `export const revalidate = 60` lines in the page files. Next.js
// reads those at build time and needs a plain number written in the file.

/** How long Storefront API responses are cached by default (seconds). */
export const SHOPIFY_REVALIDATE_SECONDS = 60;

/** Most units of one item allowed in a cart line. */
export const MAX_QUANTITY_PER_LINE = 99;

/** A form submitted faster than this after it appeared is treated as a bot. */
export const MIN_FILL_MS = 3000;

/** Wait after the last keystroke before the search runs. */
export const SEARCH_DEBOUNCE_MS = 300;

/** Search results returned when the request does not say, and the most allowed. */
export const SEARCH_DEFAULT_RESULTS = 24;
export const SEARCH_MAX_RESULTS = 48;

/** Products loaded for one collection page. */
export const COLLECTION_PRODUCT_LIMIT = 100;

/** Products and collections read for the sitemap (the Storefront API maximum). */
export const SITEMAP_PAGE_SIZE = 250;

/** "You may also like" products shown on a product page. */
export const RELATED_PRODUCTS_COUNT = 4;

/** Care or feature bullet points shown on a product page. */
export const MAX_PRODUCT_FEATURES = 8;

/** Product images shown in the gallery. */
export const GALLERY_MAX_IMAGES = 7;

/** Images narrower than this (px) are too small to offer a zoom. */
export const ZOOM_MIN_IMAGE_WIDTH = 1000;
