"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen } from "lucide-react";
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
 * Integrated with a language switcher and localized links.
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
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 md:px-8 max-w-6xl">
        {/* Left: Logo */}
        <Link href={`/${lang}/`} className="font-bold text-3xl">
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        <div className="flex items-center gap-3">
          {/* Blog Access */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" asChild className="h-9 w-9 rounded-full">
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

          {/* Main CTA */}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href={`/${lang}/project-request/`}>{shareIdeaText}</Link>
          </Button>

          {/* Minimalistic Language Toggle - Moved to far right */}
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
