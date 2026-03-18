import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  shopifyFetch,
  PRODUCT_BY_HANDLE_QUERY,
  ALL_PRODUCTS_QUERY,
  type ProductByHandleResponse,
  type AllProductsResponse,
} from "@/lib/shopify";
import { ProductDetail } from "./ProductDetail";
import styles from "./page.module.css";

export const revalidate = 3600;

export async function generateStaticParams() {
  try {
    const handles: Array<{ handle: string }> = [];
    let hasNextPage = true;
    let after: string | null = null;

    while (hasNextPage) {
      const data: AllProductsResponse = await shopifyFetch<AllProductsResponse>({
        query: ALL_PRODUCTS_QUERY,
        variables: { first: 100, after },
      });

      for (const edge of data.products.edges) {
        handles.push({ handle: edge.node.handle });
      }

      hasNextPage = data.products.pageInfo.hasNextPage;
      after = data.products.pageInfo.endCursor;
    }

    return handles;
  } catch {
    return [];
  }
}

async function getProduct(handle: string) {
  try {
    const data = await shopifyFetch<ProductByHandleResponse>({
      query: PRODUCT_BY_HANDLE_QUERY,
      variables: { handle },
    });
    return data.product;
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
  const product = await getProduct(handle);

  if (!product) {
    return { title: "Product Not Found — DIDA NYC" };
  }

  const image = product.images.edges[0]?.node;

  return {
    title: product.seo.title || `${product.title} — DIDA NYC`,
    description:
      product.seo.description || product.description.slice(0, 160),
    openGraph: image
      ? {
          images: [
            {
              url: image.url,
              width: image.width,
              height: image.height,
              alt: image.altText ?? product.title,
            },
          ],
        }
      : undefined,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = await getProduct(handle);

  if (!product) {
    notFound();
  }

  return (
    <main className={styles.main}>
      <ProductDetail product={product} />
    </main>
  );
}
