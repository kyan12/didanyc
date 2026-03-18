export { shopifyFetch } from "./client";
export {
  FEATURED_PRODUCTS_QUERY,
  FEATURED_COLLECTIONS_QUERY,
  ALL_COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  ALL_PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
} from "./queries";
export type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyImage,
  PageInfo,
  ProductDetail,
  ProductVariant,
  ProductByHandleResponse,
  FeaturedProductsResponse,
  FeaturedCollectionsResponse,
  AllCollectionsResponse,
  CollectionByHandleResponse,
  AllProductsResponse,
} from "./types";
