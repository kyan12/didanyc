import Link from "next/link";
import styles from "./PostCard.module.css";

interface PostCardProps {
  title: string;
  excerpt: string;
  slug: string;
  imageUrl?: string;
  imageAlt?: string;
  date?: string;
}

export function PostCard({
  title,
  excerpt,
  slug,
  imageUrl,
  imageAlt,
  date,
}: PostCardProps) {
  return (
    <article className={styles.card}>
      <Link href={`/blog/${slug}`} className={styles.link}>
        {imageUrl && (
          <div className={styles.imageWrap}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imageUrl} alt={imageAlt ?? ""} className={styles.image} />
          </div>
        )}
        <div className={styles.body}>
          {date && <time className={styles.date}>{date}</time>}
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.excerpt}>{excerpt}</p>
        </div>
      </Link>
    </article>
  );
}
