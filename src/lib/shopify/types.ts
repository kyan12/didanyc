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
  };
  compareAtPriceRange: {
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
      };
    }>;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: ShopifyImage | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

export interface FeaturedProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
  };
}

export interface FeaturedCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
}

export interface AllCollectionsResponse {
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
    pageInfo: PageInfo;
  };
}

export interface CollectionByHandleResponse {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: ShopifyImage | null;
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
      pageInfo: PageInfo;
    };
  } | null;
}

export interface AllProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
    }>;
    pageInfo: PageInfo;
  };
}

/* ─── Product detail types (PDP) ─── */

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  price: { amount: string; currencyCode: string };
  compareAtPrice: { amount: string; currencyCode: string } | null;
  image: ShopifyImage | null;
}

export interface ProductDetail {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPriceRange: {
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  options: Array<{ name: string; values: string[] }>;
  variants: {
    edges: Array<{ node: ProductVariant }>;
  };
  images: {
    edges: Array<{ node: ShopifyImage }>;
  };
  seo: {
    title: string | null;
    description: string | null;
  };
}

export interface ProductByHandleResponse {
  product: ProductDetail | null;
}

/* ─── Cart types ─── */

export interface CartLineItem {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    image: ShopifyImage | null;
    price: { amount: string; currencyCode: string };
    product: {
      id: string;
      title: string;
      handle: string;
    };
  };
  cost: {
    totalAmount: { amount: string; currencyCode: string };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
  lines: {
    edges: Array<{ node: CartLineItem }>;
  };
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
