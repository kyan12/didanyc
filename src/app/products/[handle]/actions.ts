"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
} from "@/lib/shopify/cart-mutations";
import type {
  CartCreateResponse,
  CartLinesAddResponse,
  ShopifyCart,
} from "@/lib/shopify/types";

const CART_COOKIE = "dida_cart_id";

async function getCartId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(CART_COOKIE)?.value;
}

async function setCartId(cartId: string) {
  const cookieStore = await cookies();
  cookieStore.set(CART_COOKIE, cartId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function addToCart(
  variantId: string,
  quantity: number = 1
): Promise<{ cart?: ShopifyCart; error?: string }> {
  try {
    const existingCartId = await getCartId();

    if (existingCartId) {
      const data = await shopifyFetch<CartLinesAddResponse>({
        query: CART_LINES_ADD_MUTATION,
        variables: {
          cartId: existingCartId,
          lines: [{ merchandiseId: variantId, quantity }],
        },
      });
      return { cart: data.cartLinesAdd.cart };
    }

    const data = await shopifyFetch<CartCreateResponse>({
      query: CART_CREATE_MUTATION,
      variables: {
        input: {
          lines: [{ merchandiseId: variantId, quantity }],
        },
      },
    });

    await setCartId(data.cartCreate.cart.id);
    return { cart: data.cartCreate.cart };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to add to cart" };
  }
}
