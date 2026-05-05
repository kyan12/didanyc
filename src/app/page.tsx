import type { Metadata } from "next";
import { Hero } from "@/components/Hero";
import { FeaturedCollections } from "@/components/FeaturedCollections";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { EditorialBlock } from "@/components/EditorialBlock";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import {
  shopifyFetch,
  FEATURED_PRODUCTS_QUERY,
  FEATURED_COLLECTIONS_QUERY,
} from "@/lib/shopify";
import type {
  FeaturedProductsResponse,
  FeaturedCollectionsResponse,
} from "@/lib/shopify";

export const metadata: Metadata = {
  title: "DIDA NYC — Barber-Grade Men's Hair Care",
  description:
    "Premium men's hair care built on barber-grade performance, a proprietary scent signature, and a clean finish. Shampoo, pomades, and styling from DIDA NYC.",
};

export const revalidate = 60;

async function getFeaturedProducts() {
  try {
    const data = await shopifyFetch<FeaturedProductsResponse>({
      query: FEATURED_PRODUCTS_QUERY,
      variables: { first: 8 },
    });
    return data.products.edges.map((edge) => edge.node);
  } catch {
    return [];
  }
}

async function getFeaturedCollections() {
  try {
    const data = await shopifyFetch<FeaturedCollectionsResponse>({
      query: FEATURED_COLLECTIONS_QUERY,
      variables: { first: 4 },
    });
    return data.collections.edges.map((edge) => edge.node);
  } catch {
    return [];
  }
}

export default async function Home() {
  const [products, collections] = await Promise.all([
    getFeaturedProducts(),
    getFeaturedCollections(),
  ]);

  return (
    <main>
      <Hero
        title="Barber-Grade. Clean Finish."
        subtitle="The complete men's hair routine — built for performance, defined by scent."
        ctaText="Shop Now"
        ctaHref="/collections"
        imageUrl="/images/hero.jpg"
        imageAlt="DIDA NYC men's hair care products"
      />

      {collections.length > 0 && (
        <FeaturedCollections collections={collections} />
      )}

      {products.length > 0 && <FeaturedProducts products={products} />}

      <EditorialBlock
        title="Five Products. One Routine."
        body="From daily cleanse to final style — DIDA NYC covers the full routine with a single scent signature across every product. Shampoo, leave-in conditioner, matte pomade, semi-gloss pomade, and styling powder. No buildup. Washes out clean. Barber-grade hold."
        imageUrl="/images/editorial-products.jpg"
        imageAlt="DIDA NYC five-product routine"
        ctaText="See All Products"
        ctaHref="/products"
      />

      <EditorialBlock
        title="The Barber's Recommendation You Can Bring Home."
        body="DIDA NYC is stocked in barbershops because barbers trust it. The scent is proprietary, the performance is real, and the clean finish keeps clients coming back. A portion of every purchase goes to charity."
        imageUrl="/images/editorial-barber.jpg"
        imageAlt="DIDA NYC in the barbershop"
        ctaText="Our Story"
        ctaHref="/about"
        reverse
      />

      <NewsletterSignup />
    </main>
  );
}
