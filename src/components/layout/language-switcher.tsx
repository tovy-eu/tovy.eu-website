
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendGA4Event } from "@/lib/tracking";
import Cookies from 'js-cookie';

interface LanguageSwitcherProps {
  currentLang: string;
}

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "nl", label: "Nederlands" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
] as const;

export default function LanguageSwitcher({ currentLang }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const pathFor = (lang: string) => {
    const segments = (pathname || "/").split("/");
    if (LANGUAGES.some(l => l.code === segments[1])) {
      segments[1] = lang;
    } else {
      segments.splice(1, 0, lang);
    }
    return segments.join("/") || "/";
  };

  const handleSelect = (lang: string) => {
    setOpen(false);
    if (lang === currentLang) return;
    Cookies.set('NEXT_LOCALE', lang, { expires: 365, secure: true, sameSite: 'Lax' });
    sendGA4Event('language_switch', { language: lang });
  };

  const current = LANGUAGES.find(l => l.code === currentLang) ?? LANGUAGES[0];

  return (
    <div ref={rootRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(o => !o)}
        className="h-11 px-3 rounded-full hover:bg-white/10 transition-all flex items-center justify-center gap-1.5 border-none uppercase tracking-widest text-xs"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Change language. Current language: ${current.label}`}
      >
        {current.code}
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} aria-hidden="true" />
      </Button>
      {open && (
        <ul className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-lg p-1.5 z-50">
          {LANGUAGES.map(lang => (
            <li key={lang.code}>
              <Link
                href={pathFor(lang.code)}
                hrefLang={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-white/10",
                  lang.code === currentLang ? "text-foreground" : "text-muted-foreground"
                )}
                aria-current={lang.code === currentLang ? "true" : undefined}
              >
                {lang.label}
                {lang.code === currentLang && <Check className="h-4 w-4 text-primary" aria-hidden="true" />}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
