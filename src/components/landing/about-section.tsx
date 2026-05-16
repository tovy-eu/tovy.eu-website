
'use client';

import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import Image from "next/image";
import { Briefcase, DraftingCompass, Link, MapPin, User, Zap, Rocket, ShieldCheck } from "lucide-react";
import React from 'react';

export function AboutSection({ dict }: { dict: Dictionary }) {
  const pillars = [
    { 
      id: "tech",
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      icon: <ShieldCheck />,
      color: "hsl(var(--brand-1))",
    },
    { 
      id: "optimization",
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      icon: <Zap />,
      color: "hsl(var(--brand-2))",
    },
    { 
      id: "freedom",
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      icon: <User />,
      color: "hsl(var(--brand-3))",
    },
    { 
      id: "innovation",
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      icon: <Rocket />,
      color: "hsl(var(--brand-4))",
    },
  ];

  const ceoInfo = [
    { icon: <Briefcase size={14} />, text: dict.about.ceo.role },
    { icon: <DraftingCompass size={14} />, text: dict.about.ceo.specialization },
    { icon: <MapPin size={14} />, text: dict.about.ceo.location },
  ];

  return (
    <section id="about" className="relative w-full bg-background py-24 sm:py-32 scroll-mt-16 md:scroll-mt-20">
      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10 w-full">
        <SectionHeader 
          badge={dict.about.section}
          title={dict.about.title}
          description={dict.about.mission}
          className="mb-16"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Core Values Section */}
          <div className="md:col-span-1 grid grid-cols-1">
            <ScrollReveal delay="0" className="h-full">
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                />
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-8 border border-white/5 group-hover:border-transparent">
                  <h3 className="text-base font-bold text-white/90 leading-tight uppercase tracking-wider mb-6">
                    {dict.about.pillarsTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                    {pillars.map((pillar) => (
                      <div key={pillar.id} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div style={{ color: pillar.color }}>
                            {React.cloneElement(pillar.icon, { className: "h-5 w-5" })}
                          </div>
                          <h4 className="text-sm font-bold text-white/90 leading-tight uppercase tracking-wider">
                            {pillar.title}
                          </h4>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                          {pillar.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Founder Bio Section */}
          <div className="md:col-span-1">
            <ScrollReveal delay="200" className="h-full">
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
                />
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-8 flex flex-col border border-white/5 group-hover:border-transparent">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5 flex-shrink-0">
                      <div className="relative h-full w-full rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="/images/people/ceo.webp"
                          alt={`${dict.about.ceo.name}, ${dict.about.ceo.role}`}
                          width={80}
                          height={80}
                          className="object-cover object-center"
                          priority
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-2">
                        {dict.about.ceo.name}
                      </h3>
                      <div className="flex flex-col gap-1.5">
                        {ceoInfo.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-primary/80">
                            {item.icon}
                            <span className="text-xs text-muted-foreground font-medium">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/80 leading-relaxed font-medium mb-6">
                    {dict.about.ceo.bio}
                  </p>

                  <div className="mt-auto">
                    <a 
                      href={dict.about.ceo.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary font-bold group"
                    >
                      <Link size={16} />
                      <span className="group-hover:underline">
                        Connect on LinkedIn
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
