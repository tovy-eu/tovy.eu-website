'use client';

import { useEffect, useRef } from "react";
import { XCircle, CheckCircle2, AlertCircle } from "lucide-react";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";

export function PainSolutionSection({ dict }: { dict: Dictionary }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const painItems = dict.painSolution.pain.items;
  const solutionItems = dict.painSolution.solution.items;

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (gridRef.current) {
            const scrollY = window.scrollY;
            gridRef.current.style.transform = `translateY(${scrollY * 0.1}px) translateZ(0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative w-full py-20 sm:py-28 overflow-hidden bg-background">
      {/* Parallax Grid Background - Optimized with Ref */}
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ willChange: 'transform' }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <SectionHeader 
          badge={dict.painSolution.title}
          title={dict.painSolution.subtitle}
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Pain Section (The Old Way) */}
          <ScrollReveal delay="duration-700" className="flex">
            <div className="relative w-full p-5 sm:p-6 rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden group shadow-2xl">
              <div 
                className="absolute inset-0 opacity-[0.015] pointer-events-none" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-2 rounded-xl bg-red-500/20 text-red-300 ring-1 ring-red-500/30">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-base font-bold text-white leading-tight">{dict.painSolution.pain.title}</h3>
                    <p className="text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest">{dict.painSolution.pain.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {painItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground/80 leading-relaxed font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Solution Section (The Tovy Way) */}
          <ScrollReveal delay="delay-200 duration-700" className="flex">
            <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl group transition-all duration-500">
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" 
              />
              
              <div className="relative h-full w-full bg-card/80 backdrop-blur-2xl rounded-[calc(1.5rem-1px)] p-5 sm:p-6 flex flex-col transition-all duration-300 shadow-2xl border border-white/10 group-hover:border-transparent overflow-hidden">
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: 'radial-gradient(ellipse 70% 80% at 110% 50%, rgba(43,94,255,0.35), hsla(0,0%,100%,0))'
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <div className="font-bold text-xl tracking-tighter shrink-0 select-none flex items-center transition-transform duration-300 group-hover:scale-110">
                      <span className="text-white">TOV</span>
                      <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
                    </div>
                    <div className="h-4 w-px bg-white/20 mx-1" />
                    <h3 className="text-[9px] md:text-[10px] font-bold text-primary uppercase tracking-[0.2em] drop-shadow-[0_0_8px_rgba(43,94,255,0.4)]">
                      {dict.painSolution.solution.subtitle}
                    </h3>
                  </div>

                  <ul className="space-y-4">
                    {solutionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <CheckCircle2 
                          className="h-4 w-4 shrink-0 mt-0.5 transition-colors duration-300 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]" 
                        />
                        <span className="text-sm text-white leading-relaxed font-semibold">
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