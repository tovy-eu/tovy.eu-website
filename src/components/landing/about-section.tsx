
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import Image from "next/image";
import { Briefcase, DraftingCompass, Link, MapPin, User, Zap, Rocket, ShieldCheck } from "lucide-react";
import React from 'react';
import { Spotlight } from "../ui/spotlight";

export function AboutSection({ dict }: { dict: Dictionary }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (window.matchMedia("(pointer: fine)").matches) {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const pillars = [
    { 
      id: "tech",
      title: dict.pages.home.about.pillars.tech.title,
      description: dict.pages.home.about.pillars.tech.desc,
      icon: <ShieldCheck />,
      color: "hsl(var(--brand-1))",
    },
    { 
      id: "optimization",
      title: dict.pages.home.about.pillars.optimization.title,
      description: dict.pages.home.about.pillars.optimization.desc,
      icon: <Zap />,
      color: "hsl(var(--brand-2))",
    },
    { 
      id: "freedom",
      title: dict.pages.home.about.pillars.freedom.title,
      description: dict.pages.home.about.pillars.freedom.desc,
      icon: <User />,
      color: "hsl(var(--brand-3))",
    },
    { 
      id: "innovation",
      title: dict.pages.home.about.pillars.innovation.title,
      description: dict.pages.home.about.pillars.innovation.desc,
      icon: <Rocket />,
      color: "hsl(var(--brand-4))",
    },
  ];

  const ceoInfo = [
    { icon: <Briefcase size={14} />, text: dict.pages.home.about.ceo.role },
    { icon: <DraftingCompass size={14} />, text: dict.pages.home.about.ceo.specialization },
    { icon: <MapPin size={14} />, text: dict.pages.home.about.ceo.location },
  ];

  return (
    <section id="about" className="relative w-full bg-background py-24 sm:py-32 scroll-mt-16 md:scroll-mt-20 overflow-hidden">
      {/* Interactive Luminous Cursor Beam */}
      <motion.div 
        className="absolute left-1/2 top-1/2 w-[800px] md:w-[1200px] h-[500px] md:h-[800px] bg-primary/10 blur-[100px] md:blur-[140px] rounded-full pointer-events-none z-0 transform-gpu"
        animate={{
          x: `calc(${mousePos.x}% - 50%)`,
          y: `calc(${mousePos.y}% - 50%)`,
        }}
        initial={{ x: '-50%', y: '-50%' }}
        transition={{ type: "spring", damping: 50, stiffness: 20, restDelta: 0.001 }}
        style={{ backfaceVisibility: 'hidden' }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-8 z-10 w-full">
        <SectionHeader 
          index="02"
          badge={dict.pages.home.about.section}
          title={dict.pages.home.about.title}
          description={dict.pages.home.about.mission}
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
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 border border-white/5 group-hover:border-transparent overflow-hidden">
                  <Spotlight color="rgba(43, 94, 255, 0.15)" />
                  <h3 className="text-[10px] font-bold text-white/55 leading-tight uppercase tracking-[0.3em] mb-6 md:mb-8">
                    {dict.pages.home.about.pillarsTitle}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-y-8">
                    {pillars.map((pillar) => (
                      <div key={pillar.id} className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                          <div style={{ color: pillar.color }}>
                            {React.cloneElement(pillar.icon, { className: "h-5 w-5" })}
                          </div>
                          <h4 className="text-[11px] font-bold text-white/90 leading-tight uppercase tracking-wider">
                            {pillar.title}
                          </h4>
                        </div>
                        <p className="text-[13px] text-white/65 leading-relaxed font-medium tracking-tight">
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
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] p-6 md:p-8 flex flex-col border border-white/5 group-hover:border-transparent overflow-hidden">
                  <Spotlight color="rgba(43, 94, 255, 0.1)" />
                  <div className="flex items-start gap-4 mb-6 md:mb-8">
                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white/10 p-1 bg-white/5 flex-shrink-0">
                      <div className="relative h-full w-full rounded-xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                        <Image
                          src="/images/people/ceo.webp"
                          alt={`${dict.pages.home.about.ceo.name}, ${dict.pages.home.about.ceo.role}`}
                          width={80}
                          height={80}
                          className="object-cover object-center"
                          priority
                        />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white tracking-tight leading-none mb-3">
                        {dict.pages.home.about.ceo.name}
                      </h3>
                      <div className="flex flex-col gap-2">
                        {ceoInfo.map((item, index) => (
                          <div key={index} className="flex items-center gap-2 text-white/55">
                            {React.cloneElement(item.icon as React.ReactElement<{ size: number }>, { size: 12 })}
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-base text-white/65 leading-relaxed font-medium tracking-tight mb-8">
                    {dict.pages.home.about.ceo.bio}
                  </p>

                  <div className="mt-auto">
                    <a 
                      href={dict.pages.home.about.ceo.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary group"
                    >
                      <Link size={14} />
                      <span className="group-hover:underline">
                        {dict.global.common.linkedinProfile || "LinkedIn Profile"}
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
