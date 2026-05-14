
'use client';

import { useEffect, useRef } from "react";
import { CloudCog, CodeXml, DatabaseZap, DraftingCompass, CheckCircle } from "lucide-react";
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
      id: "strategic",
      title: dict.engineering.services.strategic.title,
      icon: <DraftingCompass />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools?.map(tool => ({ tool })) || [],
      color: "hsl(var(--brand-1))",
      className: "md:col-span-2",
    },
    {
      id: "cloud",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools?.map(tool => ({ tool })) || [],
      points: dict.engineering.services.cloud.points || [],
      color: "hsl(var(--brand-2))",
      className: "md:col-span-3",
    },
    {
      id: "data",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools?.map(tool => ({ tool })) || [],
      points: dict.engineering.services.data.points || [],
      color: "hsl(var(--brand-3))",
      className: "md:col-span-3",
    },
    {
      id: "automation",
      title: dict.engineering.services.automation.title,
      icon: <CodeXml />,
      description: dict.engineering.services.automation.desc,
      stack: dict.engineering.services.automation.tools?.map(tool => ({ tool })) || [],
      color: "hsl(var(--brand-4))",
      className: "md:col-span-2",
    },
  ];

  const getDelayClass = (index: number) => {
    if (index === 0) return "duration-700";
    const delays = [0, 100, 200, 300, 500, 700, 1000];
    const delayValue = index * 100;
    return delays.includes(delayValue) ? `delay-${delayValue} duration-700` : `duration-700`;
  };

  return (
    <section id="services" className="relative w-full min-h-screen flex flex-col justify-center bg-gradient-to-b from-background to-accent/5 py-24 overflow-hidden scroll-mt-16 md:scroll-mt-20">
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ transform: 'translateZ(0)' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10 w-full">
        <SectionHeader 
          badge={dict.engineering.section}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-16"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-6">
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
                
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent overflow-hidden">
                  <div 
                    className="absolute top-0 right-0 text-9xl font-black opacity-30 select-none -translate-y-1/4 translate-x-1/4"
                    style={{ color: service.color }}
                  >
                    {index + 1}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="transition-colors"
                      style={{ color: service.color }}
                    >
                      {React.cloneElement(service.icon as React.ReactElement, { className: "h-5 w-5" })}
                    </div>
                    <h3 className="text-base font-bold text-white/90 uppercase tracking-widest">
                      {service.title}
                    </h3>
                  </div>

                  {service.stack && service.stack.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-6">
                      {service.stack.map(item => (
                        <span 
                          key={item.tool} 
                          className="tool-tag text-[10px] font-bold tracking-[0.2em] uppercase px-2 py-1 rounded border"
                          style={{ '--service-color': `var(--brand-${index + 1})` } as React.CSSProperties}
                        >
                          {item.tool}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-base text-white/80 leading-relaxed font-medium">
                    {service.description}
                  </p>

                  {service.points && service.points.length > 0 && (
                    <div className="mt-6 space-y-4">
                      {service.points.map((point, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <CheckCircle 
                            className="h-5 w-5 flex-shrink-0 mt-1"
                            style={{ color: service.color }}
                          />
                          <p className="text-sm text-white/70">{point}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
