import Image from "next/image";
import Link from "next/link";
import styles from "./EditorialBlock.module.css";

interface EditorialBlockProps {
  title: string;
  body: string;
  imageUrl: string;
  imageAlt: string;
  ctaText?: string;
  ctaHref?: string;
  reverse?: boolean;
}

export function EditorialBlock({
  title,
  body,
  imageUrl,
  imageAlt,
  ctaText,
  ctaHref,
  reverse,
}: EditorialBlockProps) {
  return (
    <section
      className={`${styles.section} ${reverse ? styles.reverse : ""}`}
    >
      <div className={styles.imageWrap}>
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        {ctaText && ctaHref && (
          <Link href={ctaHref} className={styles.cta}>
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  );
}
