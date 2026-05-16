// src/app/not-found.tsx
'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { WavyLines } from '@/components/landing/wavy-lines';
import { ArrowLeft, Home, FileText } from 'lucide-react';

export default function NotFound() {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'en';

  const translations:any = {
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
