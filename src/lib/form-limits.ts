/**
 * İletişim formu alan uzunlukları — TEK KAYNAK (denetim bulgusu A-10).
 *
 * Sunucu (`api/contact/route.ts`) ve istemci (`ContactPage.tsx`) aynı sınırları
 * kullanmak zorunda. Ayrı yazıldıklarında ayrıştılar: sunucu mesaj için 4000,
 * istemci 2000 kabul ediyordu. Bugünkü hâliyle zararsızdı çünkü istemci daha
 * KATIYDI — ama ters yönde bir ayrışma, kullanıcının yazdığı metnin sessizce
 * kırpılması veya formun sebepsiz reddedilmesi demekti. Koddaki yorum bile
 * "AYNI olmalı" diyordu; iki yerde tutmak bunu garanti etmiyor.
 *
 * Saf modül: hem istemci hem sunucu import edebilir.
 * `tests/form-limits.test.ts` iki tarafın da bu dosyayı kullandığını kilitler.
 */
export const FORM_LIMITS = {
  name: 120,
  email: 160,
  phone: 40,
  company: 140,
  message: 2000,
} as const;

export type FormAlan = keyof typeof FORM_LIMITS;
