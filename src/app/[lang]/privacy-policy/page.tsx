
import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { getDictionary } from '@/lib/get-dictionary';
import { WavyLines } from '@/components/landing/wavy-lines';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: dict.privacy.title,
    description: dict.privacy.intro.substring(0, 160),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const email = companyProfile.public_company_profile.contact_details.email;

  return (
    <div 
      className="relative flex flex-col min-h-screen pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Link href={`/${lang}/`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden bg-card/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
          <CardHeader className="p-8 md:p-12 border-b border-white/5">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ShieldCheck className="h-6 w-6" />
              <span className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-white/40">Compliance & Security</span>
            </div>
            <CardTitle className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]" asChild>
              <h1>{dict.privacy.title}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-12 lg:p-16">
            <div className="prose dark:prose-invert prose-lg max-w-none text-white/70 leading-relaxed">
              <p className="text-xl text-white font-medium mb-12 border-l-4 border-primary pl-6 py-2 bg-white/5 rounded-r-lg">
                {dict.privacy.intro}
              </p>

              <div className="space-y-16">
                {dict.privacy.sections.map((section: any, index: number) => (
                  <section key={index} className="scroll-mt-32">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center gap-4">
                      <span className="text-primary/40 font-mono text-lg">0{index + 1}</span>
                      {section.title}
                    </h2>
                    <div className="space-y-4">
                      <p>
                        {section.content}
                        {(index === 0 || index === 5) && (
                          <>
                            {" "}
                            <a href={`mailto:${email}`} className="text-primary font-bold underline hover:text-primary/80 transition-colors">
                              {email}
                            </a>
                            .
                          </>
                        )}
                      </p>
                      {section.list && (
                        <ul className="list-none space-y-6 pl-0">
                          {section.list.map((item: string, i: number) => (
                            <li key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-colors">
                              <div className="h-2 w-2 rounded-full bg-primary mt-2.5 shrink-0 shadow-[0_0_8px_hsl(var(--primary))]" />
                              <span className="text-white/80 group-hover:text-white transition-colors" dangerouslySetInnerHTML={{ __html: item }} />
                            </li>
                          ))}
                        </ul>
                      )}
                      {section.footer && <p className="mt-8 font-medium italic text-white/50">{section.footer}</p>}
                    </div>
                  </section>
                ))}
              </div>

              <div className="mt-20 pt-12 border-t border-white/5 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <p className="text-sm font-bold tracking-widest uppercase text-white/30">
                    {dict.privacy.effectiveDate}
                  </p>
                  <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white">
                    <a href={`mailto:${email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Data Officer
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
