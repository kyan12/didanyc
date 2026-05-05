import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { IngredientCard } from "@/components/IngredientCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ingredients",
  description:
    "Clean formulation, real performance. Every DIDA NYC ingredient is chosen to deliver barber-grade results without buildup or harsh residue.",
};

interface Ingredient {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

const ingredients: Ingredient[] = [
  {
    title: "Kaolin Clay",
    description:
      "The matte hold foundation in our pomades. Absorbs excess oil, adds texture, and creates clean separation without making hair stiff or brittle.",
  },
  {
    title: "Beeswax",
    description:
      "Natural wax that gives our pomades their hold and workability. Provides structure without flaking and keeps the style in place through the day.",
  },
  {
    title: "Castor Oil",
    description:
      "A thick conditioning oil that supports scalp health and adds slip to our leave-in conditioner. Balances the hold agents in our styling products.",
  },
  {
    title: "Argan Oil",
    description:
      "Lightweight and non-greasy. Adds shine control in our semi-gloss pomade and softens hair in the shampoo and leave-in formulas without heaviness.",
  },
  {
    title: "Provitamin B5",
    description:
      "Penetrates the hair shaft to improve moisture retention and reduce breakage. Keeps hair resilient across the full routine from shampoo to styler.",
  },
  {
    title: "Rice Starch",
    description:
      "The key texture agent in our Styling Powder. Absorbs oil at the root, adds volume and grip, and delivers the invisible-product finish men expect.",
  },
];

export default function IngredientsPage() {
  return (
    <main>
      <PageHero
        title="What's Inside"
        subtitle="Clean formulation, real performance. No buildup, no harsh residue — every ingredient earns its place."
      />
      <section className={styles.grid}>
        {ingredients.map((ingredient) => (
          <IngredientCard key={ingredient.title} {...ingredient} />
        ))}
      </section>
    </main>
  );
}
