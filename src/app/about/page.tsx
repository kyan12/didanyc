import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";

export const metadata: Metadata = {
  title: "About — DIDA NYC",
  description: "The story behind DIDA NYC — premium haircare rooted in heritage.",
};

const heroData = {
  title: "Our Story",
  subtitle:
    "DIDA NYC was born from a belief that haircare should honor every texture, every curl, every coil — without compromise.",
};

const bodyHtml = `
<h2>Rooted in Heritage</h2>
<p>
  Growing up in New York City, our founder experienced firsthand how difficult
  it was to find haircare products that truly worked for textured hair. The
  options were either loaded with harsh chemicals or simply didn't deliver
  results. DIDA NYC was created to change that.
</p>

<h2>Our Philosophy</h2>
<p>
  We believe that what you put on your hair matters just as much as what you
  put in your body. Every DIDA NYC formula is crafted with carefully sourced
  natural ingredients — no sulfates, no parabens, no silicones. Just clean,
  effective haircare that lets your natural beauty shine.
</p>

<h2>Made in New York</h2>
<p>
  From our studio in Brooklyn, we develop, test, and refine every product
  in-house. Each batch is small enough to ensure quality and large enough to
  share with a growing community of people who refuse to settle for less.
</p>

<h2>Our Promise</h2>
<p>
  We're committed to transparency, sustainability, and results. Every
  ingredient is listed, every claim is backed, and every product is made to
  make a real difference in your hair routine.
</p>
`;

export default function AboutPage() {
  return (
    <main>
      <PageHero title={heroData.title} subtitle={heroData.subtitle} />
      <RichText html={bodyHtml} />
    </main>
  );
}
