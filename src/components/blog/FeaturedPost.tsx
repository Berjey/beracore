import Link from 'next/link';
import type { MouseEvent } from 'react';
import type { BlogPost } from '@/lib/blog-data';
import styles from './blog.module.css';
import PostCover from './PostCover';
import { ArrowIcon, CategoryBadge, catKey, formatDate } from './util';

/* En yeni yazı — geniş, iki kolonlu vitrin kartı. */
export default function FeaturedPost({ post }: { post: BlogPost }) {
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  return (
    <div data-reveal="up">
      <Link
        href={`/blog/${post.slug}`}
        onMouseMove={onMove}
        className={`group ${styles.tint} ${styles.featured}`}
        data-cat={catKey(post.category)}
      >
        <article className="relative z-[2] grid items-center gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-10">
          <PostCover slug={post.slug} category={post.category} className="aspect-[16/10] lg:order-2 lg:aspect-[4/3]" />
          <div className="px-2 pb-2 lg:order-1 lg:px-4">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <CategoryBadge category={post.category} />
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent2/75">Öne Çıkan</span>
            </div>
            <h2 className={styles.featuredTitle}>{post.title}</h2>
            <p className="mt-4 max-w-xl font-body text-[0.98rem] font-light leading-relaxed text-t3">{post.excerpt}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 font-body text-[0.75rem] text-t3">
              <span className="font-medium text-t2">BERACORE Ekibi</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} dk okuma</span>
            </div>
            <span className="mt-7 inline-flex items-center gap-2 font-body text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-accent transition-all duration-300 group-hover:gap-3">
              Yazının tamamını oku <ArrowIcon size={15} />
            </span>
          </div>
        </article>
      </Link>
    </div>
  );
}
