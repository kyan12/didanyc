"use client";

import { useCart } from "@/context/CartContext";
import styles from "./CartIcon.module.css";

export function CartIcon() {
  const { openCart, cart } = useCart();
  const quantity = cart?.totalQuantity ?? 0;

  return (
    <button
      className={styles.cartIcon}
      onClick={openCart}
      aria-label={`Shopping cart${quantity > 0 ? `, ${quantity} items` : ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
      {quantity > 0 && (
        <span className={styles.badge} aria-hidden="true">
          {quantity}
        </span>
      )}
    </button>
  );
}
