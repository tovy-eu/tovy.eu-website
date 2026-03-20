"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, Plus } from "lucide-react";
import LanguageSwitcher from "./language-switcher";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dictionary } from "@/lib/get-dictionary";
import { CONFIG } from "@/lib/config";

export default function Header({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const pathname = usePathname();
  const shareIdeaText = dict?.common.shareIdea || "Share your idea";
  const blogText = dict?.navigation.blog || "Blog";
  
  const homePath = `/${lang}/`;
  const isAtHome = pathname === homePath;

  const handleLogoClick = (e: React.MouseEvent) => {
    // If already on the home page, scroll to top instead of navigating (prevents a new page view in GA)
    if (isAtHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'logo_home_refresh', {
          event_category: 'navigation',
          event_label: 'Logo click at home',
          is_refresh: true
        });
      }
    } else {
      // If navigating from another page, tag the event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'logo_home_return', {
          event_category: 'navigation',
          event_label: 'Logo click return home',
          from_path: pathname
        });
      }
    }
  };

  const handleCtaClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'cta_click', {
        event_category: 'engagement',
        event_label: 'Header CTA'
      });
    }
  };

  const handleBlogClick = () => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'read_blog_click', {
        event_category: 'engagement',
        event_label: 'Header Blog Link'
      });
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-white/5"
      )}
    >
      <div className="container mx-auto flex h-16 w-full items-center justify-between px-4 sm:px-6 md:px-8 max-w-6xl">
        {/* Left: Logo */}
        <Link 
          href={homePath} 
          onClick={handleLogoClick}
          className="font-bold text-2xl sm:text-3xl tracking-tight transition-transform hover:scale-105 active:scale-95"
        >
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        <div className="flex items-center gap-1 sm:gap-3">
          {/* Blog Access */}
          {CONFIG.enableBlog && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" asChild className="h-11 w-11 rounded-full hover:bg-white/10" onClick={handleBlogClick}>
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
          )}

          {/* Main CTA */}
          <Button asChild size="sm" className="h-11 px-3 sm:px-5" onClick={handleCtaClick}>
            <Link href={`/${lang}/project-request/`}>
              <Plus className="h-5 w-5 sm:hidden" />
              <span className="hidden sm:inline font-semibold">{shareIdeaText}</span>
            </Link>
          </Button>

          {/* Language Toggle */}
          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
