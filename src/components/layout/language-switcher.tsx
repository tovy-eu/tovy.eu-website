
"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie';

interface LanguageSwitcherProps {
  currentLang: string;
}

const EUFlag = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 810 540" 
    className="w-5 h-auto rounded-[1px] shadow-sm"
    aria-hidden="true"
    role="img"
  >
    <defs>
      <path id="s" d="M0-1l.588 1.809L-1.002.583h1.944L-1.55 1.81z" />
    </defs>
    <path fill="#003399" d="M0 0h810v540H0z" />
    <g fill="#ffcc00" transform="matrix(30 0 0 30 405 270)">
      <use href="#s" y="-6" />
      <use href="#s" y="6" />
      <use href="#s" transform="rotate(-30) translate(0 -6) rotate(30)" />
      <use href="#s" transform="rotate(-60) translate(0 -6) rotate(60)" />
      <use href="#s" transform="rotate(30) translate(0 -6) rotate(-30)" />
      <use href="#s" transform="rotate(60) translate(0 -6) rotate(-60)" />
      <use href="#s" transform="rotate(90) translate(0 -6) rotate(-90)" />
      <use href="#s" transform="rotate(-90) translate(0 -6) rotate(90)" />
      <use href="#s" transform="rotate(120) translate(0 -6) rotate(-120)" />
      <use href="#s" transform="rotate(150) translate(0 -6) rotate(-150)" />
      <use href="#s" transform="rotate(-120) translate(0 -6) rotate(120)" />
      <use href="#s" transform="rotate(-150) translate(0 -6) rotate(150)" />
    </g>
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
    <rect width="3" height="2" fill="#21468B" />
    <rect width="3" height="1.333" fill="#fff" />
    <rect width="3" height="0.666" fill="#AE1C28" />
  </svg>
);

const ESFlag = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 750 500" 
    className="w-5 h-auto rounded-[1px] shadow-sm"
    aria-hidden="true"
    role="img"
  >
    <rect width="750" height="500" fill="#c60b1e" />
    <rect width="750" height="250" y="125" fill="#ffc400" />
  </svg>
);

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    
    const segments = pathname.split("/");
    const languages = ["en", "nl", "es"];
    const currentIndex = languages.indexOf(currentLang);
    const targetLang = languages[(currentIndex + 1) % languages.length];

    // Set the language preference in a first-party cookie
    Cookies.set('NEXT_LOCALE', targetLang, { expires: 365, secure: true, sameSite: 'Lax' });
    
    if (languages.includes(segments[1])) {
      segments[1] = targetLang;
    } else {
      segments.splice(1, 0, targetLang);
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      'event': 'language_switch',
      'language': targetLang
    });
    
    const newPath = segments.join("/") || "/";
    router.push(newPath);
  };

  const getLanguageName = (lang: string) => {
    switch (lang) {
      case "en": return "English";
      case "nl": return "Dutch";
      case "es": return "Spanish";
      default: return "";
    }
  };

  const renderFlag = (lang: string) => {
    switch (lang) {
      case "en": return <EUFlag />;
      case "nl": return <NLFlag />;
      case "es": return <ESFlag />;
      default: return null;
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="h-11 px-3 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-2 overflow-hidden border-none"
      aria-label={`Switch language from ${getLanguageName(currentLang)}`}
    >
      {renderFlag(currentLang)}
      <span className="sr-only">Current language: {getLanguageName(currentLang)}</span>
    </Button>
  );
}
