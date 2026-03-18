import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { customerFetch } from "@/lib/shopify/customer-client";
import { ORDER_BY_ID_QUERY } from "@/lib/shopify/customer-queries";
import type { OrderResponse } from "@/lib/shopify/customer-types";
import styles from "./order-detail.module.css";

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function statusLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase());
}

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();
  if (!session) return null;

  const { id } = await params;
  const orderId = decodeURIComponent(id);

  const data = await customerFetch<OrderResponse>({
    query: ORDER_BY_ID_QUERY,
    variables: { orderId },
    accessToken: session.accessToken,
  });

  const order = data.customer.orders.nodes[0];

  if (!order) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <p>Order not found.</p>
          <Link href="/account/orders" className={styles.backLink}>
            Back to Orders
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <Link href="/account/orders" className={styles.backLink}>
          &larr; Back to Orders
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>{order.name}</h1>
          <span className={styles.date}>{formatDate(order.processedAt)}</span>
        </div>

        <div className={styles.statusRow}>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Payment</span>
            <span className={styles.statusValue}>
              {statusLabel(order.financialStatus)}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Fulfillment</span>
            <span className={styles.statusValue}>
              {statusLabel(order.fulfillmentStatus)}
            </span>
          </div>
          <div className={styles.statusItem}>
            <span className={styles.statusLabel}>Total</span>
            <span className={styles.statusValue}>
              {formatPrice(
                order.totalPrice.amount,
                order.totalPrice.currencyCode
              )}
            </span>
          </div>
        </div>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Items</h2>
          <div className={styles.lineItems}>
            {order.lineItems.nodes.map((item, i) => (
              <div key={i} className={styles.lineItem}>
                {item.variant?.image && (
                  <img
                    src={item.variant.image.url}
                    alt={item.variant.image.altText || item.title}
                    className={styles.itemImage}
                    width={64}
                    height={64}
                  />
                )}
                <div className={styles.itemInfo}>
                  <span className={styles.itemTitle}>{item.title}</span>
                  {item.variant && item.variant.title !== "Default Title" && (
                    <span className={styles.itemVariant}>
                      {item.variant.title}
                    </span>
                  )}
                  <span className={styles.itemQty}>Qty: {item.quantity}</span>
                </div>
                {item.variant && (
                  <span className={styles.itemPrice}>
                    {formatPrice(
                      item.variant.price.amount,
                      item.variant.price.currencyCode
                    )}
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>

        {order.shippingAddress && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Shipping Address</h2>
            <address className={styles.address}>
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              <br />
              {order.shippingAddress.address1}
              <br />
              {order.shippingAddress.address2 && (
                <>
                  {order.shippingAddress.address2}
                  <br />
                </>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.province}{" "}
              {order.shippingAddress.zip}
              <br />
              {order.shippingAddress.country}
            </address>
          </section>
        )}
      </div>
    </main>
  );
}
