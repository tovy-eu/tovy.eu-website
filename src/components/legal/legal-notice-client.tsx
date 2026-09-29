'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Building2, Mail, Landmark } from 'lucide-react';
import type { Dictionary } from '@/lib/get-dictionary';
import Link from 'next/link';

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

/** A titled section inside the single info card. */
function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <section>
      <div className="flex items-center gap-2.5 mb-1.5">
        <div className="text-primary">{icon}</div>
        <h2 className="text-[12px] font-bold text-white/90 leading-tight tracking-wider uppercase">{title}</h2>
      </div>
      <div>{children}</div>
    </section>
  );
}

/** Compact definition row: label left, value right — fills the width, one line per field. */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-1.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-white/50 shrink-0">{label}</span>
      <div className="text-sm font-semibold text-white text-right min-w-0">{children}</div>
    </div>
  );
}

export default function LegalNoticeClient({ profile, dict }: LegalNoticeClientProps) {
  const [downloadHref, setDownloadHref] = useState('');
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const c = dict.pages.legalNotice.content;

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
    <div className="relative min-h-screen flex flex-col pt-24 md:pt-32 pb-16 md:pb-24 px-0 md:px-8 bg-background">
      <div className="container relative z-10 mx-auto max-w-2xl w-full">
        {/* Compact page header */}
        <header className="mb-6 md:mb-8 px-4 md:px-0">
          <p className="text-[11px] font-bold tracking-wider text-primary/60 uppercase mb-2">{c.compliance}</p>
          <h1 className="text-3xl md:text-4xl font-bold font-headline text-white tracking-tight leading-none">{c.title}</h1>
          <p className="mt-3 text-sm md:text-base text-white/55 font-medium">{c.subtitle}</p>
        </header>

        {/* Single info card, three grouped sections — full-bleed on mobile */}
        <div className="w-full bg-card/95 backdrop-blur-xl border-y border-white/10 divide-y divide-white/10 px-4 py-5 md:border md:rounded-lg md:p-6">
          <div className="pb-4">
            <Section icon={<Building2 className="h-4 w-4" />} title={c.entityDetails}>
              <Row label={c.companyName}>
                <span className="block">{profile.entity_name}</span>
                <span className="block text-xs font-normal text-white/45">{profile.legal_structure}</span>
              </Row>
              <Row label={c.representedBy}>{profile.business_context.proprietor_name}</Row>
            </Section>
          </div>

          <div className="py-4">
            <Section icon={<Mail className="h-4 w-4" />} title={c.contactChannels}>
              <Row label={c.email}>
                <a href={`mailto:${profile.contact_details.email}`} className="text-primary hover:text-blue-400 transition-colors break-all">
                  {profile.contact_details.email}
                </a>
              </Row>
              <Row label={c.address}>
                <span className="block font-normal text-white/75">{profile.contact_details.street_name} {profile.contact_details.house_number}</span>
                <span className="block font-normal text-white/75">{profile.contact_details.postal_code} {profile.contact_details.city}, NL</span>
              </Row>
            </Section>
          </div>

          <div className="pt-4">
            <Section icon={<Landmark className="h-4 w-4" />} title={c.fiscalIdentifiers}>
              <Row label={c.kvkNumber}>
                <span className="text-primary">{profile.primary_identifiers.commercial_registry_number}</span>
              </Row>
              <Row label={c.vatNumber}>
                <span className="text-primary break-all">{profile.primary_identifiers.vat_id_number}</span>
              </Row>
              <Row label={c.peppolId}>
                <span className="text-primary break-all">NL:KVK {profile.primary_identifiers.commercial_registry_number}</span>
              </Row>
            </Section>
          </div>
        </div>

        {/* Disclaimer — light, inline */}
        <div className="mt-6 px-4 md:px-1 space-y-2">
          <h2 className="text-[11px] font-bold text-white/40 tracking-wider uppercase">{c.disclaimer}</h2>
          <p className="text-xs md:text-sm text-white/45 leading-relaxed font-medium text-pretty italic">{c.disclaimerContent}</p>
        </div>

        {/* Actions */}
        <div className="mt-6 px-4 md:px-0 flex flex-col sm:flex-row gap-3">
          {downloadHref && (
            <Button asChild variant="outline" className="bg-white/[0.03] border-white/10 hover:bg-white/[0.06] text-white/60 hover:text-white rounded-full text-xs font-bold tracking-wide h-11 px-6 transition-colors">
              <a href={downloadHref} download="company-profile.json">
                <Download className="mr-2 h-4 w-4" />
                {dict.global.common.downloadJson}
              </a>
            </Button>
          )}
          <Button asChild variant="ghost" className="hover:bg-white/5 text-white/40 hover:text-white/70 text-xs font-bold tracking-wide h-11 px-6 rounded-full transition-colors">
            <Link href={`/${lang}/`}><ArrowLeft className="mr-2 h-3.5 w-3.5" /> {dict.global.common.back}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
