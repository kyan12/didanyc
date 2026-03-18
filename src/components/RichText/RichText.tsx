import styles from "./RichText.module.css";

interface RichTextProps {
  html: string;
}

export function RichText({ html }: RichTextProps) {
  return (
    <div
      className={styles.richText}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
