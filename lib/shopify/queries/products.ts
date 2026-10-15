export const PRODUCT_CARD_FRAGMENT = `#graphql
  fragment ProductCard on Product {
    id
    handle
    title
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
  }
` as const;

export const PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query Products($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductCard
      }
    }
  }
` as const;

export const PRODUCT_BY_HANDLE_QUERY = `#graphql
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      collections(first: 5) {
        nodes {
          handle
          title
        }
      }
      shortDescription: metafield(namespace: "custom", key: "short_description") {
        value
      }
      features: metafield(namespace: "custom", key: "features") {
        value
      }
      dimensions: metafield(namespace: "custom", key: "dimensions") {
        value
      }
      leatherType: metafield(namespace: "custom", key: "leather_type") {
        value
      }
      featuredImage {
        url
        altText
        width
        height
      }
      images(first: 10) {
        nodes {
          url
          altText
          width
          height
        }
      }
      options {
        id
        name
        values
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            selectedOptions {
              name
              value
            }
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
` as const;

export type MoneyV2 = { amount: string; currencyCode: string };

export type ProductCard = {
  id: string;
  handle: string;
  title: string;
  featuredImage: null | {
    url: string;
    altText: string | null;
    width: number | null;
    height: number | null;
  };
  priceRange: { minVariantPrice: MoneyV2 };
};

export type ProductsQueryData = {
  products: { nodes: ProductCard[] };
};

export const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query ProductRecommendations($productId: ID!) {
    productRecommendations(productId: $productId) {
      ...ProductCard
    }
  }
` as const;

export type ProductRecommendationsData = {
  productRecommendations: ProductCard[] | null;
};

export type ProductByHandleQueryData = {
  product: null | {
    id: string;
    handle: string;
    title: string;
    description: string;
    collections: { nodes: { handle: string; title: string }[] };
    shortDescription: null | { value: string };
    features: null | { value: string };
    dimensions: null | { value: string };
    leatherType: null | { value: string };
    featuredImage: ProductCard["featuredImage"];
    images: { nodes: NonNullable<ProductCard["featuredImage"]>[] };
    options: { id: string; name: string; values: string[] }[];
    variants: {
      edges: {
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          selectedOptions: { name: string; value: string }[];
          price: MoneyV2;
        };
      }[];
    };
  };
};
