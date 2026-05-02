
"use client";

import React from 'react';
import Image from 'next/image';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import Autoplay from "embla-carousel-autoplay"

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Magnetic } from "@/components/ui/magnetic";
import type { Dictionary } from "@/lib/get-dictionary";
import placeholderImages from "@/app/lib/placeholder-images.json";
import testimonialsData from '@/content/testimonials-template/data.json';
import { WavyLines } from './wavy-lines';
import { SectionHeader } from './section-header';

/**
 * TestimonialsSection component.
 * Displays a scrolling marquee of customer testimonials with a glassmorphism design.
 * Now includes a primary CTA button to mirror the hero's conversion path.
 */
export function TestimonialsSection({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const lang = pathname?.split('/')?.[1] ?? 'en';

  // If no data is found, the section is not rendered
  if (!testimonialsData || testimonialsData.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative min-h-screen flex flex-col justify-center py-16 bg-background overflow-hidden w-full scroll-mt-16 md:scroll-mt-20"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% 120%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      {/* Mirrored background effect to match hero section footer transition */}
      <div className="absolute inset-0 z-0 opacity-20 rotate-180 pointer-events-none">
        <WavyLines />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl w-full">
        <SectionHeader 
          badge={dict.testimonials.title}
          title={dict.testimonials.subtitle}
          className="mb-12 md:mb-16"
        />
      </div>

      {/* Carousel Container */}
      <div className="relative z-10 mt-8 group w-full mb-20">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
          plugins={[
            Autoplay({
              delay: 5000,
              stopOnInteraction: true,
            }),
          ]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {testimonialsData.map((testimonial, index) => {
              const logoData = placeholderImages.testimonials.find(img => img.id === testimonial.logoId);
              return (
                <CarouselItem key={`${testimonial.author}-${index}`} className="pl-4 basis-3/4 md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                      
                      {/* Fluidity Gradient Layer (The "Border") */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_20s_linear_infinite]" 
                      />
                      
                      {/* Inner Content Layer */}
                      <div className="relative h-full w-full bg-card/95 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent">
                        <p className="text-sm sm:text-base md:text-lg italic text-foreground/90 mb-8 leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                          <div>
                            <p className="font-bold text-white text-[11px] sm:text-sm md:text-base">{testimonial.author}</p>
                            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                          {logoData && (
                            <div className="relative h-4 w-14 sm:h-6 sm:w-20 md:h-8 md:w-24 opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                              <Image
                                src={logoData.url}
                                alt={`${testimonial.author} company logo`}
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
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      {/* Hero-equivalent CTA Button */}
      <div className="relative z-10 flex justify-center px-4 w-full">
        <Magnetic strength={0.25} className="w-full sm:w-auto">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto font-semibold text-base sm:text-lg h-12 sm:h-14 shadow-2xl px-10"
          >
            <Link href={`/${lang}/project-request/`}>
              {dict.common.workWithUs}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </Magnetic>
      </div>
    </section>
  );
}
