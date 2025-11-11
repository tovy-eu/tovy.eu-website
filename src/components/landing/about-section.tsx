
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Rocket, KeyRound, Sparkles } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";

const pillars = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "Technology",
    description: "We love tech and are up-to-date with the rapid changes in the industry.",
    color: "#2B5EFF"
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Optimization",
    description: "We design systems to achieve milestones towards automation from day one. ",
    color: "#566FFF"
  },
  {
    icon: <KeyRound className="h-8 w-8" />,
    title: "Freedom",
    description: "Our baseline is that solutions should lower workload and boost productivity to the extend that employees find headspace.",
    color: "#A792FF"
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Innovation",
    description: "We build with a forward-thinking mindset, ensuring solutions are adaptable and future-ready.",
    color: "#FFB8FA"
  }
];

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24">
      <ScrollReveal className="relative mx-auto max-w-6xl px-4 md:px-8">
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
            We enable proces automation by building smart data eco-systems.
          </p>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            Our strategy is built on four core values. They are the foundation of every project we take on, ensuring we deliver not just code, but confidence and control.
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
      </ScrollReveal>
    </section>
  );
}
