export interface ShopifyImage {
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  compareAtPriceRange: {
    maxVariantPrice: {
  variants: {
    edges: Array<{
      node: {
    }>;
  images: {
      node: ShopifyImage;
}

export interface ShopifyCollection {
  image: ShopifyImage | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface FeaturedProductsResponse {
  products: {
      node: ShopifyProduct;
}

export interface FeaturedCollectionsResponse {
  collections: {
      node: ShopifyCollection;
}

export interface AllCollectionsResponse {
    pageInfo: PageInfo;
}

export interface CollectionByHandleResponse {
  collection: {
  } | null;
}

export interface AllProductsResponse {
}

/* ─── Product detail types (PDP) ─── */

export interface ProductVariant {
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
}

export interface ProductDetail {
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  options: Array<{ name: string; values: string[] }>;
    edges: Array<{ node: ProductVariant }>;
    edges: Array<{ node: ShopifyImage }>;
  seo: {
    title: string | null;
    description: string | null;
}

export interface ProductByHandleResponse {
  product: ProductDetail | null;
}

/* ─── Cart types ─── */

export interface CartLineItem {
  quantity: number;
  merchandise: {
    product: {
  cost: {
    totalAmount: { amount: string; currencyCode: string };
}

export interface ShopifyCart {
  checkoutUrl: string;
  totalQuantity: number;
    subtotalAmount: { amount: string; currencyCode: string };
  lines: {
    edges: Array<{ node: CartLineItem }>;
}

export interface CartCreateResponse {
  cartCreate: { cart: ShopifyCart };
}

export interface CartLinesAddResponse {
  cartLinesAdd: { cart: ShopifyCart };
}

export interface CartLinesUpdateResponse {
  cartLinesUpdate: { cart: ShopifyCart };
}

export interface CartLinesRemoveResponse {
  cartLinesRemove: { cart: ShopifyCart };
}

export interface CartQueryResponse {
  cart: ShopifyCart | null;
}
