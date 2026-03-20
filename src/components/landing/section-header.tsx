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

export function SectionHeader({ 
  badge, 
  title, 
  description, 
  className,
  titleClassName 
}: SectionHeaderProps) {
  return (
    <ScrollReveal>
      <div className={cn("mx-auto max-w-4xl text-center", className)}>
        {badge && (
          <h1 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
            {badge}
          </h1>
        )}
        <h2 className={cn(
          "mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-white",
          titleClassName
        )}>
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
