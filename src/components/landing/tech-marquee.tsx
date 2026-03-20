
import React from 'react';
import Image from 'next/image';
import placeholderImages from "@/app/lib/placeholder-images.json";
import type { Dictionary } from '@/lib/get-dictionary';
import { cn } from '@/lib/utils';

export function TechMarquee({ dict }: { dict: Dictionary }) {
  const techLogos = placeholderImages.tech;
  // Triple the logos for a long, smooth continuous loop
  const duplicatedLogos = [...techLogos, ...techLogos, ...techLogos];

  return (
    <div className="w-full py-10 bg-background/30 border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-8">
          <p className="text-[10px] font-bold tracking-[0.3em] text-center text-muted-foreground/40 uppercase">
              {dict.common.techStack}
          </p>
      </div>
      <div className="relative flex items-center">
        <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-20 items-center">
          {duplicatedLogos.map((logo, index) => {
            const isBig = ['gcp', 'databricks', 'powerbi'].includes(logo.id);
            
            return (
              <div 
                key={`${logo.id}-${index}`} 
                className={cn(
                  "relative flex items-center justify-center h-8 w-28 sm:h-10 sm:w-36 opacity-20 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 flex-shrink-0",
                  isBig && "sm:w-44" // Provide more horizontal room for high-priority logos
                )}
              >
                <div className={cn(
                  "relative w-full h-full transition-all duration-300",
                  isBig ? "max-w-full max-h-full scale-110" : "max-w-[80%] max-h-[80%]"
                )}>
                  <Image
                    src={logo.url}
                    alt={`${logo.id} logo`}
                    fill
                    className="object-contain"
                    data-ai-hint={logo.hint}
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Subtle Edge Fades for professional "trusted dashboard" feel */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
}
