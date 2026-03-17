
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

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
              {dict.testimonials.title}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              {dict.testimonials.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonialsData.map((testimonial, index) => {
            const logoData = placeholderImages.testimonials.find(img => img.id === testimonial.logoId);
            return (
              <ScrollReveal key={index} delay={`delay-[${index * 200}ms]`}>
                <Card className="bg-card/40 backdrop-blur-md border-white/5 h-full flex flex-col justify-between">
                  <CardContent className="pt-8 flex flex-col h-full">
                    <p className="text-lg italic text-foreground/90 mb-8 leading-relaxed">
                      "{testimonial.quote}"
                    </p>
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                      <div>
                        <p className="font-bold text-white">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                      {logoData && (
                        <div className="relative h-8 w-24 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
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
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
