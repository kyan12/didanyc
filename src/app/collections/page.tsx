import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import {
  shopifyFetch,
  ALL_COLLECTIONS_QUERY,
  type AllCollectionsResponse,
  type ShopifyCollection,
} from "@/lib/shopify";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Collections — DIDA NYC",
  description: "Browse all DIDA NYC collections",
};

export const revalidate = 3600;

async function getAllCollections(): Promise<ShopifyCollection[]> {
  try {
    const collections: ShopifyCollection[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      const data: AllCollectionsResponse = await shopifyFetch<AllCollectionsResponse>({
        query: ALL_COLLECTIONS_QUERY,
        variables: { first: 100, after },
      });

      for (const edge of data.collections.edges) {
        collections.push(edge.node);
      }

      hasNextPage = data.collections.pageInfo.hasNextPage;
      after = data.collections.pageInfo.endCursor;
    }

    return collections;
  } catch {
    return [];
  }
}

export default async function CollectionsPage() {
  const collections = await getAllCollections();

  return (
    <main>
      <PageHero
        title="Collections"
        subtitle="Browse our curated collections"
      />
      <section className={styles.section}>
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
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.placeholder} />
                )}
              </div>
              <h2 className={styles.title}>{collection.title}</h2>
              {collection.description && (
                <p className={styles.description}>{collection.description}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
