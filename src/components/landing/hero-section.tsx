"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowDown } from "lucide-react";
import { cn } from '@/lib/utils';
import { AiChipIcon } from './ai-chip-icon';
import { WavyLines } from './wavy-lines';

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center min-h-[80vh] text-center py-20 md:py-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div
        className={cn(
          'transition-all ease-in-out duration-700 delay-300 z-10 max-w-4xl px-4',
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <h1 
          className="text-4xl font-bold tracking-tight text-white sm:text-6xl md:text-7xl"
          style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.3)' }}
        >
          Uw <span className="bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">AI</span> ontwikkelingspartner
        </h1>
        <p className="mt-6 text-lg leading-8 text-white/80 sm:text-xl">
          Wij bouwen schone, snelle en betrouwbare systemen die u volledige controle en gemoedsrust geven.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-x-6">
          <Button asChild size="lg" className="font-semibold text-lg">
            <Link href="/project-request">
              Dien uw idee in
              <ArrowDown className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <AiChipIcon className="mt-12" />
        </div>
      </div>
    </section>
  );
}
