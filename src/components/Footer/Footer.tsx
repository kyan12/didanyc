import Link from "next/link";
import styles from "./Footer.module.css";

const LINKS = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Collections", href: "/collections" },
    { label: "Ingredients", href: "/ingredients" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "mailto:hello@didanyc.com" },
  ],
  Account: [
    { label: "My Account", href: "/account" },
    { label: "Order History", href: "/account/orders" },
  ],
};

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Brand column */}
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            DIDA NYC
          </Link>
          <p className={styles.tagline}>
            Barber-grade performance. Signature scent. Clean finish.
          </p>
          <p className={styles.mission}>
            A portion of every purchase goes to charity.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([group, links]) => (
          <div key={group} className={styles.column}>
            <h4 className={styles.columnHeading}>{group}</h4>
            <ul className={styles.list}>
              {links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={styles.link}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} DIDA NYC. All rights reserved.
        </p>
        <div className={styles.legal}>
          <Link href="/privacy" className={styles.legalLink}>Privacy</Link>
          <Link href="/terms" className={styles.legalLink}>Terms</Link>
        </div>
      </div>
    </footer>
  );
}
