'use client';

// Kök layout'ta oluşan hatalar için son savunma hattı. error.tsx layout'un
// İÇİNDE çalışır; layout'un kendisi patlarsa devreye bu girer. Bu yüzden
// kendi <html>/<body> etiketlerini içermek ZORUNDADIR ve global CSS'e
// güvenemez (stil satır içi verilir).

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="tr">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px',
          padding: '24px',
          textAlign: 'center',
          background: '#0f0d16',
          color: '#f2f0ed',
          fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 'clamp(1.4rem, 5vw, 2rem)', fontWeight: 600 }}>
          Beklenmeyen bir hata oluştu
        </h1>
        <p style={{ margin: 0, maxWidth: '30rem', lineHeight: 1.7, color: 'rgba(242,240,237,0.65)', fontSize: '0.95rem' }}>
          Sayfa yüklenirken bir sorun oluştu. Yeniden denemeyi veya ana sayfaya
          dönmeyi deneyebilirsiniz.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              minHeight: '44px',
              padding: '12px 28px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#0f0d16',
              background: 'linear-gradient(135deg, #fff7ad, #ffa9f9)',
            }}
          >
            Yeniden Dene
          </button>
          {/* Link DEĞİL, bilinçli <a>: bu ekran KÖK LAYOUT çöktüğünde
              gösterilir. İstemci tarafı gezinme bozuk React ağacının içinde
              kalır; tam sayfa yükleme temiz bir durumla başlamayı garanti eder. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            style={{
              minHeight: '44px',
              padding: '12px 28px',
              borderRadius: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#f2f0ed',
              border: '1px solid rgba(242,240,237,0.25)',
            }}
          >
            Ana Sayfa
          </a>
        </div>
        {error.digest && (
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.08em', color: 'rgba(242,240,237,0.3)' }}>
            Hata referansı: {error.digest}
          </p>
        )}
      </body>
    </html>
  );
}
