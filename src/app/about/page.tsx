import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { RichText } from "@/components/RichText";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind DIDA NYC — premium men's hair care built on barber-grade performance, a proprietary scent, and a clean finish.",
};

const heroData = {
  title: "Built in NYC. Trusted in the Chair.",
  subtitle:
    "DIDA NYC was created for men who care about how they look — and how they smell.",
};

const bodyHtml = `
<h2>Where It Started</h2>
<p>
  Men deserved better. Not just better products — a better experience. Something
  that performed like the professionals used, smelled like it was made for them,
  and didn't leave buildup in their hair. DIDA NYC was built to be that brand.
  Rooted in New York City, distributed through barber shops, and formulated to
  actually work.
</p>

<h2>The Full Routine, One Scent</h2>
<p>
  Most grooming brands pick one format and stop there. DIDA NYC covers the full
  routine — shampoo, leave-in conditioner, matte pomade, semi-gloss pomade, and
  styling powder — connected by a single proprietary scent signature. When a man
  discovers the scent, he recognizes every product in the line. That's
  intentional.
</p>

<h2>Barber-Grade Performance</h2>
<p>
  Our products are stocked and recommended in barbershops because they perform
  at the level barbers expect. Strong hold that washes out clean. No buildup,
  no residue, no harsh ingredients that damage hair over time. When a barber
  puts their name behind a product, the product has to deliver.
</p>

<h2>NYC Roots. Community Purpose.</h2>
<p>
  DIDA NYC was born in New York City — premium, urban, and built for real use.
  We believe quality and purpose go together. A portion of every purchase goes
  to charity, because the brand you choose should stand for something beyond
  the shelf.
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
