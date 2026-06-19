export const CART_LINE_FRAGMENT = `#graphql
  fragment CartLineFields on CartLine {
    id
    quantity
    merchandise {
      ... on ProductVariant {
        id
        title
        product {
          handle
          title
        }
        image {
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
      }
    }
  }
` as const;

export const CART_FRAGMENT = `#graphql
  ${CART_LINE_FRAGMENT}
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
      totalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 50) {
      nodes {
        ...CartLineFields
      }
    }
  }
` as const;

export const CART_CREATE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const CART_LINES_ADD_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const CART_LINES_UPDATE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const CART_LINES_REMOVE_MUTATION = `#graphql
  ${CART_FRAGMENT}
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ...CartFields
      }
      userErrors {
        field
        message
      }
    }
  }
` as const;

export const CART_QUERY = `#graphql
  ${CART_FRAGMENT}
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      ...CartFields
    }
  }
` as const;

export type MoneyV2 = { amount: string; currencyCode: string };

export type CartLine = {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { handle: string; title: string };
    image: null | {
      url: string;
      altText: string | null;
      width: number | null;
      height: number | null;
    };
    price: MoneyV2;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: MoneyV2;
    totalAmount: MoneyV2;
  };
  lines: { nodes: CartLine[] };
};

export type CartQueryData = { cart: Cart | null };

export type CartMutationResult = {
  cart: Cart | null;
  userErrors: { field: string[] | null; message: string }[];
};

export type CartCreateData = { cartCreate: CartMutationResult };
export type CartLinesAddData = { cartLinesAdd: CartMutationResult };
export type CartLinesUpdateData = { cartLinesUpdate: CartMutationResult };
export type CartLinesRemoveData = { cartLinesRemove: CartMutationResult };

