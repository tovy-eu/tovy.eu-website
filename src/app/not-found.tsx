// src/app/not-found.tsx
'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WavyLines } from '@/components/landing/wavy-lines';
import { Home, FileText } from 'lucide-react';

import en from '@/dictionaries/en.json';
import nl from '@/dictionaries/nl.json';
import de from '@/dictionaries/de.json';
import es from '@/dictionaries/es.json';

export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  const translations: Record<string, typeof en.notFound & {
    homePath: string;
    projectPath: string;
  }> = {
    en: {
      ...en.notFound,
      homePath: "/en/",
      projectPath: "/en/project-request/"
    },
    nl: {
      ...nl.notFound,
      homePath: "/nl/",
      projectPath: "/nl/project-request/"
    },
    de: {
      ...de.notFound,
      homePath: "/de/",
      projectPath: "/de/project-request/"
    },
    es: {
      ...es.notFound,
      homePath: "/es/",
      projectPath: "/es/project-request/"
    }
  };

  const t = translations[lang] || translations.en;

  return (
    <div 
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8 text-center"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-4">
          <span className="inline-block rounded-full bg-primary/20 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
            {t.badge}
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
          {t.titlePart1}
          <span className="text-primary"> {t.titlePart2}</span>
        </h1>
        <p className="mt-4 max-w-lg text-lg text-white/70">
          {t.description}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href={t.homePath}>
              <Home className="mr-2 h-4 w-4" />
              {t.returnHome}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg" className="bg-white/5 hover:bg-white/10 text-white">
            <Link href={t.projectPath}>
              <FileText className="mr-2 h-4 w-4" />
              {t.startProject}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}