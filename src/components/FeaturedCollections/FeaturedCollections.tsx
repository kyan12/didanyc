import Image from "next/image";
import Link from "next/link";
import type { ShopifyCollection } from "@/lib/shopify/types";
import styles from "./FeaturedCollections.module.css";

interface FeaturedCollectionsProps {
  collections: ShopifyCollection[];
}

export function FeaturedCollections({ collections }: FeaturedCollectionsProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Shop by Collection</h2>
      <div className={styles.grid}>
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.handle}`}
            className={styles.card}
          >
            <div className={styles.imageWrap}>
              {collection.image ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText ?? collection.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder} />
              )}
            </div>
            <h3 className={styles.title}>{collection.title}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
