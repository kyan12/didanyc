import { NextResponse } from "next/server";
import {
  createCart,
  getCart,
  addToCart,
  updateCartLine,
  removeFromCart,
  getUpsellProducts,
} from "@/lib/shopify/cart";

export async function POST(request: Request) {
  const body = await request.json();
  const { action } = body;

  try {
    switch (action) {
      case "get": {
        const cart = await getCart(body.cartId);
        return NextResponse.json({ cart });
      }
      case "add": {
        let cartId = body.cartId as string | null;
        if (!cartId) {
          const newCart = await createCart();
          cartId = newCart.id;
        }
        const cart = await addToCart(cartId!, body.variantId, body.quantity ?? 1);
        return NextResponse.json({ cart });
      }
      case "update": {
        const cart = await updateCartLine(
          body.cartId,
          body.lineId,
          body.quantity
        );
        return NextResponse.json({ cart });
      }
      case "remove": {
        const cart = await removeFromCart(body.cartId, body.lineIds);
        return NextResponse.json({ cart });
      }
      case "upsell": {
        const products = await getUpsellProducts();
        return NextResponse.json({ products });
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Cart operation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
