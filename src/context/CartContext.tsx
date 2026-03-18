"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import type { ShopifyCart, ShopifyProduct } from "@/lib/shopify/types";

const CART_ID_KEY = "dida-cart-id";
const FREE_SHIPPING_THRESHOLD = 75; // dollars

interface CartContextValue {
  cart: ShopifyCart | null;
  isOpen: boolean;
  isLoading: boolean;
  freeShippingThreshold: number;
  upsellProducts: ShopifyProduct[];
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItem: (lineId: string, quantity: number) => Promise<void>;
  removeItem: (lineIds: string[]) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [upsellProducts, setUpsellProducts] = useState<ShopifyProduct[]>([]);
  const initialized = useRef(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const cartId = localStorage.getItem(CART_ID_KEY);
    if (cartId) {
      fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "get", cartId }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.cart) setCart(data.cart);
          else localStorage.removeItem(CART_ID_KEY);
        })
        .catch(() => localStorage.removeItem(CART_ID_KEY));
    }

    // Load upsell products
    fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "upsell" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.products) setUpsellProducts(data.products);
      })
      .catch(() => {});
  }, []);

  const persistCartId = useCallback((c: ShopifyCart) => {
    localStorage.setItem(CART_ID_KEY, c.id);
    setCart(c);
  }, []);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const cartId = cart?.id || localStorage.getItem(CART_ID_KEY);
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "add", cartId, variantId, quantity }),
        });
        const data = await res.json();
        persistCartId(data.cart);
        setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    },
    [cart?.id, persistCartId]
  );

  const updateItem = useCallback(
    async (lineId: string, quantity: number) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "update",
            cartId: cart.id,
            lineId,
            quantity,
          }),
        });
        const data = await res.json();
        setCart(data.cart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  const removeItem = useCallback(
    async (lineIds: string[]) => {
      if (!cart) return;
      setIsLoading(true);
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "remove",
            cartId: cart.id,
            lineIds,
          }),
        });
        const data = await res.json();
        setCart(data.cart);
      } finally {
        setIsLoading(false);
      }
    },
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        isLoading,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        upsellProducts,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        updateItem,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
