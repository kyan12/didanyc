import Image from "next/image";
import Link from "next/link";
import styles from "./Hero.module.css";

interface HeroProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  imageUrl: string;
  imageAlt: string;
  videoUrl?: string;
}

export function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  imageUrl,
  imageAlt,
  videoUrl,
}: HeroProps) {
  return (
    <section className={styles.hero}>
      <div className={styles.media}>
        {videoUrl ? (
          <video
            className={styles.video}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster={imageUrl}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        )}
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{subtitle}</p>
        <Link href={ctaHref} className={styles.cta}>
          {ctaText}
        </Link>
      </div>
    </section>
  );
}
