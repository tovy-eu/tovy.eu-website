
'use client';

import { useEffect, useRef } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { SectionHeader } from "./section-header";
import { Spotlight } from "../ui/spotlight";

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
    <section className="relative w-full min-h-screen flex flex-col justify-center py-20 overflow-hidden bg-background scroll-mt-16 md:scroll-mt-20">
      {/* Parallax Grid Background */}
      <div 
        ref={gridRef}
        className="parallax-grid-bg"
        style={{ willChange: 'transform' }}
      />

      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10 w-full">
        <SectionHeader 
          index="01"
          badge={dict.painSolution.title}
          title={dict.painSolution.subtitle}
          className="mb-10 sm:mb-14"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
          {/* Pain Section (The Old Way) */}
          <ScrollReveal delay="duration-700" className="flex">
            <div className="relative w-full p-5 md:p-8 rounded-3xl bg-card/60 border border-white/10 overflow-hidden group shadow-xl transition-all duration-500 hover:bg-card/70">
              <Spotlight color="rgba(239, 68, 68, 0.05)" />
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                }}
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-6 md:mb-8">
                  <h3 className="font-bold text-xl md:text-2xl tracking-tighter shrink-0 select-none flex items-center text-white/80">
                    {dict.painSolution.pain.title}
                  </h3>
                  <div className="h-5 w-px bg-white/20 mx-2" />
                  <h3 className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">
                    {dict.painSolution.pain.subtitle}
                  </h3>
                </div>

                <ul className="space-y-3 md:space-y-4">
                  {painItems.map((item: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <XCircle className="h-4 w-4 md:h-5 md:w-5 text-white/20 shrink-0 mt-0.5" />
                      <span className="text-[12px] md:text-[13px] lg:text-sm text-white/40 font-medium leading-relaxed tracking-tight">{item}</span>
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
              
              <div className="relative h-full w-full bg-card rounded-[calc(1.5rem-1px)] p-5 md:p-8 flex flex-col transition-all duration-300 shadow-2xl border border-white/10 group-hover:border-transparent overflow-hidden">
                <Spotlight color="rgba(43, 94, 255, 0.15)" />
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                  style={{
                    background: 'radial-gradient(ellipse 70% 80% at 110% 50%, rgba(43,94,255,0.35), hsla(0,0%,100%,0))'
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6 md:mb-8">
                    <div className="font-bold text-xl md:text-2xl tracking-tighter shrink-0 select-none flex items-center transition-transform duration-300 group-hover:scale-110">
                      <span className="text-white">TOV</span>
                      <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
                    </div>
                    <div className="h-5 w-px bg-white/20 mx-2" />
                    <h3 className="text-[9px] md:text-[10px] font-black text-primary drop-shadow-[0_0_8px_rgba(43,94,255,0.4)] uppercase tracking-[0.4em]">
                      {dict.painSolution.solution.subtitle}
                    </h3>
                  </div>

                  <ul className="space-y-3 md:space-y-4">
                    {solutionItems.map((item: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 group/item">
                        <CheckCircle2 
                          className="h-4 w-4 md:h-5 md:w-5 shrink-0 mt-0.5 transition-colors duration-300 text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.4)]" 
                        />
                        <span className="text-[12px] md:text-[13px] lg:text-sm text-white leading-relaxed font-semibold tracking-tight">
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
