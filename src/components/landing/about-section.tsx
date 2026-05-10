
'use client';

import { useEffect, useRef } from "react";
import { BrainCircuit, Rocket, Sparkles, Feather, Quote, MapPin, Briefcase, Linkedin } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import Image from "next/image";
import Link from "next/link";

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
    <section id="about" className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-background to-accent/5 py-24 overflow-hidden scroll-mt-16 md:scroll-mt-20">
      {/* Parallax Grid Background */}
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ hide: 'transform' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10 w-full">
        <SectionHeader 
          badge={dict.about.strategy}
          title={dict.about.title}
          description={dict.about.mission}
          className="mb-12 md:mb-16"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch mb-24 max-w-5xl mx-auto">
          {/* Core Values Pillars */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4 h-full">
            {pillars.map((pillar, index) => (
              <ScrollReveal 
                key={pillar.id} 
                delay={getDelayClass(index)}
                className="h-full"
              >
                <div className="relative aspect-square w-full p-[1px] overflow-hidden rounded-2xl group transition-all duration-500 h-full">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                  />
                  
                  <div className="relative h-full w-full bg-card/90 backdrop-blur-xl rounded-[calc(1rem-1px)] p-4 flex flex-col items-center justify-center text-center transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent overflow-hidden">
                    <div className="mb-3 transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                      {React.cloneElement(pillar.icon as React.ReactElement, { 
                        className: "h-6 w-6 md:h-8 md:w-8", 
                        style: { color: pillar.color } 
                      })}
                    </div>

                    <div className="space-y-1 relative z-10">
                      <h3 className="text-[10px] md:text-[11px] font-bold text-white/90 leading-tight uppercase tracking-wider">
                        {pillar.title}
                      </h3>
                      <p className="text-[8px] md:text-[9px] text-muted-foreground leading-relaxed font-medium max-w-[100px] mx-auto">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Founder Card - Styled as Services Bento Grid */}
          <ScrollReveal delay="delay-400" className="lg:col-span-2 h-full">
            <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
              />
              
              <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5">
                      <div className="relative h-full w-full rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="/images/people/ceo.webp"
                          alt={dict.about.ceo.name}
                          fill
                          className="object-cover object-[center_40%]"
                          
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold text-white tracking-tight leading-none mb-2">
                        {dict.about.ceo.name}
                      </h3>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-primary/80">
                          <Briefcase className="h-3 w-3" />
                          <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none">
                            {dict.about.ceo.role}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/40">
                          <MapPin className="h-3 w-3" />
                          <span className="text-[9px] md:text-[10px] font-medium uppercase tracking-widest leading-none">
                            {dict.about.ceo.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] text-primary/80 uppercase px-2 py-1 rounded bg-primary/5 border border-primary/10">
                        {dict.about.ceo.specialization}
                      </span>
                    </div>
                    
                    {dict.about.ceo.linkedin && (
                      <Link 
                        href={dict.about.ceo.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-primary hover:border-primary/30 transition-all duration-300 group/link"
                      >
                        <Linkedin className="h-4 w-4 md:h-5 md:w-5 group-hover/link:scale-110 transition-transform" />
                      </Link>
                    )}
                  </div>
                </div>
                
                <div className="relative flex-grow">
                  <div className="absolute -left-2 -top-3 h-10 w-10 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />
                  <Quote className="absolute -left-2 -top-2 h-8 w-8 text-primary rotate-180 drop-shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                  <div className="text-sm md:text-base text-white/80 leading-relaxed font-medium pl-8 space-y-4">
                    {dict.about.ceo.bio.split('\n\n').map((paragraph, i) => (
                      <p 
                        key={i} 
                        dangerouslySetInnerHTML={{ __html: paragraph }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
