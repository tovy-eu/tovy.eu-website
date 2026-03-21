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
import { trackEvent } from '@/lib/analytics';

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

  const handleCtaClick = () => {
    trackEvent({
      name: 'cta_click',
      event_category: 'engagement',
      event_label: 'Hero CTA'
    });
  };

  const handleBlogClick = () => {
    trackEvent({
      name: 'read_blog_click',
      event_category: 'engagement',
      event_label: 'Hero Blog Link'
    });
  };

  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center min-h-[75vh] text-center py-12 px-4 md:py-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div
        className={cn(
          'transition-all ease-in-out duration-700 delay-300 z-10 max-w-4xl flex flex-col items-center justify-center flex-grow',
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <h1 
          className="text-2xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.2] sm:leading-[1.15]"
          style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.2)' }}
        >
          {dict.hero.title}
        </h1>
        <p className="mt-6 text-sm leading-relaxed text-white/80 sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto px-4 sm:px-0">
          {dict.hero.subtitle}
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-base sm:text-lg h-11 sm:h-12" onClick={handleCtaClick}>
            <Link href={`/${lang}/project-request/`}>
              {dict.common.workWithUs}
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
          
          {CONFIG.enableBlog && (
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto font-semibold text-base sm:text-lg bg-transparent text-white border-white/50 hover:bg-white/10 hover:text-white h-11 sm:h-12" onClick={handleBlogClick}>
              <Link href={`/${lang}/blog/`}>
                <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                {dict.common.readBlog}
              </Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
