import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Rocket, KeyRound, Sparkles } from "lucide-react";
import React from 'react';

const pillars = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "Technologie",
    description: "We gebruiken robuuste, state-of-the-art technologie om systemen te bouwen die krachtig en gemakkelijk te onderhouden zijn.",
    color: "#2B5EFF"
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Optimalisatie",
    description: "Prestaties zijn geen bijzaak. We ontwerpen vanaf dag één voor snelheid, efficiëntie en betrouwbaarheid.",
    color: "#566FFF"
  },
  {
    icon: <KeyRound className="h-8 w-8" />,
    title: "Vrijheid",
    description: "U krijgt de volledige eigendom van de code. Ons doel is om u te versterken, niet om u aan een dienst te binden.",
    color: "#A792FF"
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Innovatie",
    description: "We bouwen met een toekomstgerichte mentaliteit, zodat uw systemen aanpasbaar en klaar voor de toekomst zijn.",
    color: "#FFB8FA"
  }
];

export function AboutSection() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="absolute inset-0 z-0 overflow-hidden hidden lg:block">
        <svg
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-auto"
          width="1150"
          height="300"
          viewBox="0 0 1150 300"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2B5EFF" />
              <stop offset="33%" stopColor="#566FFF" />
              <stop offset="66%" stopColor="#A792FF" />
              <stop offset="100%" stopColor="#FFB8FA" />
            </linearGradient>
            <filter id="path-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M50 150 C 250 150, 300 50, 425 50 C 550 50, 600 250, 725 250 C 850 250, 900 150, 1100 150"
            stroke="url(#path-gradient)"
            strokeWidth="2"
            fill="none"
            className="animated-wavy-line opacity-50"
            style={{ filter: "url(#path-glow)" }}
          />
        </svg>
      </div>

      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Wij bouwen systemen die mens en technologie in harmonie laten samenwerken.
        </p>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Onze filosofie is gebouwd op vier kernpilaren. Ze vormen de basis van elk project dat we ondernemen en zorgen ervoor dat we niet alleen code leveren, maar ook vertrouwen en controle.
        </p>
      </div>
      <div className="relative mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar) => (
          <Card 
            key={pillar.title} 
            className="text-center transition-all hover:shadow-lg hover:-translate-y-1 bg-card/80 backdrop-blur-sm"
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
