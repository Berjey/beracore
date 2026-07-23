'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Image from 'next/image';
import CustomCursor from '@/components/CustomCursor';
import Starfield from '@/components/Starfield';
import Navbar from '@/components/Navbar';
import Manifesto from '@/components/Manifesto';
import TechMarquee from '@/components/TechMarquee';
import Services from '@/components/Services';
import WhyUs from '@/components/WhyUs';
import Process from '@/components/Process';
import Stats from '@/components/Stats';
import Testimonials from '@/components/Testimonials';
import HomeFaq from '@/components/HomeFaq';
import CtaBand from '@/components/CtaBand';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';

const HeroCore = dynamic(() => import('@/components/HeroCore'), { ssr: false });

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);

  // Preloader kalktıktan sonra ScrollTrigger pozisyonlarını yenile
  useEffect(() => {
    if (preloaderDone) {
      const timer = setTimeout(() => ScrollTrigger.refresh(), 300);
      return () => clearTimeout(timer);
    }
  }, [preloaderDone]);

  const handleReady = useCallback(() => setPreloaderDone(true), []);

  return (
    <>
      {/* SSR hero poster — ilk boyada aninda gorunur (LCP ~FCP), 3D hazir olunca yerini birakir.
          Wordmark, HeroCore overlay'i ile birebir ayni stilde; gecis kusursuz (ayni konum/font). */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-[50] flex flex-col items-center justify-center gap-5 bg-bg transition-opacity duration-700 ${
          preloaderDone ? 'opacity-0 invisible pointer-events-none' : 'opacity-100'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)' }}
      >
        <div
          className="absolute top-1/2 left-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(255,169,249,0.08), rgba(255,247,173,0.03) 40%, transparent 65%)',
            transform: 'translate(-50%, -50%)',
            filter: 'blur(25px)',
          }}
        />
        {/* Markalı logo görseli — deterministik, erken boyanan LCP elementi (priority/preload). */}
        <Image
          src="/beracore-bg.png"
          alt=""
          width={380}
          height={248}
          priority
          fetchPriority="high"
          className="relative w-[clamp(220px,28vw,340px)] h-auto drop-shadow-[0_0_40px_rgba(255,169,249,0.25)]"
        />
      </div>
      <Starfield />
      <CustomCursor />
      <Navbar />

      <main id="main" className="relative z-[1]">
        {/* Anlamsal H1 — SSR'da render edilir, ilk HTML yanıtında yer alır.
            HeroCore (ssr:false / 3D canvas) client-side kalırken Googlebot bu başlığı ilk taramada görür.
            Görsel wordmark HeroCore içinde <p> olarak duruyor; sayfadaki tek <h1> budur. */}
        <h1 className="sr-only">
          BERACORE — Web Tasarım, Yazılım Geliştirme, Yapay Zeka ve E-Ticaret Çözümleri Sunan Dijital Deneyim Stüdyosu
        </h1>
        {/* SSR'da render edilen sabit yukseklikli sarmalayici (Suspense/ssr:false bailout'un DISINDA).
            Hero slotu icin 150vh yer ayirir; HeroCore client'ta yuklenince Manifesto kaymaz -> CLS ~0 */}
        <div className="w-full h-[150vh]">
          <Suspense fallback={null}>
            <HeroCore onReady={handleReady} />
          </Suspense>
        </div>
        <Manifesto />
        <TechMarquee />
        <Services />
        <WhyUs />
        <Process />
        <Stats />
        <Testimonials />
        <HomeFaq />
        <CtaBand />
      </main>

      <Footer />
      <ScrollToTop />
    </>
  );
}
