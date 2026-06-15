"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { WavyLines } from "./wavy-lines";
import { ScrollIndicator } from "./scroll-indicator";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/get-dictionary";
import { CONFIG } from "@/lib/config";
import { Magnetic } from "@/components/ui/magnetic";
import { TrustedBySection } from "./logo-banner";

export function HeroSection({ dict }: { dict: Dictionary }) {
  const [isMounted, setIsMounted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const pathname = usePathname();
  const lang = pathname?.split("/")[1] || "en";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    const handleMouseMove = (e: MouseEvent) => {
      // Only track mouse on devices with a fine pointer (desktop Safari)
      if (window.matchMedia("(pointer: fine)").matches) {
        setMousePos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <section
      className="relative w-full flex flex-col items-center justify-center min-h-screen text-center overflow-hidden transform-gpu"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))",
      }}
    >
      {/* Noise Grain Overlay - Reduced opacity for Safari mobile performance */}
      <div
        className="absolute inset-0 z-[1] opacity-[0.015] md:opacity-[0.03] pointer-events-none transform-gpu"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Interactive Luminous Cursor Beam - Animating x/y instead of left/top to prevent CLS */}
      <motion.div
        className="absolute left-1/2 top-1/2 w-[800px] md:w-[1200px] h-[500px] md:h-[800px] bg-primary/10 blur-[100px] md:blur-[140px] rounded-full pointer-events-none z-0 transform-gpu"
        animate={{
          x: `calc(${mousePos.x}% - 50%)`,
          y: `calc(${mousePos.y}% - 50%)`,
        }}
        initial={{ x: "-50%", y: "-50%" }}
        transition={{
          type: "spring",
          damping: 50,
          stiffness: 20,
          restDelta: 0.001,
        }}
        style={{ backfaceVisibility: "hidden" }}
      />

      <WavyLines />

      <div
        className={cn(
          "transition-all ease-in-out duration-1000 delay-300 z-10 max-w-[90rem] flex flex-col items-center justify-center px-6 md:px-12 pt-20 pb-8 md:pt-24 md:pb-12 transform-gpu",
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
        )}
        style={{ backfaceVisibility: "hidden" }}
      >
        <h1
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.5rem] 2xl:text-[6rem] leading-[1.05] md:leading-[1] tracking-[-0.03em] relative mb-4 md:mb-6 text-white"
          style={{ textShadow: "0 0 40px rgba(255, 255, 255, 0.1)" }}
        >
          {dict.pages.home.hero.title}
        </h1>

        <p className="text-sm md:text-base lg:text-lg leading-relaxed text-white/70 max-w-xs md:max-w-3xl mx-auto font-medium balance px-4 mb-8 md:mb-12">
          {dict.pages.home.hero.subtitle}
        </p>

        {/* Logos moved between subtitle and CTA */}
        <div className="w-full mb-10 md:mb-16 transform-gpu">
          <TrustedBySection className="py-0" dict={dict} />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6 w-full sm:w-auto">
          <Magnetic strength={0.1} className="w-full sm:w-auto">
            <Button
              asChild
              size="lg"
              className="group/cta w-[85%] sm:w-auto font-bold text-sm md:text-base h-12 md:h-14 px-8 md:px-12 rounded-full shadow-[0_0_40px_rgba(43,94,255,0.3)] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 border-none relative overflow-hidden transform-gpu"
            >
              <Link href={`/${lang}/project-request/`}>
                <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                <span className="relative flex items-center">
                  {dict.global.common.workWithUs}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/cta:translate-x-1" />
                </span>
              </Link>
            </Button>
          </Magnetic>

          {CONFIG.enableBlog && (
            <Button
              asChild
              size="lg"
              variant="outline"
              className="w-[85%] sm:w-auto font-bold text-sm md:text-base bg-white/[0.02] text-white/80 border-white/10 hover:bg-white/[0.06] hover:border-white/20 h-12 md:h-14 px-8 md:px-12 rounded-full transition-all duration-500 backdrop-blur-md transform-gpu"
            >
              <Link href={`/${lang}/kx/`}>
                <BookOpen className="mr-2 h-4 w-4 md:h-5 md:w-5 text-blue-400/60" />
                {dict.global.common.readBlog}
              </Link>
            </Button>
          )}
        </div>
      </div>

      <ScrollIndicator label={dict.global.common.scroll} />
    </section>
  );
}
