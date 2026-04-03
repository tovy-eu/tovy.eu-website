
"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollIndicatorProps {
  label: string;
}

/**
 * A subtle scroll indicator that guides users to explore more content below the fold.
 * Automatically fades out as the user scrolls down to maintain clarity.
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
        "absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 transition-all duration-700 ease-in-out z-20",
        isVisible ? "opacity-40 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/60 whitespace-nowrap">
        {label}
      </span>
      <div className="relative w-px h-16 bg-gradient-to-b from-primary via-primary/50 to-transparent overflow-hidden">
        {/* Animated scanning line effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-white/40 animate-[kitt-scan_2s_linear_infinite]" />
      </div>
      <ChevronDown className="h-4 w-4 text-primary animate-bounce mt-1" />
    </div>
  );
}
