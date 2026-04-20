'use client';

import { useEffect } from 'react';

/**
 * Sayfa her yüklendiğinde en üste zıplar.
 * Tarayıcıların scroll restoration davranışını manuel'e alıp window.scrollTo ile sıfırlar.
 */
export default function ScrollReset() {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    // Hash yoksa en üste; varsa tarayıcı hash'e zıplamayı halleder
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }
  }, []);

  return null;
}
