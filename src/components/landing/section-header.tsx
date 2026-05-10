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
          <p 
            className="text-[11px] md:text-sm font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-widest mb-4"
            dangerouslySetInnerHTML={{ __html: badge }}
          />
        )}
        <h2 
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-[1.1] tracking-tight",
            titleClassName
          )}
          style={{ textShadow: '0 0 15px rgba(255, 255, 255, 0.1)' }}
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {description && (
          <p 
            className="mt-6 md:mt-8 text-sm md:text-xl leading-relaxed text-foreground/85 max-w-3xl mx-auto font-medium"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </ScrollReveal>
  );
}
