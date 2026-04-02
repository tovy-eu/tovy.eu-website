import { BrainCircuit, Rocket, Sparkles, Feather } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const pillars = [
    {
      icon: <BrainCircuit />,
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      color: "hsl(var(--brand-1))",
    },
    {
      icon: <Rocket />,
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      color: "hsl(var(--brand-2))",
    },
    {
      icon: <Feather />,
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      color: "hsl(var(--brand-3))",
    },
    {
      icon: <Sparkles />,
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      color: "hsl(var(--brand-4))",
    }
  ];

  const getDelayClass = (index: number) => {
    if (index === 0) return "duration-700";
    const delays = [0, 100, 200, 300, 500, 700, 1000];
    const delayValue = index * 100;
    return delays.includes(delayValue) ? `delay-${delayValue} duration-700` : `duration-700`;
  };

  return (
    <section className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-24 sm:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        
        <SectionHeader 
          badge={dict.about.strategy}
          title={dict.about.title}
          description={dict.about.mission}
        />

        <div className="mt-20 md:mt-24 relative mx-auto max-w-4xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {pillars.map((pillar, index) => (
              <ScrollReveal 
                key={pillar.title} 
                delay={getDelayClass(index)}
                className="flex flex-col items-center text-center group"
              >
                <div 
                  className="relative flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/5 shadow-xl transition-all duration-500 mb-6 group-hover:scale-110 group-hover:border-primary/20"
                  style={{ color: pillar.color } as React.CSSProperties}
                >
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-10 bg-current transition-opacity" />
                  
                  {React.cloneElement(pillar.icon as React.ReactElement, { 
                    className: "h-6 w-6 md:h-7 md:w-7 relative z-10 transition-colors duration-300", 
                    style: { color: pillar.color } 
                  })}
                </div>

                <div className="space-y-2">
                  <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90 leading-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-xs md:text-sm text-muted-foreground/60 leading-relaxed max-w-[140px] mx-auto">
                    {pillar.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
