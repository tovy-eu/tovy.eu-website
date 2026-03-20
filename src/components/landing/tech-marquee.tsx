
import React from 'react';
import Image from 'next/image';
import placeholderImages from "@/app/lib/placeholder-images.json";
import type { Dictionary } from '@/lib/get-dictionary';

export function TechMarquee({ dict }: { dict: Dictionary }) {
  const techLogos = placeholderImages.tech;
  // Triple the logos for a long, smooth continuous loop
  const duplicatedLogos = [...techLogos, ...techLogos, ...techLogos];

  return (
    <div className="w-full py-10 bg-background/30 border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-6">
          <p className="text-[10px] font-bold tracking-[0.3em] text-center text-muted-foreground/40 uppercase">
              {dict.common.techStack}
          </p>
      </div>
      <div className="relative flex items-center">
        <div className="flex animate-marquee whitespace-nowrap gap-16 sm:gap-24 items-center">
          {duplicatedLogos.map((logo, index) => (
            <div 
              key={`${logo.id}-${index}`} 
              className="relative h-6 w-24 sm:h-8 sm:w-32 opacity-20 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 flex-shrink-0"
            >
              <Image
                src={logo.url}
                alt={`${logo.id} logo`}
                fill
                className="object-contain"
                data-ai-hint={logo.hint}
              />
            </div>
          ))}
        </div>
        
        {/* Subtle Edge Fades for professional "trusted dashboard" feel */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
}
