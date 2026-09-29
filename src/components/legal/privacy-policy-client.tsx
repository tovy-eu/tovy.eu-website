'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import type { Dictionary } from '@/lib/get-dictionary';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type PrivacyPolicyClientProps = {
  email: string;
  dict: Dictionary;
}

export default function PrivacyPolicyClient({ email, dict }: PrivacyPolicyClientProps) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const c = dict.pages.privacyPolicy.content;

  return (
    <div className="relative min-h-screen flex flex-col pt-24 md:pt-32 pb-16 md:pb-24 px-0 md:px-8 bg-background">
      <div className="container relative z-10 mx-auto max-w-2xl w-full">
        {/* Compact page header */}
        <header className="mb-6 md:mb-8 px-4 md:px-0">
          <p className="text-[11px] font-bold tracking-wider text-primary/60 uppercase mb-2">{c.badge}</p>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-white tracking-tight leading-none">{c.title}</h1>
          <p className="mt-3 text-sm md:text-base text-white/55 font-medium">{c.intro}</p>
        </header>

        {/* Single static info card, grouped sections — full-bleed on mobile */}
        <div className="w-full bg-card/95 backdrop-blur-xl border-y border-white/10 divide-y divide-white/10 px-4 py-5 md:border md:rounded-lg md:p-6">
          {c.sections.map((section: { title: string; content: string; list?: string[]; footer?: string }, index: number) => (
            <section key={index} className="py-4 first:pt-0 last:pb-0 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold text-primary/70 tabular-nums">{(index + 1).toString().padStart(2, '0')}</span>
                <h2 className="text-[12px] font-bold text-white/90 leading-tight tracking-wider uppercase">{section.title}</h2>
              </div>

              <p className="text-sm text-white/65 leading-relaxed text-pretty">
                {section.content}
                {(index === 0 || index === 5) && (
                  <>
                    {" "}
                    <a href={`mailto:${email}`} className="text-primary font-semibold hover:text-blue-400 transition-colors break-all">
                      {email}
                    </a>
                  </>
                )}
              </p>

              {section.list && (
                <ul className="space-y-1.5 pt-0.5">
                  {section.list.map((item: string, i: number) => (
                    <li key={i} className="flex gap-2 items-start">
                      <ChevronRight className="h-3.5 w-3.5 text-primary/50 mt-0.5 shrink-0" />
                      <span className="text-[13px] text-white/55 leading-relaxed" dangerouslySetInnerHTML={{ __html: item }} />
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-xs font-medium italic text-white/45 border-l-2 border-white/10 pl-4">
                  {section.footer}
                </p>
              )}
            </section>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 px-4 md:px-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-[11px] font-bold tracking-wide text-white/30 uppercase">{c.effectiveDate}</p>
          <Button asChild variant="ghost" className="hover:bg-white/5 text-white/40 hover:text-white/70 text-xs font-bold tracking-wide h-11 px-6 rounded-full transition-colors">
            <Link href={`/${lang}/`}><ArrowLeft className="mr-2 h-3.5 w-3.5" /> {dict.global.common.back}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
