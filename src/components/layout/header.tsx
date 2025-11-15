"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background"
      )}
    >
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8 max-w-6xl">
        {/* Left: Logo */}
        <Link href="/" className="font-bold text-3xl">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">Y</span>
        </Link>
        
        <nav className="hidden md:flex gap-6 items-center">
            <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Blog
            </Link>
        </nav>

        {/* Right: CTA Button */}
        <Button asChild>
          <Link href="/project-request">Share your idea</Link>
        </Button>
      </div>
      <div 
        className="h-px w-full" 
        style={{
          background: 'linear-gradient(to right, transparent, rgba(120, 120, 120, 0.2), transparent)'
        }}
      />
    </header>
  );
}
