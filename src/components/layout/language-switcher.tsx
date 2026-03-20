"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLang: string;
}

const GBFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className="w-5 h-auto rounded-[1px] shadow-sm">
    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const NLFlag = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2" className="w-5 h-auto rounded-[1px] shadow-sm">
    <rect width="3" height="2" fill="#21468B"/>
    <rect width="3" height="1.333" fill="#fff"/>
    <rect width="3" height="0.666" fill="#AE1C28"/>
  </svg>
);

/**
 * A minimalistic language switcher component using flags.
 * Updated with a larger hit area (h-11 = 44px) for better mobile accessibility.
 * Now includes analytics tracking for language switching.
 */
export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    
    const segments = pathname.split("/");
    const targetLang = currentLang === "en" ? "nl" : "en";

    // Analytics tracking for language switch
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'language_switched', {
        event_category: 'engagement',
        event_label: 'Language Toggle',
        target_language: targetLang,
        source_language: currentLang
      });
    }
    
    // Replace the language segment (e.g., /en/blog -> /nl/blog)
    if (segments[1] === "en" || segments[1] === "nl") {
      segments[1] = targetLang;
    } else {
      // Prepend the language if it's missing (fallback)
      segments.splice(1, 0, targetLang);
    }
    
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-11 px-3 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 overflow-hidden border-none"
      aria-label={`Switch to ${currentLang === 'en' ? 'Dutch' : 'English'}`}
    >
      {currentLang === "en" ? <GBFlag /> : <NLFlag />}
      <span className="sr-only">{currentLang === "en" ? "English" : "Dutch"}</span>
    </Button>
  );
}
