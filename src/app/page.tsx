import HomeClient from '@/components/HomeClient';
import { getReferanslar } from '@/lib/db/content';

/**
 * Ana sayfanın SUNUCU kabuğu.
 *
 * Tek işi veritabanından okuyup istemci gövdesine geçirmek. `'use client'`
 * taşıyan bir sayfa `node:sqlite`'a erişemez; erişmeye çalışmak derlemeyi kırar
 * (Faz 1.1'de fiilen kırdı).
 *
 * Referanslar KÖK DÜZENE konmadı bilerek: yalnızca ana sayfa kullanıyor ve
 * bağlama konulsaydı 3 yorumun metni 119 sayfanın hepsinin yüküne girerdi.
 */
export default function Home() {
  return <HomeClient referanslar={getReferanslar()} />;
}
