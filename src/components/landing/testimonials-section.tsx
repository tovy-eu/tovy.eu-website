import React from 'react';
import Image from 'next/image';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import placeholderImages from "@/app/lib/placeholder-images.json";
import testimonialsData from '@/content/testimonials-template/data.json';
import { WavyLines } from './wavy-lines';
import { SectionHeader } from './section-header';

/**
 * TestimonialsSection component.
 * Displays a scrolling marquee of customer testimonials with a glassmorphism design.
 * Uses direct JSON import for stability in static exports.
 */
export function TestimonialsSection({ dict }: { dict: Dictionary }) {
  // If no data is found, the section is not rendered
  if (!testimonialsData || testimonialsData.length === 0) {
    return null;
  }

  // Duplicate the testimonials data for infinite loop
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData];

  return (
    <section 
      className="relative py-16 sm:py-24 bg-background overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 120%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <div className="absolute inset-0 z-0 opacity-20 rotate-180">
        <WavyLines />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl">
        <SectionHeader 
          badge={dict.testimonials.title}
          title={dict.testimonials.subtitle}
          className="mb-12 md:mb-16"
        />
      </div>

      <div className="relative z-10 mt-8 group">
        <div className="flex animate-marquee whitespace-nowrap gap-8 py-4 px-4 md:px-0">
          {duplicatedTestimonials.map((testimonial, index) => {
            const logoData = placeholderImages.testimonials.find(img => img.id === testimonial.logoId);
            return (
              <div 
                key={`${testimonial.author}-${index}`} 
                className="w-[280px] sm:w-[350px] md:w-[450px] shrink-0"
              >
                <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                  
                  {/* Fluidity Gradient Layer (The "Border") */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_20s_linear_infinite]" 
                  />
                  
                  {/* Inner Content Layer - Matches Engineering, About, and Solution Cards */}
                  <div className="relative h-full w-full bg-card/95 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent whitespace-normal">
                    <p className="text-sm sm:text-base md:text-lg italic text-foreground/90 mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                      <div>
                        <p className="font-bold text-white text-xs sm:text-sm md:text-base">{testimonial.author}</p>
                        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      {logoData && (
                        <div className="relative h-5 w-16 sm:h-6 sm:w-20 md:h-8 md:w-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                          <Image
                            src={logoData.url}
                            alt={`${testimonial.role} logo`}
                            fill
                            className="object-contain"
                            data-ai-hint={logoData.hint}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Subtle Edge Fades for professional marquee feel */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
