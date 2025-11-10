"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-transparent"
      )}
    >
      <div className="container relative flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-bold text-lg text-primary transition-transform hover:scale-105">
          Tovy AI
        </Link>
        <Button asChild>
          <Link href="/project-request">Start Project</Link>
        </Button>
      </div>
    </header>
  );
}
