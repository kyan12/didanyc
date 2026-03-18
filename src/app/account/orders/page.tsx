import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { customerFetch } from "@/lib/shopify/customer-client";
import { ORDERS_QUERY } from "@/lib/shopify/customer-queries";
import type { OrdersResponse } from "@/lib/shopify/customer-types";
import styles from "./orders.module.css";

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

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) return null;

  const data = await customerFetch<OrdersResponse>({
    query: ORDERS_QUERY,
    variables: { first: 20 },
    accessToken: session.accessToken,
  });

  const orders = data.customer.orders.nodes;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Orders</h1>
          <nav className={styles.nav}>
            <Link href="/account/addresses" className={styles.navLink}>
              Addresses
            </Link>
            <a href="/account/logout" className={styles.navLink}>
              Sign Out
            </a>
          </nav>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <p>You haven&apos;t placed any orders yet.</p>
            <Link href="/" className={styles.shopLink}>
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className={styles.list}>
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${encodeURIComponent(order.id)}`}
                className={styles.order}
              >
                <div className={styles.orderHeader}>
                  <span className={styles.orderName}>{order.name}</span>
                  <span className={styles.orderDate}>
                    {formatDate(order.processedAt)}
                  </span>
                </div>
                <div className={styles.orderDetails}>
                  <span className={styles.orderStatus}>
                    {statusLabel(order.fulfillmentStatus)}
                  </span>
                  <span className={styles.orderTotal}>
                    {formatPrice(
                      order.totalPrice.amount,
                      order.totalPrice.currencyCode
                    )}
                  </span>
                </div>
                <div className={styles.orderItems}>
                  {order.lineItems.nodes.slice(0, 3).map((item, i) => (
                    <span key={i} className={styles.itemName}>
                      {item.title}
                      {item.quantity > 1 ? ` ×${item.quantity}` : ""}
                    </span>
                  ))}
                  {order.lineItems.nodes.length > 3 && (
                    <span className={styles.moreItems}>
                      +{order.lineItems.nodes.length - 3} more
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
