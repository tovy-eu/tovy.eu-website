"use client";

import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SpotlightProps {
  className?: string;
  color?: string;
  size?: number;
}

export const Spotlight = ({
  className,
  color = "rgba(43, 94, 255, 0.15)",
  size = 600,
}: SpotlightProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device is mobile/touch-based
    const checkMobile = () => {
      setIsMobile(!window.matchMedia("(pointer: fine)").matches);
    };
    
    checkMobile();
    
    const container = containerRef.current;
    if (!container || !window.matchMedia("(pointer: fine)").matches) return;

    const parent = container.parentElement;
    if (!parent) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      setPosition({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    };

    const handleMouseEnter = () => setOpacity(1);
    const handleMouseLeave = () => setOpacity(0);

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseenter", handleMouseEnter);
    parent.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseenter", handleMouseEnter);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // Return null on mobile to save performance and prevent rendering impulses
  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute -inset-px transition-opacity duration-300 z-0",
        className
      )}
      style={{
        opacity,
        background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color}, transparent 40%)`,
      }}
    />
  );
};
