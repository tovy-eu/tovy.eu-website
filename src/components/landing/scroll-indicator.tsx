
"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface ScrollIndicatorProps {
  label: string;
}

/**
 * A scroll indicator with a bouncing direction icon.
 * Features subtle kinetic typography and automatically fades out on scroll.
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
        "absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 transition-all duration-1000 ease-in-out z-20",
        isVisible ? "opacity-30 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <span className="text-[9px] font-bold tracking-[0.4em] uppercase text-white whitespace-nowrap mb-1">
        {label}
      </span>
      <ChevronDown className="h-6 w-6 text-white animate-bounce" strokeWidth={1.5} />
    </div>
  );
}
