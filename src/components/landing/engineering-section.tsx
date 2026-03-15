'use client';

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudCog, CodeXml, DatabaseZap, DraftingCompass } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";

const serviceLines = [
  {
    id: "strategic_design",
    title: "Strategic Design",
    icon: <DraftingCompass className="h-8 w-8" />,
    description: "Thinking through tech, data, and AI strategies to align with your business goals.",
    stack: [
      { tool: "Roadmapping" },
      { tool: "Architecture" },
      { tool: "Feasibility" },
    ],
    color: "#2B5EFF"
  },
  {
    id: "cloud_infrastructure",
    title: "Cloud Infrastructure",
    icon: <CloudCog className="h-8 w-8" />,
    description: "Designing secure, cost-optimized cloud environments for data workloads.",
    stack: [
      { tool: "Azure, GCP, AWS" },
      { tool: "Datawarehousing" },
    ],
    color: "#566FFF"
  },
  {
    id: "data_engineering",
    title: "Data Engineering",
    icon: <DatabaseZap className="h-8 w-8" />,
    description: "Architecting scalable pipelines and data warehouses using the Modern Data Stack.",
    stack: [
      { tool: "Databricks" },
      { tool: "dbt" },
      { tool: "SQL" },
      { tool: "Python" },
    ],
    color: "#A792FF"
  },
  {
    id: "analytics_automation",
    title: "Analytics & Automation",
    icon: <CodeXml className="h-8 w-8" />,
    description: "Building dashboarding or automations to operationalize data.",
    stack: [
      { tool: "TypeScript / JavaScript" },
    ],
    color: "#FFB8FA"
  },
];

export function EngineeringSection() {
  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/10 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              How We Engineer
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              End-to-End Data Ecosystems
            </h2>
            <p className="mt-4 text-lg leading-8 text-foreground/80">
              From raw ingestion in Azure to custom end-user applications.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {serviceLines.map((service, index) => (
            <ScrollReveal key={service.id} delay={`delay-[${index * 150}ms] duration-700`}>
              <Card 
                className="relative h-full flex flex-col bg-card border-white/10 shadow-xl transition-all duration-300 hover:-translate-y-2 text-center overflow-hidden group"
                style={{ '--pillar-color': service.color, '--pillar-shadow-color': `${service.color}1A` } as React.CSSProperties}
              >
                {/* Glass Reflection Shine */}
                <div className="absolute inset-0 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none z-10" />

                <CardHeader className="items-center z-0">
                  <div 
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: `var(--pillar-shadow-color)`}}
                  >
                    {React.cloneElement(service.icon, { style: { color: `var(--pillar-color)` } })}
                  </div>
                  <CardTitle className="mt-4 min-h-[3.5rem] flex items-center justify-center">{service.title}</CardTitle>
                </CardHeader>
                <CardDescription className="px-6 pb-4 flex-grow text-muted-foreground/90 flex items-center justify-center min-h-[5rem] z-0">
                  {service.description}
                </CardDescription>
                <CardContent className="flex flex-col justify-center items-center pb-6 z-0">
                  <div className="flex flex-wrap justify-center gap-2">
                    {service.stack.map(item => (
                      <Badge key={item.tool} variant="secondary">{item.tool}</Badge>
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
