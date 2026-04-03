
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight } from 'lucide-react';
import { WavyLines } from '@/components/landing/wavy-lines';

const translations = {
  en: {
    badge: "Error 404",
    titlePart1: "Lost in the",
    titlePart2: "Data Silos?",
    description: "The page you are looking for has been moved, deleted, or never existed. Let's get you back to the foundation.",
    returnHome: "Return Home",
    startProject: "Start a Project",
    homePath: "/en/",
    projectPath: "/en/project-request/"
  },
  nl: {
    badge: "Fout 404",
    titlePart1: "Verdwaald in de",
    titlePart2: "Data Silo's?",
    description: "De pagina die je zoekt is verplaatst, verwijderd of heeft nooit bestaan. Laten we je terugbrengen naar de basis.",
    returnHome: "Terug naar Home",
    startProject: "Project Starten",
    homePath: "/nl/",
    projectPath: "/nl/project-request/"
  }
};

/**
 * 404 - Page Not Found
 * 
 * Localized based on the visitor's language preference (URL path or browser settings).
 * Designed to maintain the high-end Tovy aesthetic even when a user gets lost.
 */
export default function NotFound() {
  const [lang, setLang] = useState<'en' | 'nl'>('en');

  useEffect(() => {
    // Detect language from URL or browser settings
    const pathname = window.location.pathname;
    let detectedLang: 'en' | 'nl' = 'en';
    
    if (pathname.startsWith('/nl/')) {
      detectedLang = 'nl';
    } else if (!pathname.startsWith('/en/') && navigator.language.startsWith('nl')) {
      detectedLang = 'nl';
    }
    
    setLang(detectedLang);
  }, []);

  const t = translations[lang];

  return (
    <div
      className="relative flex min-h-screen flex-col items-center justify-center text-center px-4 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      
      <div className="z-10 max-w-2xl flex flex-col items-center justify-center animate-scale-in">
        <div className="mb-6">
          <span className="text-[10px] md:text-sm font-bold leading-7 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent uppercase tracking-[0.3em]">
            {t.badge}
          </span>
        </div>

        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-tight"
          style={{ textShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}
        >
          {t.titlePart1} <br />
          <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
            {t.titlePart2}
          </span>
        </h1>
        
        <p className="mt-8 text-sm md:text-lg leading-relaxed text-white/70 max-w-md mx-auto font-medium">
          {t.description}
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-lg h-12 shadow-2xl">
            <Link href={t.homePath}>
              <Home className="mr-2 h-5 w-5" />
              {t.returnHome}
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-semibold text-lg bg-transparent text-white border-white/20 hover:bg-white/5 h-12">
            <Link href={t.projectPath}>
              {t.startProject}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Subtle branding footer for the 404 page */}
      <div className="absolute bottom-12 left-0 right-0 z-10 opacity-20 flex justify-center items-center gap-2 select-none">
        <span className="font-bold tracking-tighter text-xl text-white">TOV</span>
        <span className="font-bold tracking-tighter text-xl bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Y</span>
      </div>
    </div>
  );
}
