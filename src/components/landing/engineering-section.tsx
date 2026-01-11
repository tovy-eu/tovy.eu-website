
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudCog, CodeXml, DatabaseZap, BrainCircuit } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";

const serviceLines = [
  {
    id: "strategic_design",
    title: "Strategic Design",
    icon: <BrainCircuit className="h-8 w-8" />,
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

export function EngineeringSection() {
  return (
    <section 
      className="pain-solution-container relative w-full bg-gradient-to-b from-background to-accent/10 py-16 sm:py-24"
    >
      <div className="relative mx-auto max-w-6xl px-4 md:px-8">
        <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
            <svg
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto"
              width="1150"
              height="600"
              viewBox="0 0 1150 600"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="eng-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2B5EFF" />
                  <stop offset="50%" stopColor="#566FFF" />
                  <stop offset="100%" stopColor="#A792FF" />
                </linearGradient>
                <filter id="eng-path-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path
                d="M50 200 C 250 200, 300 400, 425 400 C 550 400, 600 200, 725 200 C 850 200, 900 300, 1100 300"
                stroke="url(#eng-path-gradient)"
                strokeWidth="2"
                fill="none"
                className="animated-wavy-line opacity-50"
                style={{ filter: "url(#eng-path-glow)", animationDirection: 'reverse' }}
              />
            </svg>
        </div>
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

        <div className="relative mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-stretch">
          {serviceLines.map((service, index) => (
            <ScrollReveal key={service.id} delay={`duration-${300 + index * 200}`}>
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
                  <CardTitle className="mt-4">{service.title}</CardTitle>
                </CardHeader>
                <CardDescription className="p-6 pt-0 flex-grow">
                  {service.description}
                </CardDescription>
                <CardContent className="flex flex-col justify-end">
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
