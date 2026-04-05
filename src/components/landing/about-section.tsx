'use client';

import { useEffect, useRef } from "react";
import { BrainCircuit, Rocket, Sparkles, Feather } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (gridRef.current) {
            const scrollY = window.scrollY;
            gridRef.current.style.transform = `translateY(${scrollY * 0.05}px) translateZ(0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const pillars = [
    {
      id: "tech",
      icon: <BrainCircuit />,
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      color: "hsl(var(--brand-1))",
    },
    {
      id: "optimization",
      icon: <Rocket />,
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      color: "hsl(var(--brand-2))",
    },
    {
      id: "freedom",
      icon: <Feather />,
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      color: "hsl(var(--brand-3))",
    },
    {
      id: "innovation",
      icon: <Sparkles />,
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      color: "hsl(var(--brand-4))",
    }
  ];

  const getDelayClass = (index: number) => {
    const delays = ["duration-700", "delay-100 duration-700", "delay-200 duration-700", "delay-300 duration-700"];
    return delays[index] || "duration-700";
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-background to-accent/5 py-24 sm:py-32 overflow-hidden">
      {/* Parallax Grid Background */}
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ willChange: 'transform' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10">
        <SectionHeader 
          badge={dict.about.strategy}
          title={dict.about.title}
          description={dict.about.mission}
          className="mb-16"
        />

        <div className="relative grid grid-cols-2 gap-3 md:gap-4 max-w-2xl mx-auto">
          {pillars.map((pillar, index) => (
            <ScrollReveal 
              key={pillar.id} 
              delay={getDelayClass(index)}
              className="h-full"
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-xl group transition-all duration-500">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                />
                
                <div className="relative h-full w-full bg-card rounded-[calc(0.75rem-1px)] p-4 md:p-6 flex flex-col items-center text-center transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent">
                  <div 
                    className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-lg bg-white/5 border border-white/5 shadow-xl transition-all duration-500 mb-4 group-hover:scale-110"
                    style={{ color: pillar.color } as React.CSSProperties}
                  >
                    <div className="absolute inset-0 rounded-lg blur-md opacity-0 group-hover:opacity-10 bg-current transition-opacity" />
                    
                    {React.cloneElement(pillar.icon as React.ReactElement, { 
                      className: "h-5 w-5 md:h-6 md:w-6 relative z-10", 
                      style: { color: pillar.color } 
                    })}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-white/90 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-[11px] md:text-sm text-muted-foreground/70 leading-relaxed font-medium">
                      {pillar.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
