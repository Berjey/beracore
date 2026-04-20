'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import Preloader from '@/components/Preloader';
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
      {!preloaderDone && <Preloader />}
      <Starfield />
      <CustomCursor />
      <Navbar />

      <main id="main" className="relative z-[1]">
        <Suspense fallback={<div className="w-full h-screen" />}>
          <HeroCore onReady={handleReady} />
        </Suspense>
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
