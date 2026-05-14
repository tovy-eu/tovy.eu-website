
'use client';

import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import Image from "next/image";
import { Briefcase, DraftingCompass, Link, MapPin, User, Zap, Rocket, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const pillars = [
    { 
      id: "tech",
      title: dict.about.pillars.tech.title,
      description: dict.about.pillars.tech.desc,
      icon: <ShieldCheck />,
      className: "md:col-span-1"
    },
    { 
      id: "optimization",
      title: dict.about.pillars.optimization.title,
      description: dict.about.pillars.optimization.desc,
      icon: <Zap />,
      className: "md:col-span-1"
    },
    { 
      id: "freedom",
      title: dict.about.pillars.freedom.title,
      description: dict.about.pillars.freedom.desc,
      icon: <User />,
      className: "md:col-span-1"
    },
    { 
      id: "innovation",
      title: dict.about.pillars.innovation.title,
      description: dict.about.pillars.innovation.desc,
      icon: <Rocket />,
      className: "md:col-span-1"
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

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Core Values Section */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ScrollReveal delay="0" className="sm:col-span-2">
              <div className="h-full rounded-3xl p-8 border bg-card/50 border-white/10">
                <h3 className="text-base font-bold text-white/90 leading-tight uppercase tracking-wider mb-6">
                  {dict.about.pillarsTitle}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {pillars.map((pillar, index) => (
                    <div key={pillar.id} className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <div className="text-primary">
                          {pillar.icon}
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
            </ScrollReveal>
          </div>

          {/* Founder Bio Section */}
          <div className="md:col-span-3">
            <ScrollReveal delay="200" className="h-full">
              <div className="relative h-full w-full p-8 overflow-hidden rounded-3xl group transition-all duration-500 border bg-card/50 border-white/10 flex flex-col">
                <div className="flex items-start gap-4 mb-6">
                  <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5 flex-shrink-0">
                    <div className="relative h-full w-full rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                      <Image
                        src="/images/people/ceo.webp"
                        alt={dict.about.ceo.name}
                        fill
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
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
