
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Plus } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dictionary } from "@/lib/get-dictionary";

/**
 * The primary navigation header for the application.
 * Optimized with larger touch targets for mobile accessibility.
 */
export default function Header({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const shareIdeaText = dict?.common.shareIdea || "Share your idea";
  const blogText = dict?.navigation.blog || "Blog";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-white/5"
      )}
    >
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-8 max-w-6xl">
        {/* Left: Logo */}
        <Link href={`/${lang}/`} className="font-bold text-2xl sm:text-3xl tracking-tight transition-transform hover:scale-105 active:scale-95">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Blog Access - Increased size to h-11 (44px) for touch targets */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="h-11 w-11 rounded-full hover:bg-white/10">
                  <Link href={`/${lang}/blog/`}>
                    <BookOpen className="h-5 w-5" />
                    <span className="sr-only">{blogText}</span>
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{blogText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Main CTA - Collapses to icon, sized at h-11 for touch targets */}
          <Button asChild size="sm" className="h-11 px-3 sm:px-5">
            <Link href={`/${lang}/project-request/`}>
              <Plus className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline font-semibold">{shareIdeaText}</span>
            </Link>
          </Button>

          {/* Minimalistic Language Toggle */}
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
