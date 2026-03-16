import { BrainCircuit, Rocket, Sparkles, Feather } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { cn } from "@/lib/utils";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const pillars = [
    {
      icon: <BrainCircuit />,
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      color: "#2B5EFF"
    },
    {
      icon: <Rocket />,
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      color: "#566FFF"
    },
    {
      icon: <Feather />,
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      color: "#A792FF"
    },
    {
      icon: <Sparkles />,
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      color: "#FFB8FA"
    }
  ];

  return (
    <section className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/10 py-16 sm:py-24 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-xs md:text-sm font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-widest">
              {dict.about.strategy}
            </h2>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl text-white">
              {dict.about.title}
            </h2>
            <p className="mt-6 text-base md:text-lg leading-relaxed text-foreground/80 max-w-3xl mx-auto">
              {dict.about.mission}
            </p>
          </div>
        </ScrollReveal>

        <div className="mt-20 relative">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-1/2 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent hidden lg:block -translate-y-8" />
          
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8 lg:gap-4 relative z-10">
            {pillars.map((pillar, index) => (
              <ScrollReveal 
                key={pillar.title} 
                delay={`delay-[${index * 100}ms] duration-700`}
                className="flex-1 w-full"
              >
                <div className="group relative flex flex-col items-center lg:items-start text-center lg:text-left">
                  {/* Icon Circle */}
                  <div 
                    className="relative flex items-center justify-center w-14 h-14 rounded-full bg-card/80 backdrop-blur-md border border-white/5 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:border-primary/50 mb-4"
                    style={{ '--glow-color': pillar.color } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-20 bg-[var(--glow-color)] transition-opacity" />
                    {React.cloneElement(pillar.icon as React.ReactElement, { 
                      className: "h-6 w-6 transition-colors duration-300", 
                      style: { color: pillar.color } 
                    })}
                  </div>

                  {/* Text Content */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white/90">
                      {pillar.title}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground/80 leading-snug max-w-[180px]">
                      {pillar.description}
                    </p>
                  </div>

                  {/* Mobile Connector (Line below icons) */}
                  {index < pillars.length - 1 && (
                    <div className="h-8 w-px bg-gradient-to-b from-white/10 to-transparent lg:hidden my-2" />
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        <ScrollReveal className="mt-16 text-center">
          <h3 className="text-[10px] md:text-xs font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-[0.2em]">
            {dict.about.pillarsTitle}
          </h3>
        </ScrollReveal>
      </div>
    </section>
  );
}