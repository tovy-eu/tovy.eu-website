
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Rocket, Sparkles } from "lucide-react";
import React from 'react';
import { ScrollReveal } from "../scroll-reveal";

const pillars = [
  {
    icon: <BrainCircuit className="h-8 w-8" />,
    title: "Technology",
    description: "We love tech, data and AI. We are up-to-date with the rapid changes in the industry.",
    color: "#2B5EFF"
  },
  {
    icon: <Rocket className="h-8 w-8" />,
    title: "Optimization",
    description: "Every process design aims for efficiency and automation. We target removal of tedious, inefficient tasks.",
    color: "#566FFF"
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-8 w-8"
      >
        <path d="M12 22a2 2 0 0 0 4 0c0-1.1.9-2 2-2s2 .9 2 2a2 2 0 0 0 4 0" />
        <path d="M14 18.3c0-1.7 1.3-3.1 3-3.1h.5c1.4 0 2.5-1.1 2.5-2.5v-.5c0-1.4-1.1-2.5-2.5-2.5h-3.5c-1.4 0-2.5-1.1-2.5-2.5v-.5C11.5 5.6 10.4 4.5 9 4.5H8.5c-1.4 0-2.5-1.1-2.5-2.5V1" />
        <path d="M14 12a2 2 0 0 0-2-2H4.5C3.1 10 2 11.1 2 12.5v.5C2 14.4 3.6 16 5.5 16H8" />
        <path d="m14 8 3-3-3-3" />
      </svg>
    ),
    title: "Freedom",
    description: "Our solutions are built to reduce cognitive load. We free up people's time to think, innovate, and grow.",
    color: "#A792FF"
  },
  {
    icon: <Sparkles className="h-8 w-8" />,
    title: "Innovation",
    description: "We design adaptable, future-ready systems that evolve with your business.",
    color: "#FFB8FA"
  }
];

export function AboutSection() {
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
              d="M50 400 C 250 400 300 300 425 300 C 550 300 600 500 725 500 C 850 500 900 400 1100 400"
              stroke="url(#path-gradient)"
              strokeWidth="2"
              fill="none"
              className="animated-wavy-line opacity-50"
              style={{ filter: "url(#path-glow)" }}
            />
          </svg>
        </div>
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              Tovy Strategy
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              What and why we do this.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center mt-12">
            <p className="text-lg leading-8 text-foreground/80">
              Our mission is to build smart data ecosystems that take work off your hands. We desire a world where technology gives people more time, focus, and freedom to grow.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              Our Pillars of Success
            </h3>
          </div>
        </ScrollReveal>
        
        <ScrollReveal>
          <div className="relative mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
      </div>
    </section>
  );
}
