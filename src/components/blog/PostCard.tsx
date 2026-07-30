import Link from 'next/link';
import type { MouseEvent } from 'react';
import type { BlogPostSummary } from '@/lib/blog-data';
import styles from './blog.module.css';
import PostCover from './PostCover';
import { ArrowIcon, CategoryBadge, catKey, formatDate } from './util';

/* Grid kartı. Kapak + meta + başlık + özet + "Oku". Hover: elevation, kenarlık
   geçişi, imleç-takipli spotlight, kapak parallax. Renk kategoriye göre. */
export default function PostCard({ post }: { post: BlogPostSummary }) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <li data-reveal="scale">
      <Link
        href={`/blog/${post.slug}`}
        onMouseMove={onMove}
        className={`${styles.tint} ${styles.card}`}
        data-cat={catKey(post.category)}
      >
        <article className="relative z-[2] flex h-full flex-col">
          <PostCover slug={post.slug} category={post.category} className="aspect-[16/10]" />
          <div className={styles.cardBody}>
            <div className="mb-3 flex items-center gap-2.5">
              <CategoryBadge category={post.category} />
              <span className={styles.cardMeta}>{post.readingMinutes} dk okuma</span>
            </div>
            <h3 className={styles.cardTitle}>{post.title}</h3>
            <p className={`${styles.cardExcerpt} mt-2.5 line-clamp-3 flex-1`}>{post.excerpt}</p>
            <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
              <time className={styles.cardMeta} dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span className={styles.readMore}>Oku <ArrowIcon size={13} /></span>
            </div>
          </div>
        </article>
      </Link>
    </li>
  );
}
