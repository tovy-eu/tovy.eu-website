"use client";

import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  index?: string;
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
  index,
  badge, 
  title, 
  description, 
  className,
  titleClassName 
}: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className={cn("mx-auto max-w-4xl text-center px-4", className)}>
        {index && (
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/20 mb-6 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-white/10" />
            <span>{"// "}{index}</span>
            <span className="h-px w-8 bg-white/10" />
          </div>
        )}
        {badge && (
          <p className="text-[11px] md:text-[12px] font-black leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-[0.3em] mb-4">
            {badge}
          </p>
        )}
        <h2 
          className={cn(
            "text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-[1.05] tracking-tight text-balance",
            titleClassName
          )}
          style={{ textShadow: '0 0 30px rgba(255, 255, 255, 0.05)' }}
        >
          {title}
        </h2>
        {description && (
          <p className="mt-6 md:mt-8 text-base md:text-lg leading-[1.6] tracking-[-0.01em] text-white/50 max-w-2xl mx-auto font-medium text-pretty">
            {description}
          </p>
        )}
      </div>
    </ScrollReveal>
  );
}
