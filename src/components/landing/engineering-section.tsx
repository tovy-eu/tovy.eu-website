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

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-24 sm:py-32"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <SectionHeader 
          badge={dict.engineering.strategy}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-20"
        />

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {serviceLines.map((service, index) => (
            <ScrollReveal 
              key={service.id} 
              delay={`delay-[${index * 100}ms] duration-700`}
              className={cn("h-full", service.className)}
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                {/* 120s Rotating Border */}
                <div className="absolute inset-[-1000%] animate-[spin_120s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--accent-gradient-stop))_50%,hsl(var(--primary))_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Content Container */}
                <div className="relative h-full w-full bg-card/60 backdrop-blur-2xl border border-white/10 rounded-[calc(1.5rem-1px)] p-8 md:p-10 flex flex-col transition-all duration-300 shadow-2xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div 
                      className="transition-colors"
                      style={{ color: service.color }}
                    >
                      {React.cloneElement(service.icon as React.ReactElement, { className: "h-6 w-6 md:h-7 md:w-7" })}
                    </div>
                    <h3 className="text-xs md:text-sm font-bold tracking-[0.2em] text-white uppercase">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-base md:text-lg text-white/90 leading-relaxed mb-8 flex-grow font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-4 mt-auto">
                    {service.stack.map(item => (
                      <span 
                        key={item.tool} 
                        className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] uppercase text-white/20"
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
