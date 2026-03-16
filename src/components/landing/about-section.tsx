import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Rocket, Sparkles, Feather } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const pillars = [
    {
      icon: <BrainCircuit className="h-8 w-8" />,
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      color: "#2B5EFF"
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      color: "#566FFF"
    },
    {
      icon: <Feather className="h-8 w-8" />,
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      color: "#A792FF"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      color: "#FFB8FA"
    }
  ];

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/10 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
          <svg
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto"
            width="1150"
            height="600"
            viewBox="0 0 1150 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2B5EFF" />
                <stop offset="33%" stopColor="#566FFF" />
                <stop offset="66%" stopColor="#A792FF" />
                <stop offset="100%" stopColor="#FFB8FA" />
              </linearGradient>
              <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <path
              d="M50 400 C 250 400 300 300 425 300 C 550 300 600 500 725 500 C 850 500 900 400 1100 400"
              stroke="url(#path-gradient)"
              strokeWidth="2"
              fill="none"
              className="animated-wavy-line opacity-50"
              style={{ filter: "url(#path-glow)" }}
            />
          </svg>
        </div>
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
              {dict.about.strategy}
            </h2>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
              {dict.about.title}
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center mt-8 md:mt-12">
            <p className="text-base md:text-lg leading-relaxed text-foreground/80">
              {dict.about.mission}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-16 text-center">
            <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              {dict.about.pillarsTitle}
            </h3>
          </div>
        </ScrollReveal>
        
        <div className="relative mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {pillars.map((pillar, index) => (
            <ScrollReveal key={pillar.title} delay={`delay-[${index * 150}ms] duration-700`}>
              <Card 
                className="relative h-full flex flex-col bg-card/60 backdrop-blur-md border-none shadow-xl transition-all duration-300 hover:-translate-y-2 text-center overflow-hidden group"
                style={{ '--pillar-color': pillar.color, '--pillar-shadow-color': `${pillar.color}1A` } as React.CSSProperties}
              >
                {/* Glass Reflection Shine */}
                <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none z-10" />
                
                <CardHeader className="items-center z-0 p-6 pb-2">
                  <div 
                    className="p-3 md:p-4 rounded-lg"
                    style={{ backgroundColor: `var(--pillar-shadow-color)`}}
                  >
                    {React.cloneElement(pillar.icon as React.ReactElement, { className: "h-6 w-6 md:h-8 md:w-8", style: { color: `var(--pillar-color)` } })}
                  </div>
                  <CardTitle className="mt-4 text-lg md:text-xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardDescription className="p-6 pt-2 text-sm md:text-base text-muted-foreground/90 flex-grow z-0">
                  {pillar.description}
                </CardDescription>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
