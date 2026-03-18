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
        title="Rooted in Heritage, Made for You"
        subtitle="Premium haircare crafted with natural ingredients for textured hair."
        ctaText="Shop Now"
        ctaHref="/collections"
        imageUrl="/images/hero.jpg"
        imageAlt="DIDA NYC haircare products"
      />

      {collections.length > 0 && (
        <FeaturedCollections collections={collections} />
      )}

      {products.length > 0 && <FeaturedProducts products={products} />}

      <EditorialBlock
        title="Crafted with Care"
        body="Every DIDA NYC product is formulated with natural, ethically sourced ingredients. We believe in the power of nature to nourish and transform textured hair — without harsh chemicals or sulfates."
        imageUrl="/images/editorial-ingredients.jpg"
        imageAlt="Natural ingredients used in DIDA NYC products"
        ctaText="Our Ingredients"
        ctaHref="/ingredients"
      />

      <EditorialBlock
        title="Our Story"
        body="Born in New York City, DIDA NYC draws inspiration from Caribbean and African haircare traditions passed down through generations. We're building a brand that honors heritage while embracing modern science."
        imageUrl="/images/editorial-story.jpg"
        imageAlt="DIDA NYC brand story"
        ctaText="Learn More"
        ctaHref="/about"
        reverse
      />

      <NewsletterSignup />
    </main>
  );
}
