
'use client';

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudCog, CodeXml, DatabaseZap, DraftingCompass, CheckCircle } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";
import { Spotlight } from "../ui/spotlight";

export function EngineeringSection({ dict }: { dict: Dictionary }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: fine)").matches) {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

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
      title: dict.pages.home.engineering.services.strategic.title,
      icon: <DraftingCompass />,
      description: dict.pages.home.engineering.services.strategic.desc,
      stack: dict.pages.home.engineering.services.strategic.tools?.map((tool: string) => ({ tool })) || [],
      color: "hsl(var(--brand-1))",
      className: "md:col-span-2",
    },
    {
      id: "cloud",
      title: dict.pages.home.engineering.services.cloud.title,
      icon: <CloudCog />,
      description: dict.pages.home.engineering.services.cloud.desc,
      stack: dict.pages.home.engineering.services.cloud.tools?.map((tool: string) => ({ tool })) || [],
      points: dict.pages.home.engineering.services.cloud.points || [],
      color: "hsl(var(--brand-2))",
      className: "md:col-span-3",
    },
    {
      id: "data",
      title: dict.pages.home.engineering.services.data.title,
      icon: <DatabaseZap />,
      description: dict.pages.home.engineering.services.data.desc,
      stack: dict.pages.home.engineering.services.data.tools?.map((tool: string) => ({ tool })) || [],
      points: dict.pages.home.engineering.services.data.points || [],
      color: "hsl(var(--brand-3))",
      className: "md:col-span-3",
    },
    {
      id: "automation",
      title: dict.pages.home.engineering.services.automation.title,
      icon: <CodeXml />,
      description: dict.pages.home.engineering.services.automation.desc,
      stack: dict.pages.home.engineering.services.automation.tools?.map((tool: string) => ({ tool })) || [],
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
      {/* Interactive Luminous Cursor Beam */}
      <motion.div 
        className="absolute left-1/2 top-1/2 w-[800px] md:w-[1200px] h-[500px] md:h-[800px] bg-primary/10 blur-[100px] md:blur-[140px] rounded-full pointer-events-none z-0 transform-gpu"
        animate={{
          x: `calc(${mousePos.x}% - 50%)`,
          y: `calc(${mousePos.y}% - 50%)`,
        }}
        initial={{ x: '-50%', y: '-50%' }}
        transition={{ type: "spring", damping: 50, stiffness: 20, restDelta: 0.001 }}
        style={{ backfaceVisibility: 'hidden' }}
      />

      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ transform: 'translateZ(0)' }}
       
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10 w-full">
        <SectionHeader 
          index="03"
          badge={dict.pages.home.engineering.section}
          title={dict.pages.home.engineering.title}
          description={dict.pages.home.engineering.subtitle}
          className="mb-16"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
          {serviceLines.map((service, index) => {
            const isLarge = index === 1 || index === 2;
            return (
              <ScrollReveal 
                key={service.id} 
                delay={getDelayClass(index)}
                className={cn(
                  "h-full", 
                  isLarge ? "md:col-span-3" : "md:col-span-2",
                  service.className
                )}
              >
                <div className="relative h-full w-full p-[1px] overflow-hidden rounded-2xl md:rounded-3xl group transition-all duration-500">
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                  />

                  <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1rem-1px)] md:rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent overflow-hidden">
                    <Spotlight color="rgba(43, 94, 255, 0.08)" size={400} />
                    
                    <div 
                      className="absolute top-0 right-0 text-7xl md:text-9xl font-black opacity-[0.15] md:opacity-30 select-none -translate-y-1/4 translate-x-1/4"
                      style={{ color: service.color }}
                    >
                      {index + 1}
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                      <div 
                        className="transition-colors"
                        style={{ color: service.color }}
                      >
                        {React.cloneElement(service.icon as React.ReactElement<{ className?: string }>, { className: "h-5 w-5" })}
                      </div>
                      <h3 className="text-[10px] md:text-[11px] font-bold text-white/90 uppercase tracking-[0.3em]">
                        {service.title}
                      </h3>
                    </div>

                    {service.stack && service.stack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6 md:mb-8 relative z-10">
                        {service.stack.map((item: { tool: string }) => (
                          <span 
                            key={item.tool} 
                            className="tool-tag text-[8px] md:text-[9px] font-bold tracking-[0.1em] md:tracking-[0.2em] uppercase px-2 py-0.5 md:py-1 rounded border border-white/5 bg-white/[0.03] text-white/55"
                            style={{ '--service-color': `var(--brand-${index + 1})` } as React.CSSProperties}
                          >
                            {item.tool}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className={cn("flex flex-col h-full relative z-10", isLarge && "md:grid md:grid-cols-5 md:gap-8")}>
                      <div className={cn(isLarge && "md:col-span-2")}>
                        <p className="text-sm md:text-base text-white/65 leading-relaxed font-medium tracking-tight mb-6 md:mb-8">
                          {service.description}
                        </p>
                      </div>

                      {service.points && service.points.length > 0 && (
                        <div className={cn(isLarge && "md:col-span-3", "space-y-3 md:space-y-4")}>
                          {service.points.map((point: string, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                              <CheckCircle
                                className="h-4 w-4 flex-shrink-0 mt-0.5 opacity-40"
                                style={{ color: service.color }}
                              />
                              <p className="text-xs md:text-[13px] text-white/65 leading-relaxed font-medium tracking-tight">{point}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
