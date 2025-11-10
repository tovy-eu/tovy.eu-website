import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Zap, Bird, Lightbulb } from "lucide-react";
import React from 'react';

const pillars = [
  {
    icon: <Cpu className="h-8 w-8" />,
    title: "Technologie",
    description: "We gebruiken robuuste, state-of-the-art technologie om systemen te bouwen die krachtig en gemakkelijk te onderhouden zijn.",
    color: "#2B5EFF"
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Optimalisatie",
    description: "Prestaties zijn geen bijzaak. We ontwerpen vanaf dag één voor snelheid, efficiëntie en betrouwbaarheid.",
    color: "#566FFF"
  },
  {
    icon: <Bird className="h-8 w-8" />,
    title: "Vrijheid",
    description: "U krijgt de volledige eigendom van de code. Ons doel is om u te versterken, niet om u aan een dienst te binden.",
    color: "#A792FF"
  },
  {
    icon: <Lightbulb className="h-8 w-8" />,
    title: "Innovatie",
    description: "We bouwen met een toekomstgerichte mentaliteit, zodat uw systemen aanpasbaar en klaar voor de toekomst zijn.",
    color: "#8F668C"
  }
];

export function AboutSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Wij bouwen systemen die mens en technologie in harmonie laten samenwerken.
        </p>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Onze filosofie is gebouwd op vier kernpilaren. Ze vormen de basis van elk project dat we ondernemen en zorgen ervoor dat we niet alleen code leveren, maar ook vertrouwen en controle.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar) => (
          <Card 
            key={pillar.title} 
            className="text-center transition-all hover:shadow-lg hover:-translate-y-1"
            style={{ '--pillar-color': pillar.color, '--pillar-shadow-color': `${pillar.color}1A` } as React.CSSProperties}
          >
            <CardHeader className="items-center">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `var(--pillar-shadow-color)`}}
              >
                {React.cloneElement(pillar.icon, { style: { color: `var(--pillar-color)` } })}
              </div>
              <CardTitle className="mt-4">{pillar.title}</CardTitle>
            </CardHeader>
            <CardDescription className="p-6 pt-0">
              {pillar.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
