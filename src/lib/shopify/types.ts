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
