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
      // As it reaches center, weight shifts from 600 to 900
      const proximity = Math.max(0, 1 - centerOffset / (viewportHeight / 1.5));
      const newWeight = 600 + (proximity * 300);
      
      setWeight(newWeight);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ScrollReveal>
      <div ref={headerRef} className={cn("mx-auto max-w-4xl text-center", className)}>
        {badge && (
          <h1 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
            {badge}
          </h1>
        )}
        <h2 
          className={cn(
            "mt-2 text-2xl tracking-tight sm:text-3xl md:text-4xl text-white transition-all duration-300 ease-out",
            titleClassName
          )}
          style={{ 
            fontWeight: weight,
            fontVariationSettings: `'wght' ${weight}`
          }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80 max-w-3xl mx-auto">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
