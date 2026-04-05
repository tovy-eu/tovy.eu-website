
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";

interface LanguageSwitcherProps {
  currentLang: string;
}

const GBFlag = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 60 30" 
    className="w-5 h-auto rounded-[1px] shadow-sm"
    aria-hidden="true"
    role="img"
  >
    <path d="M0,0 v30 h60 v-30 z" fill="#012169"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6"/>
    <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10"/>
    <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6"/>
  </svg>
);

const NLFlag = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 3 2" 
    className="w-5 h-auto rounded-[1px] shadow-sm"
    aria-hidden="true"
    role="img"
  >
    <rect width="3" height="2" fill="#21468B"/>
    <rect width="3" height="1.333" fill="#fff"/>
    <rect width="3" height="0.666" fill="#AE1C28"/>
  </svg>
);

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    
    const segments = pathname.split("/");
    const targetLang = currentLang === "en" ? "nl" : "en";

    trackEvent({
      name: 'language_switched',
      event_category: 'engagement',
      event_label: 'Language Toggle',
      target_language: targetLang,
      source_language: currentLang,
      is_language_switch: true
    });
    
    if (segments[1] === "en" || segments[1] === "nl") {
      segments[1] = targetLang;
    } else {
      segments.splice(1, 0, targetLang);
    }
    
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  const targetLangName = currentLang === "en" ? "Dutch" : "English";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-11 px-3 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 overflow-hidden border-none"
      aria-label={`Switch to ${targetLangName}`}
    >
      {currentLang === "en" ? <GBFlag /> : <NLFlag />}
      <span className="sr-only">Switch to {targetLangName}</span>
    </Button>
  );
}
