"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LanguageSwitcher from "./language-switcher";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/lib/get-dictionary";
import { CONFIG } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { Magnetic } from "@/components/ui/magnetic";

export default function Header({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const pathname = usePathname();
  const shareIdeaText = dict?.common.shareIdea || "Start Project";
  const blogText = dict?.navigation.blog || "KX Hub";
  const aboutText = dict?.navigation.about || "About";
  const servicesText = dict?.navigation.services || "Services";
  
  const homePath = `/${lang}/`;
  const isAtHome = pathname === homePath;

  const handleLogoClick = (e: React.MouseEvent) => {
    if (isAtHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      trackEvent({
        name: 'logo_home_refresh',
        event_category: 'navigation',
        event_label: 'Logo click at home',
        is_refresh: true
      });
    } else {
      trackEvent({
        name: 'logo_home_return',
        event_category: 'navigation',
        event_label: 'Logo click return home',
        from_path: pathname || ''
      });
    }
  };

  const handleCtaClick = () => {
    trackEvent({
      name: 'cta_click',
      event_category: 'engagement',
      event_label: 'Header CTA'
    });
  };

  const handleLinkClick = (label: string) => {
    trackEvent({
      name: 'read_blog_click',
      event_category: 'navigation',
      event_label: `Header ${label} Link`
    });
  };

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full backdrop-blur-xl border-b border-white/10 shadow-sm transition-all duration-300",
        "bg-gradient-to-b from-background via-background/90 to-background/60"
      )}
    >
      <div className="container mx-auto relative flex h-16 md:h-20 w-full items-center justify-between px-4 sm:px-6 md:px-8 max-w-6xl pt-[env(safe-area-inset-top,0.5rem)] md:pt-0">
        <Link 
          href={homePath} 
          onClick={handleLogoClick}
          className="font-bold text-2xl sm:text-3xl tracking-tight transition-transform hover:scale-105 active:scale-95 shrink-0 py-2 relative z-10"
        >
          <span>TOV</span>
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
        </Link>
        
        {/* Desktop Navigation - Mathematically Centered */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1 z-0">
          <Link 
            href={`${homePath}#about`} 
            className="text-sm font-bold text-white/60 hover:text-white transition-colors px-4 py-3 min-h-[44px] flex items-center"
            onClick={() => handleLinkClick("About")}
          >
            {aboutText}
          </Link>
          <Link 
            href={`${homePath}#services`} 
            className="text-sm font-bold text-white/60 hover:text-white transition-colors px-4 py-3 min-h-[44px] flex items-center"
            onClick={() => handleLinkClick("Services")}
          >
            {servicesText}
          </Link>
          {CONFIG.enableBlog && (
            <Link 
              href={`/${lang}/kx/`} 
              className="text-sm font-bold text-white/60 hover:text-white transition-colors px-4 py-3 min-h-[44px] flex items-center"
              onClick={() => handleLinkClick("KX Hub")}
            >
              {blogText}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 relative z-10">
          <Magnetic strength={0.2}>
            <Button asChild size="sm" className="h-9 md:h-10 px-4 md:px-6" onClick={handleCtaClick}>
              <Link href={`/${lang}/project-request/`}>
                <span className="font-bold text-sm">{shareIdeaText}</span>
              </Link>
            </Button>
          </Magnetic>

          <LanguageSwitcher currentLang={lang} />
        </div>
      </div>
    </header>
  );
}
