import { getSession } from "@/lib/auth/session";
import { customerFetch } from "@/lib/shopify/customer-client";
import { ADDRESSES_QUERY } from "@/lib/shopify/customer-queries";
import type { AddressesResponse } from "@/lib/shopify/customer-types";
import Link from "next/link";
import AddressList from "./AddressList";
import styles from "./addresses.module.css";

export default async function AddressesPage() {
  const session = await getSession();
  if (!session) return null;

  const data = await customerFetch<AddressesResponse>({
    query: ADDRESSES_QUERY,
    accessToken: session.accessToken,
  });

  const addresses = data.customer.addresses.nodes;
  const defaultAddressId = data.customer.defaultAddress?.id ?? null;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Addresses</h1>
          <nav className={styles.nav}>
            <Link href="/account/orders" className={styles.navLink}>
              Orders
            </Link>
            <a href="/account/logout" className={styles.navLink}>
              Sign Out
            </a>
          </nav>
        </div>

        <AddressList
          addresses={addresses}
          defaultAddressId={defaultAddressId}
        />
      </div>
    </main>
  );
}
