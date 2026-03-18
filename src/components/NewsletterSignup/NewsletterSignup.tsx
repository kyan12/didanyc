"use client";

import { useState } from "react";
import styles from "./NewsletterSignup.module.css";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // TODO: integrate with email provider (Klaviyo, Mailchimp, etc.)
    setStatus("success");
    setEmail("");
  }

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Join the DIDA Community</h2>
        <p className={styles.description}>
          Be the first to know about new products, exclusive offers, and haircare
          tips.
        </p>
        {status === "success" ? (
          <p className={styles.success}>Thank you for subscribing!</p>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className={styles.input}
            />
            <button type="submit" className={styles.button}>
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
