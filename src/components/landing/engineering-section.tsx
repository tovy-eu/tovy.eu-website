'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <DraftingCompass className="h-6 w-6" />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-1))"
    },
    {
      id: "cloud_infrastructure",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog className="h-6 w-6" />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-2))"
    },
    {
      id: "data_engineering",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap className="h-6 w-6" />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-3))"
    },
    {
      id: "analytics_automation",
      title: dict.engineering.services.analytics.title,
      icon: <CodeXml className="h-6 w-6" />,
      description: dict.engineering.services.analytics.desc,
      stack: dict.engineering.services.analytics.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-4))"
    },
  ];

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-12 sm:py-20"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHeader 
          badge={dict.engineering.strategy}
          title={dict.engineering.title}
          description={dict.engineering.subtitle}
          className="mb-12"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {serviceLines.map((service, index) => (
            <ScrollReveal key={service.id} delay={`delay-[${index * 100}ms] duration-700`}>
              <Card 
                className="relative h-full flex flex-col bg-card/40 backdrop-blur-md border-white/5 shadow-sm transition-all duration-500 hover:bg-card/60 hover:border-white/10 hover:-translate-y-1 text-center overflow-hidden group border-none"
                style={{ '--pillar-color': service.color } as React.CSSProperties}
              >
                {/* Minimalist Shine */}
                <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none z-10" />

                <CardHeader className="items-center pb-2 pt-6">
                  <div 
                    className="p-3 rounded-xl bg-white/5 border border-white/5 transition-colors group-hover:bg-white/10"
                    style={{ color: `var(--pillar-color)` }}
                  >
                    {React.cloneElement(service.icon, { style: { color: `var(--pillar-color)` } })}
                  </div>
                  <CardTitle className="mt-4 text-base md:text-lg font-bold tracking-tight text-white/90">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow px-5 pb-6">
                  <CardDescription className="text-xs md:text-sm text-muted-foreground/80 leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </CardDescription>
                  <div className="flex flex-wrap justify-center gap-1.5">
                    {service.stack.map(item => (
                      <Badge 
                        key={item.tool} 
                        variant="secondary" 
                        className="bg-white/5 hover:bg-white/10 text-[9px] md:text-[10px] font-medium tracking-wide uppercase px-2 py-0 border-none text-muted-foreground"
                      >
                        {item.tool}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}