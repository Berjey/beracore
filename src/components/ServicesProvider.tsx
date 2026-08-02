'use client';

import { createContext, useContext } from 'react';
import { type ServiceNav } from '@/lib/services-data';

/**
 * Hizmet listesini istemci bileşenlerine taşıyan bağlam.
 *
 * Navbar, Footer, ana sayfa hizmet bölümü, Hakkımızda ve İletişim sayfaları
 * hizmet listesini gezinme için kullanıyor. Faz 1.3c'ye kadar hepsi
 * `services-data.ts`'i DOĞRUDAN import ediyordu; bu iki sonuç doğuruyordu:
 *
 *  1. 23 alt hizmetin tüm uzun metni (longDescription, features, process,
 *     benefits, faq) her sayfanın tarayıcı paketine giriyordu — hiçbiri
 *     kullanılmadığı hâlde. Aynı hata blogda yapılmıştı ve `/blog` HTML'ini
 *     507 KB'a çıkarmıştı (bkz. `BlogPostSummary` notu).
 *  2. İçerik veritabanına taşındıktan sonra panelden değiştirilen bir hizmet
 *     başlığı gezinmede ESKİ hâliyle kalırdı.
 *
 * Bağlam yalnızca `ServiceNav` taşır: başlık, slug, renk, ikon, kısa açıklama.
 * Uzun içerik yalnızca onu render eden sayfaya prop olarak gider.
 *
 * BURADA KOD YEDEĞİ YOK — bilerek. Yedek için `services-data.ts`'i import etmek,
 * kaçınmak için uğraşılan ağır modülü tarayıcı paketine geri sokardı. Geri düşme
 * SUNUCUDA yapılır: `getServices()` veritabanı okunamazsa koddaki listeyi döner,
 * dolayısıyla bağlama her zaman dolu bir liste ulaşır.
 */
const ServicesContext = createContext<ServiceNav[]>([]);

export default function ServicesProvider({
  services,
  children,
}: {
  services: ServiceNav[];
  children: React.ReactNode;
}) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): ServiceNav[] {
  return useContext(ServicesContext);
}
