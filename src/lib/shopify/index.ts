export { shopifyFetch } from "./client";
export {
  FEATURED_PRODUCTS_QUERY,
  FEATURED_COLLECTIONS_QUERY,
  ALL_COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  ALL_PRODUCTS_QUERY,
} from "./queries";
export type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyImage,
  PageInfo,
  FeaturedProductsResponse,
  FeaturedCollectionsResponse,
  AllCollectionsResponse,
  CollectionByHandleResponse,
  AllProductsResponse,
} from "./types";
