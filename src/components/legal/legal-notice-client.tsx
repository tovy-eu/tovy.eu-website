
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import type { Dictionary } from '@/lib/get-dictionary';
import { WavyLines } from '@/components/landing/wavy-lines';
import Link from 'next/link';
import { Spotlight } from '@/components/ui/spotlight';
import { SectionHeader } from '@/components/landing/section-header';

import { usePathname } from 'next/navigation';

interface CompanyProfile {
  entity_name: string;
  legal_structure: string;
  business_context: {
    proprietor_name: string;
  };
  contact_details: {
    email: string;
    street_name: string;
    house_number: string;
    postal_code: string;
    city: string;
  };
  primary_identifiers: {
    commercial_registry_number: string;
    vat_id_number: string;
  };
}

type LegalNoticeClientProps = {
  profile: CompanyProfile;
  dict: Dictionary;
}

export default function LegalNoticeClient({ profile, dict }: LegalNoticeClientProps) {
  const [downloadHref, setDownloadHref] = useState('');
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const jsonString = JSON.stringify({ public_company_profile: profile }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const timeoutId = setTimeout(() => {
      setDownloadHref(url);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      URL.revokeObjectURL(url);
    };
  }, [profile]);

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
            badge="Compliance"
            title={dict.legal.title}
            description={dict.legal.subtitle}
          />
        </div>

        <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
          <Spotlight color="rgba(43, 94, 255, 0.05)" size={400} />
          
          <div className="p-8 md:p-16 space-y-12 relative z-10">
            {/* Entity Section */}
            <section className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60">{"// "}01. ENTITY_DETAILS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{dict.legal.companyName}</p>
                  <p className="text-xl font-bold text-white tracking-tight">{profile.entity_name}</p>
                  <p className="text-sm text-white/40 mt-1">{profile.legal_structure}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{dict.legal.representedBy}</p>
                  <p className="text-lg font-semibold text-white/90">{profile.business_context.proprietor_name}</p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            {/* Contact Section */}
            <section className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60">{"// "}02. CONTACT_CHANNELS</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{dict.legal.email}</p>
                  <a href={`mailto:${profile.contact_details.email}`} className="text-lg font-bold text-primary hover:text-blue-400 transition-colors underline underline-offset-8 decoration-primary/20">
                    {profile.contact_details.email}
                  </a>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">{dict.legal.address}</p>
                  <p className="text-base text-white/70 leading-relaxed">
                    {profile.contact_details.street_name} {profile.contact_details.house_number}<br />
                    {profile.contact_details.postal_code} {profile.contact_details.city}, NL
                  </p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            {/* Registry Section */}
            <section className="space-y-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary/60">{"// "}03. FISCAL_IDENTIFIERS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">Registry</p>
                  <p className="text-sm font-bold text-white/80">Chamber of Commerce [KvK]</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">KvK Number</p>
                  <p className="font-mono text-lg text-primary drop-shadow-[0_0_8px_rgba(43,94,255,0.3)]">{profile.primary_identifiers.commercial_registry_number}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/30 mb-2">VAT ID</p>
                  <p className="font-mono text-lg text-primary drop-shadow-[0_0_8px_rgba(43,94,255,0.3)]">{profile.primary_identifiers.vat_id_number}</p>
                </div>
              </div>
            </section>

            <div className="h-px w-full bg-white/5" />

            {/* Disclaimer */}
            <section className="space-y-4">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/20">{"// "}04. DISCLAIMER</h3>
              <p className="text-sm text-white/30 leading-relaxed font-medium text-pretty italic">
                {dict.legal.disclaimerContent}
              </p>
            </section>

            {/* Actions */}
            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              {downloadHref && (
                <Button asChild variant="outline" className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white/60 hover:text-white rounded-full text-[10px] font-bold uppercase tracking-widest h-12 px-10 transition-all duration-500">
                  <a href={downloadHref} download="company-profile.json">
                    <Download className="mr-2 h-4 w-4" />
                    {dict.common.downloadJson}
                  </a>
                </Button>
              )}
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
