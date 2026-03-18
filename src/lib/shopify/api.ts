import { shopifyFetch } from "./client";
import {
  PRODUCT_BY_HANDLE_QUERY,
  ALL_PRODUCTS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  ALL_COLLECTIONS_QUERY,
  CREATE_CART_MUTATION,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINE_MUTATION,
  REMOVE_CART_LINE_MUTATION,
} from "./queries";
import type {
  ShopifyProduct,
  ShopifyCollection,
  ShopifyCart,
  ProductByHandleResponse,
  AllProductsResponse,
  CollectionByHandleResponse,
  AllCollectionsResponse,
  CartCreateResponse,
  CartLinesAddResponse,
  CartLinesUpdateResponse,
  CartLinesRemoveResponse,
} from "./types";

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<ProductByHandleResponse>({
    query: PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });
  return data.product;
}

export async function getProducts(opts?: { first?: number }): Promise<ShopifyProduct[]> {
  const first = opts?.first ?? 100;
  const products: ShopifyProduct[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: AllProductsResponse = await shopifyFetch<AllProductsResponse>({
      query: ALL_PRODUCTS_QUERY,
      variables: { first, after },
    });
    products.push(...data.products.edges.map((e: { node: ShopifyProduct }) => e.node));
    hasNextPage = data.products.pageInfo.hasNextPage;
    after = data.products.pageInfo.endCursor;
  }

  return products;
}

export async function getProductsByCollection(
  handle: string,
  opts?: { first?: number }
): Promise<{ collection: CollectionByHandleResponse["collection"]; products: ShopifyProduct[] }> {
  const first = opts?.first ?? 100;
  const products: ShopifyProduct[] = [];
  let after: string | null = null;
  let hasNextPage = true;
  let collectionData: CollectionByHandleResponse["collection"] = null;

  while (hasNextPage) {
    const data: CollectionByHandleResponse = await shopifyFetch<CollectionByHandleResponse>({
      query: COLLECTION_BY_HANDLE_QUERY,
      variables: { handle, first, after },
    });

    if (!data.collection) break;

    collectionData = data.collection;
    products.push(...data.collection.products.edges.map((e: { node: ShopifyProduct }) => e.node));
    hasNextPage = data.collection.products.pageInfo.hasNextPage;
    after = data.collection.products.pageInfo.endCursor;
  }

  return { collection: collectionData, products };
}

// ---------------------------------------------------------------------------
// Collections
// ---------------------------------------------------------------------------

export async function getCollections(opts?: { first?: number }): Promise<ShopifyCollection[]> {
  const first = opts?.first ?? 100;
  const collections: ShopifyCollection[] = [];
  let after: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const data: AllCollectionsResponse = await shopifyFetch<AllCollectionsResponse>({
      query: ALL_COLLECTIONS_QUERY,
      variables: { first, after },
    });
    collections.push(...data.collections.edges.map((e: { node: ShopifyCollection }) => e.node));
    hasNextPage = data.collections.pageInfo.hasNextPage;
    after = data.collections.pageInfo.endCursor;
  }

  return collections;
}

export async function getCollection(handle: string): Promise<CollectionByHandleResponse["collection"]> {
  const data = await shopifyFetch<CollectionByHandleResponse>({
    query: COLLECTION_BY_HANDLE_QUERY,
    variables: { handle, first: 1 },
  });
  return data.collection;
}

// ---------------------------------------------------------------------------
// Cart mutations
// ---------------------------------------------------------------------------

function assertNoUserErrors(userErrors: Array<{ field: string[]; message: string }>) {
  if (userErrors.length > 0) {
    throw new Error(
      `Shopify cart error: ${userErrors.map((e) => e.message).join(", ")}`
    );
  }
}

export async function createCart(
  lines?: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartCreateResponse>({
    query: CREATE_CART_MUTATION,
    variables: { input: { lines: lines ?? [] } },
  });
  assertNoUserErrors(data.cartCreate.userErrors);
  return data.cartCreate.cart;
}

export async function addToCart(
  cartId: string,
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesAddResponse>({
    query: ADD_TO_CART_MUTATION,
    variables: { cartId, lines },
  });
  assertNoUserErrors(data.cartLinesAdd.userErrors);
  return data.cartLinesAdd.cart;
}

export async function updateCartLine(
  cartId: string,
  lines: Array<{ id: string; quantity: number }>
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesUpdateResponse>({
    query: UPDATE_CART_LINE_MUTATION,
    variables: { cartId, lines },
  });
  assertNoUserErrors(data.cartLinesUpdate.userErrors);
  return data.cartLinesUpdate.cart;
}

export async function removeCartLine(
  cartId: string,
  lineIds: string[]
): Promise<ShopifyCart> {
  const data = await shopifyFetch<CartLinesRemoveResponse>({
    query: REMOVE_CART_LINE_MUTATION,
    variables: { cartId, lineIds },
  });
  assertNoUserErrors(data.cartLinesRemove.userErrors);
  return data.cartLinesRemove.cart;
}

// ---------------------------------------------------------------------------
// Optimistic cart helpers
// ---------------------------------------------------------------------------

export function optimisticAddToCart(
  cart: ShopifyCart,
  merchandiseId: string,
  quantity: number
): ShopifyCart {
  const existingLine = cart.lines.edges.find(
    (e) => e.node.merchandise.id === merchandiseId
  );

  if (existingLine) {
    return {
      ...cart,
      totalQuantity: cart.totalQuantity + quantity,
      lines: {
        edges: cart.lines.edges.map((e) =>
          e.node.merchandise.id === merchandiseId
            ? { node: { ...e.node, quantity: e.node.quantity + quantity } }
            : e
        ),
      },
    };
  }

  return {
    ...cart,
    totalQuantity: cart.totalQuantity + quantity,
    lines: {
      edges: [
        ...cart.lines.edges,
        {
          node: {
            id: `optimistic-${Date.now()}`,
            quantity,
            merchandise: {
              id: merchandiseId,
              title: "",
              image: null,
              product: { id: "", title: "", handle: "" },
              selectedOptions: [],
              price: { amount: "0", currencyCode: "USD" },
              compareAtPrice: null,
            },
            cost: {
              totalAmount: { amount: "0", currencyCode: "USD" },
              compareAtAmountPerQuantity: null,
            },
          },
        },
      ],
    },
  };
}

export function optimisticUpdateCartLine(
  cart: ShopifyCart,
  lineId: string,
  quantity: number
): ShopifyCart {
  const oldLine = cart.lines.edges.find((e) => e.node.id === lineId);
  const quantityDiff = oldLine ? quantity - oldLine.node.quantity : 0;

  return {
    ...cart,
    totalQuantity: cart.totalQuantity + quantityDiff,
    lines: {
      edges: cart.lines.edges.map((e) =>
        e.node.id === lineId ? { node: { ...e.node, quantity } } : e
      ),
    },
  };
}

export function optimisticRemoveCartLine(
  cart: ShopifyCart,
  lineId: string
): ShopifyCart {
  const removedLine = cart.lines.edges.find((e) => e.node.id === lineId);
  const removedQuantity = removedLine?.node.quantity ?? 0;

  return {
    ...cart,
    totalQuantity: cart.totalQuantity - removedQuantity,
    lines: {
      edges: cart.lines.edges.filter((e) => e.node.id !== lineId),
    },
  };
}
