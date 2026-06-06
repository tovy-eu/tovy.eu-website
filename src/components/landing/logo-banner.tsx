'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/lib/get-dictionary';

interface Logo {
  name: string;
  src: string;
}

interface LogoBannerProps {
  logos: Logo[];
  className?: string;
}

/**
 * LogoBanner Component
 * 
 * Displays logos in a sophisticated horizontal "liquid slide" animation.
 */
export const LogoBanner: React.FC<LogoBannerProps> = ({ logos, className }) => {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const groups: Logo[][] = [];
  const speed = 5000; // Animation interval in ms
  
  // Group logos into triplets
  for (let i = 0; i < logos.length; i += 3) {
    groups.push(logos.slice(i, i + 3));
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMounted(true);
    }, 0);

    if (groups.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % groups.length);
    }, speed);

    return () => {
      clearTimeout(timeoutId);
      clearInterval(timer);
    };
  }, [groups.length, speed]);

  if (!mounted) return (
    <div className={cn("w-full pt-4 pb-2 flex justify-center items-center min-h-[60px]", className)} />
  );

  const currentGroup = groups[index] || [];

  return (
    <div 
      className={cn("w-full pt-4 md:pt-6 pb-2 flex flex-col justify-center items-center overflow-hidden", className)}
    >
      <div className="flex gap-4 sm:gap-12 md:gap-24 items-center justify-center w-full max-w-6xl relative px-4 md:px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: -15, filter: 'blur(8px)' }}
            transition={{ 
              duration: 0.7, 
              ease: [0.4, 0, 0.2, 1],
            }}
            className="flex gap-6 sm:gap-12 md:gap-24 items-center justify-center w-full transform-gpu"
          >
            {currentGroup.map((logo, i) => {
              const isFirstGroup = index === 0;
              return (
                <motion.div 
                  key={logo.name}
                  initial={isFirstGroup ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={isFirstGroup ? { duration: 0 } : { delay: i * 0.1 + 0.2 }}
                  className="relative h-[24px] sm:h-[32px] md:h-[36px] w-20 sm:w-32 md:w-40 flex items-center justify-center group"
                >
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={logo.src}
                      alt={`${logo.name} logo`}
                      fill
                      loading={isFirstGroup ? "eager" : "lazy"}
                      priority={isFirstGroup}
                      className={cn(
                        "object-contain transition-all duration-700 transform-gpu",
                        "grayscale invert opacity-80 mix-blend-screen brightness-125 contrast-125 group-hover:scale-110"
                      )}
                      style={{ 
                        filter: 'grayscale(1) invert(1) brightness(1.2) sepia(1) hue-rotate(185deg) saturate(1.5) opacity(0.6)',
                        WebkitFilter: 'grayscale(1) invert(1) brightness(1.2) sepia(1) hue-rotate(185deg) saturate(1.5) opacity(0.6)',
                        backfaceVisibility: 'hidden'
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Example Usage Component
export const TrustedBySection = ({ className, dict }: { className?: string; dict?: Dictionary }) => {
  const sampleLogos: Logo[] = [
    { name: "Deloitte", src: "/images/logos/deloitte.webp" },
    { name: "Rabobank", src: "/images/logos/rabobank.webp" },
    { name: "Coca-Cola", src: "/images/logos/cocacola.webp" },
    { name: "Ubisoft", src: "/images/logos/ubisoft.webp" },
    { name: "RS", src: "/images/logos/rs.webp" },
    { name: "LW", src: "/images/logos/lw.webp" },
  ];

  const titleText = dict?.common.priorExperience || "Prior Experience";

  return (
    <section className={cn("w-full px-2 md:px-4", className)}>
      <h2 className="text-center text-[7px] md:text-[8px] font-black uppercase tracking-[0.5em] md:tracking-[0.6em] text-white/40 mb-2 md:mb-4">
        {"// "}{titleText.toUpperCase().replace(/\s+/g, '_')}
      </h2>
      <LogoBanner logos={sampleLogos} className="py-0 min-h-[60px]" />
    </section>
  );
  };
