
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Dictionary } from '@/lib/get-dictionary';
import { WavyLines } from '@/components/landing/wavy-lines';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';
import { SectionHeader } from '@/components/landing/section-header';
import { usePathname } from 'next/navigation';

type PrivacyPolicyClientProps = {
  email: string;
  dict: Dictionary;
}

export default function PrivacyPolicyClient({ email, dict }: PrivacyPolicyClientProps) {
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  return (
    <div 
      className="relative min-h-screen flex flex-col pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-3xl">
        <div className="mb-16">
          <SectionHeader 
            badge="Privacy protocol"
            title={dict.privacy.title}
            description={dict.privacy.intro}
          />
        </div>

        <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
          <Spotlight color="rgba(43, 94, 255, 0.05)" size={400} />
          
          <div className="p-8 md:p-16 space-y-12 relative z-10">
            {dict.privacy.sections.map((section: { title: string; content: string; list?: string[]; footer?: string }, index: number) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="h-px w-full bg-white/5" />}
                
                <section className="space-y-6">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60">
                    {"// "}{(index + 1).toString().padStart(2, '0')}. {section.title.toUpperCase().replace(/\s+/g, '_')}
                  </h3>
                  
                  <div className="space-y-6">
                    <p className="text-base text-white/70 leading-[1.6] tracking-tight text-pretty">
                      {section.content}
                      {(index === 0 || index === 5) && (
                        <>
                          {" "}
                          <a href={`mailto:${email}`} className="text-primary font-bold underline underline-offset-4 decoration-primary/20 hover:text-blue-400 transition-colors">
                            {email}
                          </a>
                        </>
                      )}
                    </p>

                    {section.list && (
                      <div className="grid gap-3">
                        {section.list.map((item: string, i: number) => (
                          <div key={i} className="flex gap-4 items-start p-5 rounded-2xl bg-white/[0.02] border border-white/5 group hover:border-primary/20 transition-all duration-500">
                            <ChevronRight className="h-4 w-4 text-primary/40 mt-1 shrink-0" />
                            <span className="text-[13px] md:text-sm text-white/50 leading-relaxed font-medium group-hover:text-white/80 transition-colors" dangerouslySetInnerHTML={{ __html: item }} />
                          </div>
                        ))}
                      </div>
                    )}

                    {section.footer && (
                      <p className="text-sm font-medium italic text-white/30 border-l-2 border-white/5 pl-6 py-1">
                        {section.footer}
                      </p>
                    )}
                  </div>
                </section>
              </React.Fragment>
            ))}

            {/* Actions */}
            <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/20">
                {dict.privacy.effectiveDate}
              </p>
              
              <Button asChild variant="ghost" className="hover:bg-white/5 text-white/20 hover:text-white/40 text-[10px] font-bold uppercase tracking-widest h-12 px-8 rounded-full">
                <Link href={`/${lang}/`}><ArrowLeft className="mr-2 h-3.5 w-3.5" /> Back to Intelligence</Link>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
