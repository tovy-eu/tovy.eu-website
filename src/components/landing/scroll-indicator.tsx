
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  label: string;
}

/**
 * A highly minimalistic scroll indicator.
 * Features a thin vertical line and subtle kinetic typography.
 * Automatically fades out as the user scrolls down.
 */
export function ScrollIndicator({ label }: ScrollIndicatorProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      // Fade out indicator after scrolling 60px
      if (window.scrollY > 60) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 transition-all duration-1000 ease-in-out z-20",
        isVisible ? "opacity-30 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white whitespace-nowrap">
        {label}
      </span>
      <div className="relative w-[1px] h-12 bg-white/10 overflow-hidden">
        {/* Subtle sliding light effect */}
        <div 
          className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-transparent via-primary to-transparent animate-scroll-line" 
        />
      </div>
    </div>
  );
}
