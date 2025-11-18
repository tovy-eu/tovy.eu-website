"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-background/90 backdrop-blur-lg"
      )}
    >
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8 max-w-6xl">
        {/* Left: Logo */}
        <Link href="/" className="font-bold text-3xl">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/blog">
                    <BookOpen className="h-5 w-5" />
                    <span className="sr-only">Blog</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Right: CTA Button */}
          <Button asChild>
            <Link href="/project-request">Share your idea</Link>
          </Button>
        </div>
      </div>
      <div 
        className="h-px w-full" 
        style={{
          background: 'linear-gradient(to right, transparent, hsl(var(--border)), transparent)'
        }}
      />
    </header>
  );
}
