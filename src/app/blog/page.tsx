import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { PostCard } from "@/components/PostCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Blog — DIDA NYC",
  description: "Tips, stories, and guides from the DIDA NYC team.",
};

interface Post {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  date: string;
}

const posts: Post[] = [
  {
    title: "5 Tips for Healthy Wash Day",
    excerpt:
      "Wash day doesn't have to be an all-day affair. Here are five simple tips to streamline your routine while keeping your curls happy.",
    slug: "5-tips-for-healthy-wash-day",
    date: "March 10, 2026",
  },
  {
    title: "Why We Don't Use Sulfates",
    excerpt:
      "Sulfates strip your hair of natural oils. We break down what they are, why they're in most shampoos, and why we leave them out.",
    slug: "why-we-dont-use-sulfates",
    date: "February 24, 2026",
  },
  {
    title: "The Science of Moisture and Protein Balance",
    excerpt:
      "Your hair needs both moisture and protein in the right ratio. Learn how to tell what your hair is craving and how to restore balance.",
    slug: "moisture-protein-balance",
    date: "February 12, 2026",
  },
];

export default function BlogPage() {
  return (
    <main>
      <PageHero
        title="Blog"
        subtitle="Tips, stories, and guides for your natural hair journey."
      />
      <section className={styles.grid}>
        {posts.map((post) => (
          <PostCard key={post.slug} {...post} />
        ))}
      </section>
    </main>
  );
}
