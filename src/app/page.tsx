'use client';

import { useState, useCallback, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';

import Preloader from '@/components/Preloader';
import CustomCursor from '@/components/CustomCursor';
import Starfield from '@/components/Starfield';
import Navbar from '@/components/Navbar';
import Manifesto from '@/components/Manifesto';
import Services from '@/components/Services';
import ServiceDetail from '@/components/ServiceDetail';
import Process from '@/components/Process';
import Stats from '@/components/Stats';
import CtaBand from '@/components/CtaBand';

const HeroCore = dynamic(() => import('@/components/HeroCore'), { ssr: false });

export default function Home() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  const handleReady = useCallback(() => setPreloaderDone(true), []);
  const handleServiceOpen = useCallback((key: string) => setActiveService(key), []);
  const handleServiceClose = useCallback(() => setActiveService(null), []);

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
        <Services onOpenDetail={handleServiceOpen} />
        <Process />
        <Stats />
        <CtaBand />
      </main>

      <ServiceDetail activeKey={activeService} onClose={handleServiceClose} />
    </>
  );
}
