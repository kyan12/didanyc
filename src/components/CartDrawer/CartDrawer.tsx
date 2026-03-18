"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { CartLineItem, ShopifyProduct } from "@/lib/shopify/types";
import styles from "./CartDrawer.module.css";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

/* ─── Line Item ─── */

function LineItem({ item }: { item: CartLineItem }) {
  const { updateItem, removeItem, isLoading } = useCart();
  const { merchandise } = item;

  return (
    <div className={styles.lineItem}>
      <div className={styles.lineImage}>
        {merchandise.image ? (
          <Image
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? merchandise.product.title}
            width={80}
            height={80}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.lineDetails}>
        <Link
          href={`/products/${merchandise.product.handle}`}
          className={styles.lineTitle}
        >
          {merchandise.product.title}
        </Link>
        {merchandise.title !== "Default Title" && (
          <p className={styles.lineVariant}>{merchandise.title}</p>
        )}
        <div className={styles.lineActions}>
          <div className={styles.quantitySelector}>
            <button
              className={styles.quantityBtn}
              disabled={isLoading}
              onClick={() =>
                item.quantity === 1
                  ? removeItem([item.id])
                  : updateItem(item.id, item.quantity - 1)
              }
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className={styles.quantityValue}>{item.quantity}</span>
            <button
              className={styles.quantityBtn}
              disabled={isLoading}
              onClick={() => updateItem(item.id, item.quantity + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <p className={styles.linePrice}>
            {formatPrice(
              item.cost.totalAmount.amount,
              item.cost.totalAmount.currencyCode
            )}
          </p>
        </div>
      </div>
      <button
        className={styles.removeBtn}
        onClick={() => removeItem([item.id])}
        disabled={isLoading}
        aria-label={`Remove ${merchandise.product.title}`}
      >
        ×
      </button>
    </div>
  );
}

/* ─── Free Shipping Bar ─── */

function FreeShippingBar() {
  const { cart, freeShippingThreshold } = useCart();
  const subtotal = parseFloat(cart?.cost.subtotalAmount.amount ?? "0");
  const remaining = Math.max(0, freeShippingThreshold - subtotal);
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className={styles.shippingBar}>
      <div className={styles.shippingTrack}>
        <div
          className={styles.shippingFill}
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className={styles.shippingText}>
        {remaining <= 0 ? (
          "You've unlocked free shipping!"
        ) : (
          <>
            Add <strong>{formatPrice(remaining.toString(), "USD")}</strong> more
            for free shipping
          </>
        )}
      </p>
    </div>
  );
}

/* ─── Upsell Card ─── */

function UpsellCard({ product }: { product: ShopifyProduct }) {
  const { addItem, isLoading, cart } = useCart();
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;

  // Don't show products already in cart
  const inCart = cart?.lines.edges.some(
    (e) => e.node.merchandise.product.id === product.id
  );
  if (inCart) return null;

  return (
    <div className={styles.upsellCard}>
      <div className={styles.upsellImage}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            width={60}
            height={60}
            className={styles.image}
          />
        ) : (
          <div className={styles.imagePlaceholder} />
        )}
      </div>
      <div className={styles.upsellInfo}>
        <p className={styles.upsellTitle}>{product.title}</p>
        <p className={styles.upsellPrice}>
          {formatPrice(price.amount, price.currencyCode)}
        </p>
      </div>
      <button
        className={styles.upsellAddBtn}
        disabled={isLoading}
        onClick={() => {
          // Use first variant — requires product ID transformation for Storefront API
          // The actual variant ID would need to come from the product query
          // For now we use a simplified approach
          const gid = product.id.replace("Product", "ProductVariant");
          addItem(gid);
        }}
      >
        Add
      </button>
    </div>
  );
}

/* ─── Main Drawer ─── */

export function CartDrawer() {
  const { cart, isOpen, closeCart, isLoading, upsellProducts } = useCart();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) closeCart();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, closeCart]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const lines = cart?.lines.edges.map((e) => e.node) ?? [];
  const subtotal = cart?.cost.subtotalAmount;
  const total = cart?.cost.totalAmount;

  // Filter upsell products to ones not already in cart, show max 3
  const visibleUpsells = upsellProducts
    .filter(
      (p) =>
        !cart?.lines.edges.some(
          (e) => e.node.merchandise.product.id === p.id
        )
    )
    .slice(0, 3);

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-label="Shopping cart"
        aria-modal={isOpen}
      >
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            Your Cart
            {cart && cart.totalQuantity > 0 && (
              <span className={styles.cartCount}>({cart.totalQuantity})</span>
            )}
          </h2>
          <button
            className={styles.closeBtn}
            onClick={closeCart}
            aria-label="Close cart"
          >
            ×
          </button>
        </div>

        {/* Free Shipping Bar */}
        {cart && lines.length > 0 && <FreeShippingBar />}

        {/* Content */}
        <div className={styles.body}>
          {lines.length === 0 ? (
            <div className={styles.empty}>
              <p>Your cart is empty</p>
              <button className={styles.continueShopping} onClick={closeCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Line Items */}
              <div className={styles.lineItems}>
                {lines.map((item) => (
                  <LineItem key={item.id} item={item} />
                ))}
              </div>

              {/* Upsell Section */}
              {visibleUpsells.length > 0 && (
                <div className={styles.upsellSection}>
                  <h3 className={styles.upsellHeading}>You might also like</h3>
                  {visibleUpsells.map((product) => (
                    <UpsellCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className={styles.footer}>
            {isLoading && <div className={styles.loadingBar} />}
            <div className={styles.totals}>
              <div className={styles.totalRow}>
                <span>Subtotal</span>
                <span>
                  {subtotal
                    ? formatPrice(subtotal.amount, subtotal.currencyCode)
                    : "—"}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span>Estimated Shipping</span>
                <span className={styles.shippingEstimate}>
                  {subtotal &&
                  parseFloat(subtotal.amount) >=
                    75
                    ? "Free"
                    : "Calculated at checkout"}
                </span>
              </div>
              <div className={`${styles.totalRow} ${styles.totalRowFinal}`}>
                <span>Total</span>
                <span>
                  {total
                    ? formatPrice(total.amount, total.currencyCode)
                    : "—"}
                </span>
              </div>
            </div>
            <a
              href={cart?.checkoutUrl}
              className={styles.checkoutBtn}
            >
              Checkout
            </a>
          </div>
        )}
      </div>
    </>
  );
}
