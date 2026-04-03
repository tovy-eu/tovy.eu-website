"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ScrollReveal } from "../scroll-reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

export function SectionHeader({ 
  badge, 
  title, 
  description, 
  className,
  titleClassName 
}: SectionHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [weight, setWeight] = useState(700);

  useEffect(() => {
    const handleScroll = () => {
      if (!headerRef.current) return;
      
      const rect = headerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const centerOffset = Math.abs(rect.top + rect.height / 2 - viewportHeight / 2);
      
      // Calculate weight based on proximity to center of viewport
      const proximity = Math.max(0, 1 - centerOffset / (viewportHeight / 1.5));
      const newWeight = 700 + (proximity * 200);
      
      setWeight(newWeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollReveal>
      <div ref={headerRef} className={cn("mx-auto max-w-4xl text-center", className)}>
        {badge && (
          <h1 className="text-xs md:text-sm font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-[0.3em] mb-4">
            {badge}
          </h1>
        )}
        <h2 
          className={cn(
            "text-2xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white transition-all duration-300 ease-out leading-[1.2] sm:leading-[1.15]",
            titleClassName
          )}
          style={{ 
            fontWeight: weight,
            fontVariationSettings: `'wght' ${weight}`,
            textShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
          }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-8 text-base md:text-xl leading-relaxed text-foreground/70 max-w-3xl mx-auto font-medium">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
