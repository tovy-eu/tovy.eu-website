"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
          : "bg-transparent"
      )}
    >
      <div className="flex h-16 w-full items-center justify-between px-6">
        {/* Left: Logo */}
        <Link href="/" className="font-bold text-lg">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">Y</span>
        </Link>

        {/* Right: CTA Button */}
        <Button asChild>
          <Link href="/project-request">Start Project</Link>
        </Button>
      </div>
    </header>
  );
}
