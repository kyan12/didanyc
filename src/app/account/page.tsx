import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import styles from "./account.module.css";

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ redirect?: string; error?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;

  if (session) {
    redirect(params.redirect || "/account/orders");
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Account</h1>
        <p className={styles.subtitle}>
          Sign in to view your orders and manage your addresses.
        </p>

        {params.error && (
          <div className={styles.error}>
            {params.error === "auth_failed"
              ? "Authentication failed. Please try again."
              : "An error occurred. Please try again."}
          </div>
        )}

        <div className={styles.actions}>
          <a href="/account/login" className={styles.button}>
            Sign In with Shopify
          </a>
        </div>

        <p className={styles.note}>
          You&apos;ll be redirected to Shopify to sign in securely.
        </p>
      </div>
    </main>
  );
}
