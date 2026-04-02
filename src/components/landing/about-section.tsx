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
      delay: "-4s" // Peak at 0s (Left)
    },
    {
      icon: <Rocket />,
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      color: "hsl(var(--brand-2))",
      delay: "-2.66s" // Peak at 1.34s (Mid-left)
    },
    {
      icon: <Feather />,
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      color: "hsl(var(--brand-3))",
      delay: "-1.33s" // Peak at 2.67s (Mid-right)
    },
    {
      icon: <Sparkles />,
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      color: "hsl(var(--brand-4))",
      delay: "0s" // Peak at 4s (Right)
    }
  ];

  return (
    <section className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/10 py-16 sm:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        
        <SectionHeader 
          badge={dict.about.strategy}
          title={dict.about.title}
          description={dict.about.mission}
        />

        <div className="mt-16 md:mt-24 relative mx-auto max-w-3xl">
          {/* Header for pillars - moved above visuals */}
          <ScrollReveal className="text-center mb-10 md:mb-12">
            <h2 className="text-[10px] md:text-xs font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-[0.2em]">
              {dict.about.pillarsTitle}
            </h2>
          </ScrollReveal>

          {/* Thicker Connecting Line (Always Horizontal) with synchronized sweep */}
          <div className="absolute top-[88px] md:top-[108px] left-[8%] right-[8%] h-[3px] bg-white/5 overflow-hidden rounded-full">
            <div 
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-primary/20 to-transparent blur-md animate-kitt-line-sweep"
            />
            <div 
              className="absolute inset-y-0 w-1/4 bg-white/5 blur-sm animate-kitt-line-sweep"
            />
          </div>
          
          <div className="flex flex-row items-start justify-between relative z-10">
            {pillars.map((pillar, index) => (
              <ScrollReveal 
                key={pillar.title} 
                delay={`delay-[${index * 100}ms] duration-700`}
                className="flex-1"
              >
                <div className="group relative flex flex-col items-center text-center px-1">
                  {/* Icon Circle - Unified with footer color */}
                  <div 
                    className="relative flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-card/40 backdrop-blur-xl border border-white/10 shadow-xl transition-all duration-500 mb-3 md:mb-4 overflow-visible"
                    style={{ '--glow-color': pillar.color, color: pillar.color } as React.CSSProperties}
                  >
                    {/* Minimalistic Sequential Glow */}
                    <div 
                      className="absolute inset-0 rounded-full blur-lg opacity-0 animate-kitt-scan pointer-events-none" 
                      style={{ 
                        backgroundColor: pillar.color,
                        animationDelay: pillar.delay
                      }} 
                    />
                    
                    <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-20 bg-[var(--glow-color)] transition-opacity" />
                    
                    {React.cloneElement(pillar.icon as React.ReactElement, { 
                      className: "h-4 w-4 md:h-5 md:w-5 relative z-10 transition-colors duration-300", 
                      style: { color: pillar.color } 
                    })}
                  </div>

                  {/* Text Content - Responsive typography */}
                  <div className="space-y-0.5 md:space-y-1">
                    <h3 className="text-[8px] md:text-[10px] lg:text-xs font-bold uppercase tracking-widest text-white/80 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-[8px] md:text-[10px] lg:text-[11px] text-muted-foreground/60 leading-tight max-w-[70px] md:max-w-[120px] mx-auto hidden sm:block">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
