import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { IngredientCard } from "@/components/IngredientCard";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Ingredients — DIDA NYC",
  description:
    "Explore the natural ingredients behind every DIDA NYC product.",
};

interface Ingredient {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

const ingredients: Ingredient[] = [
  {
    title: "Shea Butter",
    description:
      "Rich in vitamins A and E, shea butter deeply moisturizes and seals in hydration without weighing hair down.",
  },
  {
    title: "Jamaican Black Castor Oil",
    description:
      "Cold-pressed and unrefined, this oil strengthens strands from root to tip and supports healthy hair growth.",
  },
  {
    title: "Aloe Vera",
    description:
      "A natural conditioner that soothes the scalp, reduces dandruff, and adds a lightweight shine.",
  },
  {
    title: "Coconut Oil",
    description:
      "Penetrates the hair shaft to reduce protein loss, leaving hair stronger and more resilient.",
  },
  {
    title: "Avocado Oil",
    description:
      "Loaded with oleic acid and monounsaturated fats, it nourishes dry and brittle hair back to life.",
  },
  {
    title: "Tea Tree Oil",
    description:
      "A powerful antimicrobial that keeps the scalp clean and healthy while promoting natural growth.",
  },
];

export default function IngredientsPage() {
  return (
    <main>
      <PageHero
        title="Our Ingredients"
        subtitle="We source the finest natural ingredients — each one chosen for a reason."
      />
      <section className={styles.grid}>
        {ingredients.map((ingredient) => (
          <IngredientCard key={ingredient.title} {...ingredient} />
        ))}
      </section>
    </main>
  );
}
