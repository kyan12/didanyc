import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import {
  shopifyFetch,
  ALL_COLLECTIONS_QUERY,
  COLLECTION_BY_HANDLE_QUERY,
  type AllCollectionsResponse,
  type CollectionByHandleResponse,
  type ShopifyProduct,
} from "@/lib/shopify";
import styles from "./page.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const collections: Array<{ handle: string }> = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      const data: AllCollectionsResponse = await shopifyFetch<AllCollectionsResponse>({
        query: ALL_COLLECTIONS_QUERY,
        variables: { first: 100, after },
      });

      for (const edge of data.collections.edges) {
        collections.push({ handle: edge.node.handle });
      }

      hasNextPage = data.collections.pageInfo.hasNextPage;
      after = data.collections.pageInfo.endCursor;
    }

    return collections;
  } catch {
    return [];
  }
}

async function getCollectionWithProducts(handle: string) {
  try {
    const products: ShopifyProduct[] = [];
    let hasNextPage = true;
    let after: string | null = null;
    let collection: CollectionByHandleResponse["collection"] = null;

    while (hasNextPage) {
      const data: CollectionByHandleResponse = await shopifyFetch<CollectionByHandleResponse>({
        query: COLLECTION_BY_HANDLE_QUERY,
        variables: { handle, first: 100, after },
      });

      if (!data.collection) return null;

      collection = data.collection;

      for (const edge of data.collection.products.edges) {
        products.push(edge.node);
      }

      hasNextPage = data.collection.products.pageInfo.hasNextPage;
      after = data.collection.products.pageInfo.endCursor;
    }

    return { ...collection!, products };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await getCollectionWithProducts(handle);

  if (!collection) {
    return { title: "Collection Not Found — DIDA NYC" };
  }

  return {
    title: `${collection.title} — DIDA NYC`,
    description: collection.description || `Shop the ${collection.title} collection`,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await getCollectionWithProducts(handle);

  if (!collection) {
    notFound();
  }

  return (
    <main>
      <PageHero
        title={collection.title}
        subtitle={collection.description || undefined}
      />
      <section className={styles.section}>
        {collection.products.length > 0 ? (
          <div className={styles.grid}>
            {collection.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No products in this collection yet.</p>
        )}
      </section>
    </main>
  );
}
