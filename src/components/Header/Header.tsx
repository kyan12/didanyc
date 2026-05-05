"use client";

import Link from "next/link";
import { useState } from "react";
import { CartIcon } from "@/components/CartIcon/CartIcon";
import styles from "./Header.module.css";

const NAV_LINKS = [
  { label: "Shop", href: "/collections" },
  { label: "Products", href: "/products" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "About", href: "/about" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="DIDA NYC">
          DIDA NYC
        </Link>

        <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.navLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <CartIcon />
          <button
            className={styles.menuToggle}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
            <span className={`${styles.bar} ${menuOpen ? styles.barOpen : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
