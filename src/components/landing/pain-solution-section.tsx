'use client';

import { XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function PainSolutionSection({ dict }: { dict: Dictionary }) {
  const painItems = dict.painSolution.pain.items;
  const solutionItems = dict.painSolution.solution.items;

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <SectionHeader 
          badge={dict.painSolution.title}
          title={dict.painSolution.subtitle}
          className="mb-12 sm:mb-16"
          titleClassName="md:text-3xl lg:text-4xl"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Pain Section (The Old Way) */}
          <ScrollReveal delay="duration-700" className="flex">
            <div className="relative w-full p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group shadow-xl">
              {/* Reliable Inline Noise Texture Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white leading-none">{dict.painSolution.pain.title}</h3>
                    <p className="text-[10px] sm:text-sm text-muted-foreground/60 font-medium shrink-0">{dict.painSolution.pain.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-4 sm:space-y-6">
                  {painItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 sm:gap-4">
                      <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500/40 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm md:text-base text-muted-foreground/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Solution Section (The Tovy Way) */}
          <ScrollReveal delay="delay-[200ms] duration-700" className="flex">
            <div className="relative w-full p-6 sm:p-8 rounded-2xl bg-card/40 backdrop-blur-xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/5 group">
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  {/* Branded Logo Marker typographic signature */}
                  <div className="font-bold text-xl sm:text-2xl tracking-tighter shrink-0 select-none flex items-center">
                    <span>TOV</span>
                    <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p 
                      className="text-[10px] sm:text-sm font-medium opacity-80 mt-1 text-primary"
                    >
                      {dict.painSolution.solution.subtitle}
                    </p>
                  </div>
                </div>

                <ul className="space-y-4 sm:space-y-6">
                  {solutionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 sm:gap-4 group/item">
                      <CheckCircle2 
                        className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 mt-0.5 transition-colors duration-300 text-green-500" 
                      />
                      <span className="text-xs sm:text-sm md:text-base text-foreground leading-relaxed font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
