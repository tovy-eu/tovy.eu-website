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
import { Menu, X } from "lucide-react";

export default function Header({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const shareIdeaText = dict?.global?.common?.shareIdea || "Request an Assessment";
  const blogText = dict?.global?.navigation?.blog || "Knowledge Hub";
  const aboutText = dict?.global?.navigation?.about || "About us";
  const servicesText = dict?.global?.navigation?.services || "Services";
  
  // Super robust homepage detection across trailing slashes, static servers, and index.html fallbacks
  const homePath = `/${lang}`;
  const isAtHome = 
    pathname === "/" ||
    pathname === "/index.html" ||
    pathname === homePath || 
    pathname === `${homePath}/` || 
    pathname === `${homePath}/index.html` || 
    pathname === `${homePath}/index`;

  // Determine if only the background bar of the header should be dissolved (hidden)
  const shouldDissolve = isAtHome && !scrolled;

  useEffect(() => {
    const handleScroll = () => {
      // Robust cross-browser scroll position check
      const scrollTop = window.scrollY !== undefined 
        ? window.scrollY 
        : (window.pageYOffset !== undefined ? window.pageYOffset : document.documentElement.scrollTop);
      
      // 10px scroll threshold registers immediate and sleek transitions
      const isScrolled = scrollTop > 10;
      setScrolled(isScrolled);
      
      // Synchronize iOS Safari status bar theme color behind clock and battery
      let themeMeta = document.querySelector('meta[name="theme-color"]');
      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMeta);
      }
      
      // Force iOS status bar to match your dark slate-blue background (#040815) in both states
      // because mobile header is now permanently visible on mobile devices
      themeMeta.setAttribute('content', '#040815');

      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const windowHeight = scrollHeight - clientHeight;
      const scrollPercentage = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0;
      setProgress(scrollPercentage);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAtHome]);

  const handleLogoClick = (e: React.MouseEvent) => {
    setMenuOpen(false);
    if (isAtHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        // Clean transparent parent (letting backdrop layer handle the visual background)
        "bg-transparent shadow-none border-none",
        // Slimmer Mobile Header Pacing & Standard Desktop Padding
        "pt-[max(0.5rem,env(safe-area-inset-top))] pb-1.5 md:pt-[max(1rem,env(safe-area-inset-top))] md:pb-3"
      )}
    >
      {/* Cinematic Backdrop Blur & Gradient Layer (Only this layer dissolves/appears based on scroll) */}
      <div 
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700 ease-out pointer-events-none",
          "bg-gradient-to-b from-background via-background/90 to-background/60 backdrop-blur-xl border-b border-white/10 shadow-sm",
          // Mobile: always visible (opacity-100)
          // Desktop (md): dynamically controlled by shouldDissolve (opacity-0 at top, opacity-100 on scroll)
          shouldDissolve ? "opacity-100 md:opacity-0" : "opacity-100 md:opacity-100"
        )}
      />

      {/* Sleek Bottom-only Progress Line - Placed directly on the edge of the 100% full-width header parent */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[1.5px] overflow-hidden transition-opacity duration-500 z-10"
        style={{ 
          opacity: progress > 0 ? 1 : 0,
          maskImage: 'linear-gradient(to right, transparent, black 1%, black 99%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 1%, black 99%, transparent)'
        }}
      >
        <div 
          className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Content Container (Logo, Navigation, CTA, Language Switcher - ALWAYS visible & interactive) */}
      <div 
        className="container mx-auto relative flex w-full items-center justify-between h-11 md:h-14 px-4 sm:px-6 max-w-7xl z-10"
      >
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
            <Button asChild size="sm" className="h-8 px-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/20" onClick={() => sendGA4Event("cta_clicked", { location: "header", text: shareIdeaText })}>
              <Link href={`/${lang}/project-request/`}>
                <span className="font-bold text-[9px] uppercase tracking-widest">{shareIdeaText}</span>
              </Link>
            </Button>
          </Magnetic>

          <div className="scale-90 origin-right">
            <LanguageSwitcher currentLang={lang} />
          </div>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMenuOpen(o => !o)}
            className="md:hidden h-9 w-9 p-0 rounded-full hover:bg-white/10 border-none"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {menuOpen && (
        <nav
          id="mobile-nav"
          className="md:hidden relative z-10 border-t border-white/10 bg-background/95 backdrop-blur-xl"
        >
          <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-3 flex flex-col">
            <Link
              href={`${homePath}#about`}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors py-3"
            >
              {aboutText}
            </Link>
            <Link
              href={`${homePath}#services`}
              onClick={() => setMenuOpen(false)}
              className="text-xs font-bold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors py-3"
            >
              {servicesText}
            </Link>
            {CONFIG.enableBlog && (
              <Link
                href={`/${lang}/kx/`}
                onClick={() => setMenuOpen(false)}
                className="text-xs font-bold uppercase tracking-[0.3em] text-white/70 hover:text-white transition-colors py-3"
              >
                {blogText}
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}