import styles from "./PageHero.module.css";

interface PageHeroProps {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export function PageHero({ title, subtitle, imageUrl, imageAlt }: PageHeroProps) {
  return (
    <section className={styles.hero}>
      {imageUrl && (
        <div className={styles.imageWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={imageAlt ?? ""} className={styles.image} />
        </div>
      )}
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </section>
  );
}
