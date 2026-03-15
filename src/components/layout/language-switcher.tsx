"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface LanguageSwitcherProps {
  currentLang: string;
}

/**
 * A minimalistic language switcher component.
 * It detects the current path and replaces the language segment to toggle between EN and NL.
 */
export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const toggleLanguage = () => {
    if (!pathname) return;
    
    const segments = pathname.split("/");
    const targetLang = currentLang === "en" ? "nl" : "en";
    
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
      className="font-bold text-[10px] h-8 w-8 p-0 rounded-full border border-white/10 hover:bg-white/10 hover:text-primary transition-all flex items-center justify-center uppercase"
      aria-label={`Switch to ${currentLang === 'en' ? 'Dutch' : 'English'}`}
    >
      {currentLang}
    </Button>
  );
}
