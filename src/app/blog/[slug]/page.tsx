import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";
import styles from "./page.module.css";

interface Article {
  title: string;
  date: string;
  body: string;
}

const articles: Record<string, Article> = {
  "5-tips-for-healthy-wash-day": {
    title: "5 Tips for Healthy Wash Day",
    date: "March 10, 2026",
    body: `
<p>Wash day is the foundation of your haircare routine. Here's how to make the most of it.</p>

<h2>1. Pre-Poo with Oil</h2>
<p>Apply a generous amount of oil — like Jamaican black castor oil or coconut oil — to your hair before washing. This creates a protective barrier so shampoo doesn't strip away too much moisture.</p>

<h2>2. Focus Shampoo on the Scalp</h2>
<p>Your scalp is where buildup happens. Concentrate your sulfate-free shampoo there and let the suds gently cleanse your lengths as you rinse.</p>

<h2>3. Deep Condition Every Time</h2>
<p>After cleansing, apply a deep conditioner and let it sit for at least 15 minutes. For extra penetration, cover with a plastic cap and add gentle heat.</p>

<h2>4. Detangle with Conditioner In</h2>
<p>Never detangle dry hair. Use a wide-tooth comb or your fingers while your deep conditioner is still in to minimize breakage.</p>

<h2>5. Seal with a Leave-In</h2>
<p>Lock in all that hydration with a lightweight leave-in conditioner and a sealing oil. Your curls will thank you all week.</p>
`,
  },
  "why-we-dont-use-sulfates": {
    title: "Why We Don't Use Sulfates",
    date: "February 24, 2026",
    body: `
<p>Walk into any drugstore and pick up a shampoo bottle — chances are, it contains sulfates. But what are they, and why do we avoid them?</p>

<h2>What Are Sulfates?</h2>
<p>Sulfates like sodium lauryl sulfate (SLS) and sodium laureth sulfate (SLES) are strong detergents. They create the foamy lather most people associate with "clean" hair. But that lather comes at a cost.</p>

<h2>The Problem</h2>
<p>Sulfates strip your hair and scalp of natural oils — the very oils that keep your hair moisturized, shiny, and protected. For textured and curly hair, which is already prone to dryness, this can lead to breakage, frizz, and an irritated scalp.</p>

<h2>Our Approach</h2>
<p>At DIDA NYC, we use gentle, plant-derived cleansers that remove dirt and buildup without stripping. Your hair gets clean without sacrificing the moisture it needs to thrive.</p>
`,
  },
  "moisture-protein-balance": {
    title: "The Science of Moisture and Protein Balance",
    date: "February 12, 2026",
    body: `
<p>Healthy hair is all about balance. Understanding the relationship between moisture and protein is the key to stronger, more resilient strands.</p>

<h2>What Moisture Does</h2>
<p>Moisture keeps hair soft, elastic, and easy to manage. Without enough moisture, hair becomes dry, brittle, and prone to snapping. Water-based products, leave-in conditioners, and humectants like glycerin all add moisture.</p>

<h2>What Protein Does</h2>
<p>Protein reinforces the hair's internal structure. Your hair is made of a protein called keratin, and protein treatments help fill in gaps along the hair shaft caused by heat, color, or manipulation.</p>

<h2>Finding Your Balance</h2>
<p>Too much moisture without protein leads to mushy, limp hair that stretches and won't snap back. Too much protein without moisture makes hair stiff and brittle. The key is alternating between moisture-rich and protein-rich treatments based on what your hair tells you.</p>

<h2>How to Tell</h2>
<p>Take a strand of wet hair and gently stretch it. If it stretches far and doesn't return, you need protein. If it barely stretches and snaps quickly, you need moisture. If it stretches slightly and bounces back, you've found the sweet spot.</p>
`,
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: `${article.title} — DIDA NYC`,
    description: article.body.replace(/<[^>]*>/g, "").slice(0, 155),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles[slug];

  if (!article) {
    notFound();
  }

  return (
    <main>
      <PageHero title={article.title} />
      <div className={styles.meta}>
        <time>{article.date}</time>
      </div>
      <RichText html={article.body} />
    </main>
  );
}
