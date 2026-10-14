import { PRODUCT_CARD_FRAGMENT } from "./products";
import type { PhotoSource } from "@/components/ui/PhotoFrame";
import type { ProductCard } from "./products";

export const COLLECTION_BY_HANDLE_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query CollectionByHandle(
    $handle: String!
    $first: Int!
    $after: String
    $sortKey: ProductCollectionSortKeys
    $reverse: Boolean
  ) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse) {
        nodes {
          ...ProductCard
          productType
          tags
          leatherType: metafield(namespace: "custom", key: "leather_type") {
            value
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
` as const;

/** ProductCard plus the fields the collection filter sidebar facets on. */
export type FilterableProduct = ProductCard & {
  productType: string;
  tags: string[];
  leatherType: { value: string } | null;
};

export type CollectionByHandleQueryData = {
  collection: null | {
    id: string;
    handle: string;
    title: string;
    description: string;
    image: PhotoSource | null;
    products: {
      nodes: FilterableProduct[];
      pageInfo: { hasNextPage: boolean; endCursor: string | null };
    };
  };
};

/**
 * All storefront collections, with a representative image (the collection's
 * own image, or its first product's image as a fallback). Drives the
 * /collections index so new lines appear there automatically.
 */
export const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!) {
    collections(first: $first) {
      nodes {
        id
        handle
        title
        description
        image {
          url
          altText
          width
          height
        }
        products(first: 1) {
          nodes {
            featuredImage {
              url
              altText
              width
              height
            }
          }
        }
      }
    }
  }
` as const;

export type CollectionListItem = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: PhotoSource | null;
  products: {
    nodes: { featuredImage: PhotoSource | null }[];
  };
};

export type CollectionsQueryData = {
  collections: { nodes: CollectionListItem[] };
};
