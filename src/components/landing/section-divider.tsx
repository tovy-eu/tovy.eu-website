"use client";

import { useRef, useEffect, useState } from "react";

/**
 * A 1px gradient divider line with a subtle cursor-tracking glow.
 * No extra DOM nodes — just a single div with a dynamic radial highlight.
 */
export function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(-1);

  useEffect(() => {
    // ponytail: skip on touch devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setX(((e.clientX - rect.left) / rect.width) * 100);
    };
    const onLeave = () => setX(-1);

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  const bg =
    x >= 0
      ? `radial-gradient(ellipse 20% 100% at ${x}% 50%, hsl(226 100% 58% / 0.6), transparent), linear-gradient(to right, transparent, hsl(226 100% 58% / 0.15), hsl(264 60% 55% / 0.15), transparent)`
      : `linear-gradient(to right, transparent, hsl(226 100% 58% / 0.15), hsl(264 60% 55% / 0.15), transparent)`;

  return (
    <div
      ref={ref}
      className="w-full"
      style={{ height: "1px", background: bg, transition: "background 0.3s ease" }}
    />
  );
}
