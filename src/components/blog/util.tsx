import { getCategoryMeta } from '@/lib/blog-data';
import styles from './blog.module.css';

/* Blog UI için paylaşılan saf yardımcılar + küçük sunum parçaları. */

// Tarih biçimlendirme tek kaynakta (lib/format) — buradan yeniden ihraç edilir.
export { formatDate } from '@/lib/format';

/** Slug'dan stabil sayısal hash — kapak paterni (0/1/2) seçmek için. */
export function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Kategori adı → stabil anahtar (data-cat / renk kapsamı). */
export function catKey(category: string): string {
  return getCategoryMeta(category)?.serviceKey ?? 'ai';
}

/** Kategoriye özgü minimal çizgi ikon (görsel yerine anlam işareti). */
export function CategoryIcon({ category }: { category: string }) {
  const key = catKey(category);
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (key) {
    case 'blockchain':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.4" {...p} /><rect x="14" y="14" width="7" height="7" rx="1.4" {...p} /><path d="M10 6.5h4a2 2 0 0 1 2 2V14M6.5 10v3.5a2 2 0 0 0 2 2H14" {...p} /></svg>
      );
    case 'software':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 8.5 5 12l3.5 3.5M15.5 8.5 19 12l-3.5 3.5M13 6l-2 12" {...p} /></svg>
      );
    case 'design':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v4M12 17v4M3 12h4M17 12h4" {...p} /><circle cx="12" cy="12" r="4" {...p} /></svg>
      );
    case 'ecommerce':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h13l-1.2 8.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 5H3.5" {...p} /><circle cx="9.5" cy="20" r="1.1" {...p} /><circle cx="16" cy="20" r="1.1" {...p} /></svg>
      );
    case 'marketing':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h3l6 4V6l-6 4H4zM17 9.5a3.5 3.5 0 0 1 0 5" {...p} /></svg>
      );
    default: // ai
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" {...p} /><path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" {...p} /></svg>
      );
  }
}

/** Kategori rozeti (ikon + ad). */
export function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`${styles.tint} ${styles.badge}`} data-cat={catKey(category)}>
      <CategoryIcon category={category} />
      {category}
    </span>
  );
}

/** "Oku" oku. */
export function ArrowIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}
