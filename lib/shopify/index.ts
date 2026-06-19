export {
  storefrontRequest,
  StorefrontApiError,
  type StorefrontErrorDetail,
} from "./client";
export { SHOP_QUERY, type ShopNameQueryData } from "./queries/shop";
export { getShopName } from "./shop";
export {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  type ProductsQueryData,
  type ProductByHandleQueryData,
  type ProductCard,
} from "./queries/products";
export {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  CART_QUERY,
} from "./queries/cart";
