import Link from 'next/link';
import styles from './blog.module.css';
import { ArrowIcon } from './util';

/* Blog'un işlevi huni girişidir: içerik → hizmet → iletişim. Sahte bir bülten
   formu (e-posta toplayıp hiçbir yere göndermeyen) yerine, gerçekten çalışan
   dönüşüm bandı. Birincil aksiyon iletişim, ikincil aksiyon hizmetler. */
export default function BlogCTA() {
  return (
    <section id="blog-iletisim" data-reveal="up" aria-labelledby="blog-cta-title">
      <div className={styles.cta}>
        <span className={styles.ctaGlow} aria-hidden="true" />
        <div className="relative">
          <span className={styles.sectionKicker}>Bir sonraki adım</span>
          <h2 id="blog-cta-title" className="mx-auto mt-4 max-w-2xl font-heading text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-t1">
            Okuduklarınızı işletmenize <span className="gradient-text">değere</span> dönüştürelim
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-[1rem] font-light leading-relaxed text-t2">
            Yapay zeka, yazılım, e-ticaret ya da dijital pazarlama — hangi konuda olursa olsun,
            ücretsiz keşif görüşmesinde ihtiyacınızı birlikte netleştirelim.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/iletisim" className={styles.ctaBtn}>
              Ücretsiz keşif görüşmesi <ArrowIcon size={15} />
            </Link>
            {/* /hizmetler diye bir route YOK (kategori sayfaları /hizmetler/[key]).
                Navbar, Footer ve breadcrumb'larla aynı hedef: anasayfa hizmetler bölümü. */}
            <Link href="/#services" className={styles.ctaGhost}>
              Hizmetleri keşfet
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
