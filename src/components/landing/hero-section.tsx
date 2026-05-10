"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowRight, BookOpen } from "lucide-react";
import { cn } from '@/lib/utils';
import { WavyLines } from './wavy-lines';
import { usePathname } from 'next/navigation';
import type { Dictionary } from '@/lib/get-dictionary';
import { CONFIG } from '@/lib/config';
import { Magnetic } from '@/components/ui/magnetic';
import { ScrollIndicator } from './scroll-indicator';

export function HeroSection({ dict }: { dict: Dictionary }) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center min-h-screen text-center py-24 px-4 md:py-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div
        className={cn(
          'transition-all ease-in-out duration-700 delay-300 z-10 max-w-4xl flex flex-col items-center justify-center',
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <h1 
          className="text-3xl font-bold text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight"
          style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
        >
          {dict.hero.title}
        </h1>
        <p className="mt-8 text-lg leading-relaxed text-white/90 md:text-xl lg:text-2xl max-w-2xl mx-auto px-4 sm:px-0 font-medium">
          {dict.hero.subtitle}
        </p>
        <div className="mt-20 md:mt-16 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Magnetic strength={0.25} className="w-full sm:w-auto">
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-base sm:text-lg h-12 sm:h-14 shadow-2xl">
              <Link href={`/${lang}/project-request/`}>
                {dict.common.workWithUs}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Magnetic>
          
          {CONFIG.enableBlog && (
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base sm:text-lg bg-white/5 text-white border-white/20 hover:bg-white/10 hover:text-white h-12 sm:h-14">
              <Link href={`/${lang}/kx/`}>
                <BookOpen className="mr-2 h-5 w-5 text-primary" />
                {dict.common.readBlog}
              </Link>
            </Button>
          )}
        </div>
      </div>
      <ScrollIndicator label={dict.common.scrollToExplore} />
    </section>
  );
}
