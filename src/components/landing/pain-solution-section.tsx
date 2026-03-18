
'use client';

import { XCircle, CheckCircle2, AlertCircle, Zap } from "lucide-react";
import { ScrollReveal } from "../scroll-reveal";
import type { Dictionary } from "@/lib/get-dictionary";
import { cn } from "@/lib/utils";

export function PainSolutionSection({ dict }: { dict: Dictionary }) {
  const painItems = dict.painSolution.pain.items;
  const solutionItems = dict.painSolution.solution.items;

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-sm md:text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-wider">
              {dict.painSolution.title}
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              {dict.painSolution.subtitle}
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-stretch">
          {/* Pain Section (The Old Way) */}
          <ScrollReveal delay="duration-700" className="flex">
            <div className="relative w-full p-8 rounded-2xl bg-white/5 border border-white/5 overflow-hidden group">
              {/* Subtle Noise Texture Overlay */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{dict.painSolution.pain.title}</h3>
                    <p className="text-sm text-muted-foreground/60 font-medium">{dict.painSolution.pain.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-6">
                  {painItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <XCircle className="h-5 w-5 text-red-500/40 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground/80 leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ScrollReveal>

          {/* Solution Section (The Tovy Way) */}
          <ScrollReveal delay="delay-[200ms] duration-700" className="flex">
            <div className="relative w-full p-8 rounded-2xl bg-card/40 backdrop-blur-md border border-primary/20 overflow-hidden shadow-2xl shadow-primary/5 group">
              {/* Animated Light Beam */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent-gradient-stop/10 to-primary/10 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <Zap className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{dict.painSolution.solution.title}</h3>
                    <p className="text-sm text-primary/60 font-medium">{dict.painSolution.solution.subtitle}</p>
                  </div>
                </div>

                <ul className="space-y-6">
                  {solutionItems.map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-foreground leading-relaxed font-medium">{item}</span>
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
