"use client";

import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  titleClassName?: string;
}

/**
 * SectionHeader component with standardized heading hierarchy.
 * Uses h2 for titles and a styled paragraph for overline badges to avoid skipping levels.
 */
export function SectionHeader({
  badge,
  title, 
  description, 
  className,
  titleClassName 
}: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className={cn("mx-auto max-w-4xl text-center px-4", className)}>
        {badge && (
          <p className="text-[14px] md:text-[16px] leading-7 text-white/50 tracking-wide mb-4 font-headline font-medium">
            {badge}
          </p>
        )}
        <h2
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold font-headline text-white leading-[1.05] tracking-tight text-balance",
            titleClassName
          )}
          style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.05)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-6 md:mt-8 text-base md:text-lg leading-[1.6] tracking-[-0.01em] text-white/65 max-w-2xl mx-auto font-medium text-pretty">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
