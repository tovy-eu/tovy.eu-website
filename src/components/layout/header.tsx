"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./language-switcher";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/get-dictionary";
import { CONFIG } from "@/lib/config";
import { Magnetic } from "@/components/ui/magnetic";
import { sendGA4Event } from "@/lib/tracking";

export default function Header({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const windowHeight = scrollHeight - clientHeight;
      const scrollPercentage = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0;
      setProgress(scrollPercentage);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const shareIdeaText = dict?.common.shareIdea || "Request an Assessment";
  const blogText = dict?.navigation.blog || "Knowledge Hub";
  const aboutText = dict?.navigation.about || "About us";
  const servicesText = dict?.navigation.services || "Services";
  
  const homePath = `/${lang}/`;
  const isAtHome = pathname === homePath;

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAtHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        // Mobile: Traditional Header Style (Visible only on small screens)
        "bg-gradient-to-b from-background via-background/90 to-background/60 backdrop-blur-xl border-b border-white/10 shadow-sm",
        // Desktop: Absolute Clean Reset (Transparent parent)
        "md:bg-none md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none",
        // Layout Pacing
        "pt-[max(1rem,env(safe-area-inset-top))] md:pt-[max(1.5rem,env(safe-area-inset-top))] md:py-6",
        scrolled ? "translate-y-0" : "translate-y-0 md:translate-y-2"
      )}
    >
      <div 
        className={cn(
          "container mx-auto relative flex w-full items-center justify-between transition-all duration-500",
          // Mobile Design (Full Width)
          "h-16 px-4 sm:px-6 max-w-none md:max-w-7xl",
          // Desktop Design (Floating Pill)
          "md:h-14 md:w-[92%] md:px-10 md:rounded-full transform-gpu md:backface-visibility-hidden",
          scrolled 
            ? "md:bg-background/90 md:backdrop-blur-2xl md:border md:border-white/10 md:shadow-2xl" 
            : "md:bg-transparent md:backdrop-blur-none md:border md:border-transparent md:shadow-none"
        )}
      >
        {/* Sleek Bottom-only Progress Line */}
        <div 
          className="absolute bottom-0 left-0 right-0 md:left-6 md:right-6 h-[1.5px] overflow-hidden md:rounded-full transition-opacity duration-500"
          style={{ 
            opacity: progress > 0 ? 1 : 0,
            maskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 5%, black 95%, transparent)'
          }}
        >
          <div 
            className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <Link 
          href={homePath} 
          onClick={handleLogoClick}
          className="font-bold text-xl md:text-2xl tracking-tight transition-transform hover:scale-105 active:scale-95 shrink-0 py-2 relative z-10"
        >
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        {/* Desktop Navigation - Hidden on Mobile */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-2 z-0">
          <Link 
            href={`${homePath}#about`} 
            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors px-4 py-3"
          >
            {aboutText}
          </Link>
          <Link 
            href={`${homePath}#services`} 
            className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors px-4 py-3"
          >
            {servicesText}
          </Link>
          {CONFIG.enableBlog && (
            <Link 
              href={`/${lang}/kx/`} 
              className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 hover:text-white transition-colors px-4 py-3"
            >
              {blogText}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-4 relative z-10">
          <Magnetic strength={0.1}>
            <Button asChild size="sm" className="h-8 md:h-8 px-4 md:px-5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/20" onClick={() => sendGA4Event("cta_clicked", { location: "header", text: shareIdeaText })}>
              <Link href={`/${lang}/project-request/`}>
                <span className="font-bold text-[9px] uppercase tracking-widest">{shareIdeaText}</span>
              </Link>
            </Button>
          </Magnetic>

          <div className="scale-90 md:scale-100 origin-right">
            <LanguageSwitcher currentLang={lang} />
          </div>
        </div>
      </div>
    </header>
  );
}
