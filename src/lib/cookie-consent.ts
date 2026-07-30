/**
 * Çerez onayı için tek kaynak. CookieConsent bannerı ve Çerez Politikası
 * sayfasındaki "tercihi sıfırla" kontrolü aynı anahtarı kullanır.
 *
 * localStorage erişimi try/catch içinde: bazı bağlamlarda (gömülü webview,
 * üçüncü taraf depolama engeli, kotanın dolması) getItem/setItem SecurityError
 * atar. Sarmalanmadığı sürece bu hata efekt içinde patlayıp sayfayı kırıyordu.
 */
export const COOKIE_CONSENT_KEY = 'beracore-cookie-consent';

export type CookieDecision = 'accepted' | 'rejected';

export function readCookieDecision(): CookieDecision | null {
  try {
    const v = localStorage.getItem(COOKIE_CONSENT_KEY);
    return v === 'accepted' || v === 'rejected' ? v : null;
  } catch {
    return null;
  }
}

export function writeCookieDecision(v: CookieDecision): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, v);
  } catch {
    /* depolama yoksa karar yalnızca bu oturum için geçerli olur */
  }
}

export function clearCookieDecision(): void {
  try {
    localStorage.removeItem(COOKIE_CONSENT_KEY);
  } catch {
    /* yoksay */
  }
}
