
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import testimonialsData from "@/content/testimonials/data.json";
import placeholderImages from "@/app/lib/placeholder-images.json";

export function TestimonialsSection({ dict }: { dict: Dictionary }) {
  if (!testimonialsData || testimonialsData.length === 0) {
    return null;
  }

  // Duplicate the testimonials data to ensure a seamless infinite loop
  const duplicatedTestimonials = [...testimonialsData, ...testimonialsData, ...testimonialsData];

  return (
    <section className="py-16 sm:py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <ScrollReveal threshold={0}>
          <div className="mx-auto max-w-4xl text-center mb-12 md:mb-16">
            <h1 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
              {dict.testimonials.title}
            </h1>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white leading-tight text-balance whitespace-normal px-4">
              {dict.testimonials.subtitle}
            </h2>
          </div>
        </ScrollReveal>
      </div>

      <div className="relative mt-8 group">
        {/* Infinite scrolling marquee container */}
        <div className="flex animate-marquee whitespace-nowrap gap-8 py-4 px-4 md:px-0">
          {duplicatedTestimonials.map((testimonial, index) => {
            const logoData = placeholderImages.testimonials.find(img => img.id === testimonial.logoId);
            return (
              <div 
                key={index} 
                className="w-[280px] sm:w-[350px] md:w-[450px] shrink-0"
              >
                <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full flex flex-col justify-between whitespace-normal transition-all duration-300 hover:border-primary/20 hover:bg-card/60">
                  <CardContent className="pt-8 flex flex-col h-full">
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
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        
        {/* Gradient overlays for smooth fading at edges */}
        <div className="absolute inset-y-0 left-0 w-12 sm:w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 sm:w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
