
'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import type { Dictionary } from "@/lib/get-dictionary";
import { usePathname } from "next/navigation";

export function FinalCtaSection({ dict }: { dict: Dictionary }) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  return (
    <section className="relative w-full py-24 px-4 overflow-hidden bg-background">
      <div 
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(43,94,255,0.15), transparent 70%)'
        }}
      />
      
      <div className="container relative z-10 mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          {dict.projectCta.title}
        </h2>
        <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto font-medium">
          {dict.projectCta.description}
        </p>
        
        <div className="flex justify-center">
          <Magnetic strength={0.25}>
            <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-lg h-14 shadow-2xl px-10">
              <Link href={`/${lang}/project-request/`}>
                {dict.common.workWithUs}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
