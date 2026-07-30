'use client';

import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';

/** Sürükleme sayılmayan en fazla hareket (px). */
const MOVE_TOLERANCE = 8;

/**
 * 3D canvas'lar OrbitControls ile sürüklenerek döndürülür. Sürükleme bittiğinde
 * tarayıcı, aynı öğe üzerinde ayrıca bir `click` olayı üretir — bu yüzden
 * sarmalayıcıya konan `onClick` şekli döndürmek isteyen kullanıcıyı da
 * tetikliyordu (anasayfada hizmet sayfasına gidiyor, hizmet sayfasında
 * detaya kaydırıyordu).
 *
 * Bu hook yalnızca GERÇEK dokunuşta — pointer basıldığı yerden neredeyse hiç
 * kaymadıysa — çalışan handler'lar döndürür. Sürükleyerek döndürme artık
 * gezinmeyi tetiklemez.
 */
export function useTapOnly(onTap: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);

  return {
    onPointerDown: (e: ReactPointerEvent) => {
      start.current = { x: e.clientX, y: e.clientY };
    },
    onPointerUp: (e: ReactPointerEvent) => {
      const s = start.current;
      start.current = null;
      if (!s) return;
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) > MOVE_TOLERANCE) return;
      onTap();
    },
    onPointerCancel: () => {
      start.current = null;
    },
  };
}
