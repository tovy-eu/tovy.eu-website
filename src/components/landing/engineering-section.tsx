'use client';

import { useEffect, useRef } from "react";
import { CloudCog, CodeXml, DatabaseZap, DraftingCompass } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function EngineeringSection({ dict }: { dict: Dictionary }) {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (gridRef.current) {
            const scrollY = window.scrollY;
            gridRef.current.style.transform = `translateY(${scrollY * 0.08}px) translateZ(0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const serviceLines = [
    {
      id: "strategic_design",
      title: dict.engineering.services.strategic.title,
      icon: <DraftingCompass />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-1))",
      className: "md:col-span-2"
    },
    {
      id: "cloud_infrastructure",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-2))",
      className: "md:col-span-1"
    },
    {
      id: "data_engineering",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-3))",
      className: "md:col-span-1"
    },
    {
      id: "analytics_automation",
      title: dict.engineering.services.analytics.title,
      icon: <CodeXml />,
      description: dict.engineering.services.analytics.desc,
      stack: dict.engineering.services.analytics.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-4))",
      className: "md:col-span-2"
    },
  ];

  const getDelayClass = (index: number) => {
    if (index === 0) return "duration-700";
    const delays = [0, 100, 200, 300, 500, 700, 1000];
    const delayValue = index * 100;
    return delays.includes(delayValue) ? `delay-${delayValue} duration-700` : `duration-700`;
  };

  return (
    <section className="relative w-full bg-gradient-to-b from-background to-accent/5 py-24 sm:py-32 overflow-hidden">
      {/* Parallax Grid Background - Optimized with Ref */}
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ willChange: 'transform' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10">
        <SectionHeader 
          badge={dict.engineering.strategy}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-16"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {serviceLines.map((service, index) => (
            <ScrollReveal 
              key={service.id} 
              delay={getDelayClass(index)}
              className={cn("h-full", service.className)}
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                />
                
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="transition-colors"
                      style={{ color: service.color }}
                    >
                      {React.cloneElement(service.icon as React.ReactElement, { className: "h-5 w-5" })}
                    </div>
                    <h3 className="text-sm md:text-base font-bold text-white/90">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-white leading-relaxed mb-6 flex-grow font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 mt-auto">
                    {service.stack.map(item => (
                      <span 
                        key={item.tool} 
                        className="text-[10px] md:text-[11px] font-bold tracking-wider text-muted-foreground/80"
                      >
                        {item.tool}
                      </span>
                    ))}
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