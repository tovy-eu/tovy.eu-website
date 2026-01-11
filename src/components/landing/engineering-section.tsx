
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudCog, CodeXml, DatabaseZap } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";

const serviceLines = [
  {
    id: "cloud_infrastructure",
    title: "Azure Cloud Infrastructure",
    priority: "Foundation",
    icon: <CloudCog className="h-8 w-8 text-primary" />,
    description: "Designing secure, cost-optimized cloud environments for data workloads.",
    stack: [
      { tool: "Azure Data Factory", context: "Orchestration" },
      { tool: "Azure Synapse/SQL DB", context: "Warehousing" },
      { tool: "Azure Blob/ADLS", context: "Data Lake Storage" },
    ],
  },
  {
    id: "data_engineering",
    title: "Data Engineering & Analytics",
    priority: "Primary",
    icon: <DatabaseZap className="h-8 w-8 text-primary" />,
    description: "Architecting scalable pipelines and data warehouses using the Modern Data Stack.",
    stack: [
      { tool: "Databricks", context: "Lakehouse architecture, Spark processing" },
      { tool: "dbt", context: "Transformation, testing, documentation" },
      { tool: "SQL / SSMS", context: "Legacy integration, complex querying" },
      { tool: "Python", context: "Orchestration, custom ETL scripting" },
    ],
  },
  {
    id: "application_development",
    title: "Full-Stack Data Applications",
    priority: "Differentiator",
    icon: <CodeXml className="h-8 w-8 text-primary" />,
    description: "Building custom interfaces and internal tools to operationalize data.",
    stack: [
      { tool: "TypeScript / JavaScript", context: "Frontend logic, Node.js backends" },
      { tool: "Web & App Dev", context: "Custom dashboards, internal tooling" },
      { tool: "API Integration", context: "Serving data models to external systems" },
    ],
  },
];

export function EngineeringSection() {
  return (
    <section 
      className="w-full py-16 sm:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
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

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {serviceLines.map((service, index) => (
            <ScrollReveal key={service.id} delay={`duration-${300 + index * 200}`}>
              <Card className="h-full flex flex-col bg-card/80 backdrop-blur-sm hover:border-primary/50 transition-colors duration-300 hover:-translate-y-1">
                <CardHeader className="items-center text-center">
                  <div className="p-3 rounded-full bg-primary/10 mb-2">
                    {service.icon}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                  <CardDescription className="px-4">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-end">
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
