import styles from "./IngredientCard.module.css";

interface IngredientCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function IngredientCard({
  title,
  description,
  imageUrl,
  imageAlt,
}: IngredientCardProps) {
  return (
    <article className={styles.card}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={imageAlt ?? ""} className={styles.image} />
        </div>
      )}
      <div className={styles.body}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
    </article>
  );
}
