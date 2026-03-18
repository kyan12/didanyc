import Image from "next/image";
import Link from "next/link";
import type { ShopifyProduct } from "@/lib/shopify/types";
import styles from "./FeaturedProducts.module.css";

interface FeaturedProductsProps {
  products: ShopifyProduct[];
}

function formatPrice(amount: string, currencyCode: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode,
  }).format(parseFloat(amount));
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Featured Products</h2>
      <div className={styles.grid}>
        {products.map((product) => {
          const image = product.images.edges[0]?.node;
          const price = product.priceRange.minVariantPrice;

          return (
            <Link
              key={product.id}
              href={`/products/${product.handle}`}
              className={styles.card}
            >
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
                <p className={styles.price}>
                  {formatPrice(price.amount, price.currencyCode)}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
