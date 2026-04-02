'use client';

import { Badge } from "@/components/ui/badge";
import { CloudCog, CodeXml, DatabaseZap, DraftingCompass } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function EngineeringSection({ dict }: { dict: Dictionary }) {
  const serviceLines = [
    {
      id: "strategic_design",
      title: dict.engineering.services.strategic.title,
      icon: <DraftingCompass />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-1))"
    },
    {
      id: "cloud_infrastructure",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-2))"
    },
    {
      id: "data_engineering",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-3))"
    },
    {
      id: "analytics_automation",
      title: dict.engineering.services.analytics.title,
      icon: <CodeXml />,
      description: dict.engineering.services.analytics.desc,
      stack: dict.engineering.services.analytics.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-4))"
    },
  ];

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-12 sm:py-16"
    >
      <div className="relative mx-auto max-w-5xl px-4 md:px-8">
        <SectionHeader 
          badge={dict.engineering.strategy}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-10"
          titleClassName="text-xl md:text-2xl"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {serviceLines.map((service, index) => (
            <ScrollReveal key={service.id} delay={`delay-[${index * 100}ms] duration-700`}>
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-lg group">
                {/* Ultra-Slow Rotating Border - 120s cycle for extreme minimalism */}
                <div className="absolute inset-[-1000%] animate-[spin_120s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,hsl(var(--primary))_0%,hsl(var(--accent-gradient-stop))_50%,hsl(var(--primary))_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Minimalist Glassy Content Container - Deep opaque background to keep inside clean */}
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl border border-white/5 rounded-[calc(var(--radius)-1px)] p-4 flex flex-col transition-all duration-300 group-hover:bg-card">
                  <div className="flex items-center gap-2 mb-2.5">
                    <div 
                      className="transition-colors"
                      style={{ color: service.color }}
                    >
                      {React.cloneElement(service.icon as React.ReactElement, { className: "h-4 w-4" })}
                    </div>
                    <h3 className="text-xs md:text-sm font-bold tracking-tight text-white uppercase">
                      {service.title}
                    </h3>
                  </div>
                  
                  <p className="text-xs md:text-sm text-white/90 leading-relaxed mb-4 flex-grow font-medium">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-1 mt-auto">
                    {service.stack.map(item => (
                      <span 
                        key={item.tool} 
                        className="text-[9px] font-bold tracking-widest uppercase text-white/30"
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
