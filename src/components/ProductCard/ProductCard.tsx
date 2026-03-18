import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/types";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: ShopifyProduct;
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function ProductCard({ product }: ProductCardProps) {
  const image = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.maxVariantPrice;
  const hasCompareAt =
    parseFloat(compareAt.amount) > parseFloat(price.amount);
  const variantCount = product.variants.edges.length;

  return (
    <Link href={`/products/${product.handle}`} className={styles.card}>
      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder} />
        )}
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.pricing}>
          <span className={hasCompareAt ? styles.salePrice : styles.price}>
            {formatPrice(price.amount, price.currencyCode)}
          </span>
          {hasCompareAt && (
            <span className={styles.compareAt}>
              {formatPrice(compareAt.amount, compareAt.currencyCode)}
            </span>
          )}
        </div>
        {variantCount > 1 && (
          <p className={styles.variants}>
            {variantCount} variant{variantCount !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </Link>
  );
}
