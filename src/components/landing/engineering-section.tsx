'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      icon: <DraftingCompass className="h-5 w-5" />,
      description: dict.engineering.services.strategic.desc,
      stack: dict.engineering.services.strategic.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-1))"
    },
    {
      id: "cloud_infrastructure",
      title: dict.engineering.services.cloud.title,
      icon: <CloudCog className="h-5 w-5" />,
      description: dict.engineering.services.cloud.desc,
      stack: dict.engineering.services.cloud.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-2))"
    },
    {
      id: "data_engineering",
      title: dict.engineering.services.data.title,
      icon: <DatabaseZap className="h-5 w-5" />,
      description: dict.engineering.services.data.desc,
      stack: dict.engineering.services.data.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-3))"
    },
    {
      id: "analytics_automation",
      title: dict.engineering.services.analytics.title,
      icon: <CodeXml className="h-5 w-5" />,
      description: dict.engineering.services.analytics.desc,
      stack: dict.engineering.services.analytics.tools.map(tool => ({ tool })),
      color: "hsl(var(--brand-4))"
    },
  ];

  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/5 py-12 sm:py-16"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
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
              <Card 
                className="relative h-full flex flex-col bg-card/30 backdrop-blur-xl border-white/5 shadow-none transition-all duration-500 hover:bg-card/50 hover:border-white/10 group border-none"
                style={{ '--pillar-color': service.color } as React.CSSProperties}
              >
                <CardHeader className="items-start pb-2 pt-5 px-5">
                  <div 
                    className="p-2 rounded-lg bg-white/5 border border-white/5 transition-colors group-hover:bg-white/10"
                    style={{ color: `var(--pillar-color)` }}
                  >
                    {React.cloneElement(service.icon as React.ReactElement, { style: { color: `var(--pillar-color)` } })}
                  </div>
                  <CardTitle className="mt-3 text-sm md:text-base font-bold tracking-tight text-white/90">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow px-5 pb-5">
                  <p className="text-[11px] md:text-xs text-muted-foreground/70 leading-relaxed mb-4 flex-grow">
                    {service.description}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {service.stack.map(item => (
                      <Badge 
                        key={item.tool} 
                        variant="secondary" 
                        className="bg-white/5 hover:bg-white/10 text-[8px] md:text-[9px] font-medium tracking-wide uppercase px-1.5 py-0 border-none text-muted-foreground/60"
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
