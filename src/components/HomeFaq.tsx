'use client';

import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ScrollText from '@/components/ScrollText';

gsap.registerPlugin(ScrollTrigger);

const FAQ_ITEMS = [
  {
    q: 'BERACORE hangi hizmetleri sunuyor?',
    a: 'Web ve mobil yazılım geliştirme, UI/UX tasarım, e-ticaret altyapısı, yapay zekâ destekli otomasyon, blockchain çözümleri ve dijital pazarlama. Her projeyi strateji, tasarım, mühendislik ve lansman olarak uçtan uca tek bir ekiple yürütüyoruz.',
  },
  {
    q: 'Proje süreci nasıl işliyor?',
    a: 'Keşif görüşmesi ile başlıyoruz. İhtiyaç analizi, strateji, tasarım, geliştirme ve lansman adımlarını şeffaf bir yol haritası üzerinden iteratif sprintlerle yürütüyoruz. Her sprint sonunda demo yapıyor, kararları birlikte alıyor, süreci canlı proje panosundan takip etmenizi sağlıyoruz.',
  },
  {
    q: 'Bir projenin tamamlanması ne kadar sürer?',
    a: 'Her projenin kapsamı, karmaşıklığı ve öncelikleri farklı olduğu için tek bir sabit süreden söz etmek doğru olmaz. Keşif görüşmesinin ardından projenize özel, gerçekçi bir zaman planı sunuyor; teslim noktalarını birlikte belirliyoruz. İhtiyaç halinde MVP yaklaşımıyla hızlı bir ilk çıkış alıp kademeli olarak genişletebiliriz.',
  },
  {
    q: 'Proje maliyeti nasıl belirleniyor?',
    a: 'Kapsam, teknoloji seçimleri ve teslim sürecine göre projeye özel sabit kapsamlı teklif hazırlıyoruz. İlk keşif görüşmesi ücretsiz ve taahhütsüzdür. Süreç içinde kapsam değişiklikleri sizinle önceden mutabık kalınarak netleştirilir; sürpriz maliyet çıkmaz.',
  },
  {
    q: 'Teslim sonrası bakım ve destek alıyor muyuz?',
    a: 'Evet. Teslim sonrası bakım, güvenlik güncellemeleri, performans izleme, hata çözümü ve yeni özellik geliştirme süreçlerini kapsayan destek paketleri sunuyoruz. Lansman sonrasında da sizinle sürekli iletişimde kalıyoruz.',
  },
  {
    q: 'Yeni girişimler ve küçük ekiplerle de çalışıyor musunuz?',
    a: 'Evet. Yeni kurulan markalardan kurumsal şirketlere kadar farklı ölçeklerde projeler yürütüyoruz. Özellikle erken dönem ürün doğrulama ve MVP geliştirme süreçlerinde sizi, birlikte inşa ettiğimiz uzun soluklu bir iş ortağı olarak görüyoruz.',
  },
  {
    q: 'Kaynak kodu, tasarım varlıkları ve gizlilik nasıl yönetiliyor?',
    a: 'Tüm kod tabanı, tasarım varlıkları ve dokümantasyon sözleşmeyle birlikte size devredilir; projeyi dilediğiniz zaman başka bir ekiple de sürdürebilirsiniz. Talep edilen her ticari gizlilik sözleşmesini (NDA) imzalıyor, verilerinizi ve fikri mülkiyetinizi ilgili mevzuata uygun şekilde koruyoruz.',
  },
  {
    q: 'Hangi teknolojileri kullanıyorsunuz?',
    a: 'React, Next.js, Node.js, TypeScript, Python, React Native, Solidity ve ilgili modern ekosistemlerle çalışıyoruz. Projenin ihtiyaçlarına göre en uygun stack\'i birlikte belirliyor, gereksiz karmaşıklıktan kaçınıyoruz.',
  },
];

export default function HomeFaq() {
  const sectionRef = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    let ctx: gsap.Context | null = null;
    const timer = setTimeout(() => {
      ctx = gsap.context(() => {
        gsap.fromTo('.faq-item', { y: 30, opacity: 0 }, {
          y: 0, opacity: 1, stagger: 0.025,
          scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: 0.15 },
        });
      }, section);
    }, 400);
    return () => { clearTimeout(timer); ctx?.revert(); };
  }, []);

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <section ref={sectionRef} id="faq" className="py-32 px-8 max-md:px-5 max-md:py-20">
      <div className="max-w-[750px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-body text-[clamp(2rem,4vw,3.2rem)] font-light tracking-tight leading-[1.15]">
            <ScrollText before="Sıkça Sorulan " accent="Sorular" />
          </h2>
        </div>
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <div key={i} className="faq-item relative border rounded-2xl overflow-hidden transition-all duration-400"
              style={{ borderColor: openIndex === i ? 'rgba(255,169,249,0.2)' : 'rgba(255,255,255,0.06)', background: openIndex === i ? 'rgba(255,169,249,0.02)' : 'rgba(255,255,255,0.01)' }}>
              <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full transition-opacity duration-400" style={{ background: 'linear-gradient(to bottom, #ffa9f9, #fff7ad)', opacity: openIndex === i ? 1 : 0 }} />
              <button onClick={() => toggle(i)} className="w-full flex items-center justify-between p-7 text-left font-body transition-colors duration-300" aria-expanded={openIndex === i}>
                <span className="text-[1.02rem] font-medium pr-4" style={{ color: openIndex === i ? 'var(--color-accent)' : 'var(--color-t1)' }}>{item.q}</span>
                <div className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-400" style={{ background: openIndex === i ? 'rgba(255,169,249,0.1)' : 'transparent' }}>
                  <svg className="w-4 h-4 transition-transform duration-400" style={{ color: openIndex === i ? '#ffa9f9' : 'var(--color-t3)', transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 9l6 6 6-6" /></svg>
                </div>
              </button>
              <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: openIndex === i ? '300px' : '0', opacity: openIndex === i ? 1 : 0 }}>
                <p className="px-7 pb-7 font-body text-[0.95rem] text-t2 font-light leading-[1.85]">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
