import { BrainCircuit, Rocket, Sparkles, Feather } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function AboutSection({ dict }: { dict: Dictionary }) {
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
    <section className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-24 sm:py-32 overflow-hidden">
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        
        <SectionHeader 
          badge={dict.about.strategy}
          title={dict.about.title}
          description={dict.about.mission}
          className="mb-16"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {pillars.map((pillar, index) => (
            <ScrollReveal 
              key={pillar.id} 
              delay={getDelayClass(index)}
              className="h-full"
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                
                {/* Fluidity Gradient Layer (The "Border") */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_20s_linear_infinite]" 
                />
                
                {/* Inner Content Layer - Matches Engineering Section */}
                <div className="relative h-full w-full bg-card/95 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent text-center items-center">
                  <div 
                    className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/5 shadow-xl transition-all duration-500 mb-6 group-hover:scale-110 group-hover:border-primary/20"
                    style={{ color: pillar.color } as React.CSSProperties}
                  >
                    {/* Subtle Background Glow */}
                    <div className="absolute inset-0 rounded-2xl blur-md opacity-0 group-hover:opacity-10 bg-current transition-opacity" />
                    
                    {React.cloneElement(pillar.icon as React.ReactElement, { 
                      className: "h-6 w-6 md:h-7 md:w-7 relative z-10 transition-colors duration-300", 
                      style: { color: pillar.color } 
                    })}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-white/90 leading-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-sm text-muted-foreground/70 leading-relaxed font-medium">
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
