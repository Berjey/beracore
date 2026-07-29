import styles from './blog.module.css';
import { CategoryIcon, catKey, slugHash } from './util';

/* Yazı görseli veri modelinde yok — kapak, kategori renginden deterministik
   olarak üretilir (slug hash → 3 patern varyantından biri). Görsel isteği yok
   → mükemmel LCP/CLS, tamamen self-contained. */
export default function PostCover({
  slug,
  category,
  className = '',
}: {
  slug: string;
  category: string;
  className?: string;
}) {
  const pattern = slugHash(slug) % 3;
  return (
    <div
      className={`${styles.tint} ${styles.cover} ${className}`}
      data-cat={catKey(category)}
      data-p={pattern}
      aria-hidden="true"
    >
      <span className={styles.coverMark}>
        <CategoryIcon category={category} />
      </span>
    </div>
  );
}
