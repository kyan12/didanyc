import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProductCard } from "@/components/ProductCard";
import {
  shopifyFetch,
  ALL_PRODUCTS_QUERY,
  type AllProductsResponse,
  type ShopifyProduct,
} from "@/lib/shopify";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "All Products — DIDA NYC",
  description: "Shop all DIDA NYC products",
};

export const revalidate = 3600;

async function getAllProducts(): Promise<ShopifyProduct[]> {
  try {
    const products: ShopifyProduct[] = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      const data: AllProductsResponse = await shopifyFetch<AllProductsResponse>({
        query: ALL_PRODUCTS_QUERY,
        variables: { first: 100, after },
      });

      for (const edge of data.products.edges) {
        products.push(edge.node);
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
      after = data.products.pageInfo.endCursor;
    }

    return products;
  } catch {
    return [];
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();

  return (
    <main>
      <PageHero
        title="All Products"
        subtitle="Explore our full range of premium haircare"
      />
      <section className={styles.section}>
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className={styles.empty}>No products available yet.</p>
        )}
      </section>
    </main>
  );
}
