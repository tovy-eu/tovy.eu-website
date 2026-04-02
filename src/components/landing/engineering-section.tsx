'use client';

import { CloudCog, CodeXml, DatabaseZap, DraftingCompass } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";

export function EngineeringSection({ dict }: { dict: Dictionary }) {
  const serviceLines = [
    {
      id: "strategic_design",
      title: dict.engineering.services.strategic.title,
      icon: <DraftingCompass />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-1))",
      className: "md:col-span-2" // Large Bento compartment
    },
    {
      id: "cloud_infrastructure",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-2))",
      className: "md:col-span-1" // Small Bento compartment
    },
    {
      id: "data_engineering",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-3))",
      className: "md:col-span-1" // Small Bento compartment
    },
    {
      id: "analytics_automation",
      title: dict.engineering.services.analytics.title,
      icon: <CodeXml />,
      description: dict.engineering.services.analytics.desc,
      stack: dict.engineering.services.analytics.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-4))",
      className: "md:col-span-2" // Large Bento compartment
    },
  ];

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeader 
          badge={dict.engineering.strategy}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-16"
          titleClassName="text-xl md:text-2xl"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {serviceLines.map((service, index) => (
            <ScrollReveal 
              key={service.id} 
              delay={`delay-[${index * 100}ms] duration-700`}
              className={cn("h-full", service.className)}
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-2xl group transition-all duration-500">
                {/* Ultra-Slow Rotating Border - 120s cycle */}
                <div className="absolute inset-[-1000%] animate-[spin_120s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--accent-gradient-stop))_50%,hsl(var(--primary))_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Minimalist Glassy Content Container */}
                <div className="relative h-full w-full bg-card/40 backdrop-blur-xl border border-white/10 rounded-[calc(1rem-1px)] p-6 md:p-8 flex flex-col transition-all duration-300 group-hover:bg-card/60 shadow-2xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div 
                      className="transition-colors"
                      style={{ color: service.color }}
                    >
                      {React.cloneElement(service.icon as React.ReactElement, { className: "h-5 w-5 md:h-6 md:w-6" })}
                    </div>
                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-white uppercase">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-sm md:text-base text-white/90 leading-relaxed mb-6 flex-grow font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {service.stack.map(item => (
                      <span 
                        key={item.tool} 
                        className="text-[9px] md:text-[10px] font-bold tracking-[0.2em] uppercase text-white/20"
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
