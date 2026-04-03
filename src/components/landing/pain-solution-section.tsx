'use client';

import { XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function PainSolutionSection({ dict }: { dict: Dictionary }) {
  const painItems = dict.painSolution.pain.items;
  const solutionItems = dict.painSolution.solution.items;

  return (
    <section className="relative w-full py-24 sm:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <SectionHeader 
          badge={dict.painSolution.title}
          title={dict.painSolution.subtitle}
          className="mb-16 sm:mb-20"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-stretch">
          {/* Pain Section (The Old Way) */}
          <ScrollReveal delay="duration-700" className="flex">
            <div className="relative w-full p-8 sm:p-10 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden group shadow-2xl">
              {/* Ultra-subtle Noise Texture */}
              <div 
                className="absolute inset-0 opacity-[0.015] pointer-events-none" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-white leading-tight">{dict.painSolution.pain.title}</h3>
                    <p className="text-xs text-muted-foreground/50 font-medium uppercase tracking-widest">{dict.painSolution.pain.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-6">
                  {painItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <XCircle className="h-5 w-5 text-red-500/30 shrink-0 mt-0.5" />
                      <span className="text-sm md:text-base text-muted-foreground/70 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Solution Section (The Tovy Way) */}
          <ScrollReveal delay="delay-200 duration-700" className="flex">
            <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
              
              {/* Fluidity Gradient Layer (The "Border") */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_20s_linear_infinite]" 
              />
              
              {/* Inner Content Layer - Matches Engineering Section */}
              <div className="relative h-full w-full bg-card/95 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-8 sm:p-10 flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent">
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-8">
                    {/* Branded Logo Marker */}
                    <div className="font-bold text-2xl tracking-tighter shrink-0 select-none flex items-center transition-transform duration-300 group-hover:scale-110">
                      <span>TOV</span>
                      <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
                    </div>
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <h3 className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-[0.2em]">
                      {dict.painSolution.solution.subtitle || "Unified & Automated"}
                    </h3>
                  </div>

                  <ul className="space-y-6">
                    {solutionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-4 group/item">
                        <CheckCircle2 
                          className="h-5 w-5 shrink-0 mt-0.5 transition-colors duration-300 text-green-500" 
                        />
                        <span className="text-sm md:text-base text-foreground leading-relaxed font-medium">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
