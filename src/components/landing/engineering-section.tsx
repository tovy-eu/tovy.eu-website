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
      { tool: "Azure Data Factory" },
      { tool: "Azure Synapse/SQL DB" },
      { tool: "Azure Blob/ADLS" },
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
      { tool: "SQL / SSMS" },
      { tool: "Python" },
    ],
    color: "#A792FF"
  },
  {
    id: "application_development",
    title: "Full-Stack Data Applications",
    icon: <CodeXml className="h-8 w-8" />,
    description: "Building custom interfaces and internal tools to operationalize data.",
    stack: [
      { tool: "TypeScript / JavaScript" },
      { tool: "Web & App Dev" },
      { tool: "API Integration" },
    ],
    color: "#FFB8FA"
  },
];

const WavyArrow = () => (
  <svg
    width="100%"
    height="100%"
    viewBox="0 0 100 40"
    preserveAspectRatio="none"
    xmlns="http://www.w3.org/2000/svg"
    className="opacity-60"
  >
    <defs>
      <linearGradient id="wavy-arrow-gradient" x1="0%" y1="50%" x2="100%" y2="50%">
        <stop offset="0%" stopColor="hsl(var(--primary))" />
        <stop offset="100%" stopColor="hsl(var(--accent-gradient-stop))" />
      </linearGradient>
      <marker
        id="wavy-arrowhead"
        markerWidth="10"
        markerHeight="7"
        refX="8"
        refY="3.5"
        orient="auto"
      >
        <polygon points="0 0, 10 3.5, 0 7" fill="url(#wavy-arrow-gradient)" />
      </marker>
    </defs>
    <path
      d="M5 20 C 30 0 70 40 95 20"
      stroke="url(#wavy-arrow-gradient)"
      strokeWidth="2"
      fill="none"
      markerEnd="url(#wavy-arrowhead)"
    />
  </svg>
);


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
            <React.Fragment key={service.id}>
              <ScrollReveal delay={`duration-${300 + index * 200}`}>
                <Card 
                  className="h-full flex flex-col bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 text-center"
                  style={{ '--pillar-color': service.color, '--pillar-shadow-color': `${service.color}1A` } as React.CSSProperties}
                >
                  <CardHeader className="items-center">
                    <div 
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: `var(--pillar-shadow-color)`}}
                    >
                      {React.cloneElement(service.icon, { style: { color: `var(--pillar-color)` } })}
                    </div>
                    <CardTitle className="mt-4 min-h-[3.5rem] flex items-center justify-center">{service.title}</CardTitle>
                  </CardHeader>
                  <CardDescription className="p-6 pt-0 flex-grow h-24 flex items-center justify-center">
                    {service.description}
                  </CardDescription>
                  <CardContent className="flex flex-col justify-center items-center min-h-[5.5rem]">
                    <div className="flex flex-wrap justify-center gap-2">
                      {service.stack.map(item => (
                        <Badge key={item.tool} variant="secondary">{item.tool}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
              
              {index < serviceLines.length - 1 && (
                <div 
                  className="hidden lg:flex absolute top-1/2 -translate-y-1/2 items-center justify-center pointer-events-none z-10" 
                  style={{ left: `calc(${(index + 1) * 25}% - 3rem)`, width: '6rem', height: '3rem' }}
                >
                  <WavyArrow />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
