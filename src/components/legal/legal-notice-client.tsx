
'use client';

import { useState, useEffect } from 'react';
import type { JSONContent } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Download, Building, MapPin, Mail, Phone, User, FileText, Landmark, KeyRound, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Dictionary } from '@/lib/get-dictionary';
import { WavyLines } from '@/components/landing/wavy-lines';
import Link from 'next/link';

type LegalNoticeClientProps = {
  profile: JSONContent['public_company_profile'];
  dict: Dictionary;
}

type InfoLineProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}

const InfoLine = ({ icon, label, value }: InfoLineProps) => (
  <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all duration-300 group">
    <div className="text-primary mt-1 shrink-0 transition-transform group-hover:scale-110">{icon}</div>
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 mb-1">{label}</p>
      <div className="text-white/90 font-semibold break-words group-hover:text-white transition-colors">{value}</div>
    </div>
  </div>
);

export default function LegalNoticeClient({ profile, dict }: LegalNoticeClientProps) {
  const [downloadHref, setDownloadHref] = useState('');

  useEffect(() => {
    const jsonString = JSON.stringify({ public_company_profile: profile }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadHref(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [profile]);

  const handleDownloadClick = () => {
    trackEvent({
      name: 'json_download',
      event_category: 'engagement',
      event_label: 'Download Company Profile'
    });
  };

  return (
    <div 
      className="relative min-h-screen pt-32 md:pt-40 pb-24 sm:pb-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="container relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent leading-tight">
              {dict.legal.title}
            </h1>
            <p className="mt-4 text-white/60 text-lg leading-relaxed">
              {dict.legal.subtitle}
            </p>
          </div>
          {downloadHref && (
            <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white shrink-0 h-12 px-6" onClick={handleDownloadClick}>
              <a href={downloadHref} download="company-profile.json">
                <Download className="mr-2 h-4 w-4" />
                {dict.common.downloadJson}
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl flex flex-col rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 text-primary mb-1">
                <Building className="h-5 w-5" />
                <CardTitle className="text-xl font-bold text-white" asChild>
                  <h2>{dict.legal.companyDetails}</h2>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4 flex-grow">
              <InfoLine
                icon={<ShieldCheck className="h-5 w-5" />}
                label={dict.legal.companyName}
                value={<p className="text-lg font-bold text-white">{profile.entity_name} <span className="text-sm font-normal text-white/40">({profile.legal_structure})</span></p>}
              />
              <InfoLine
                icon={<User className="h-5 w-5" />}
                label={dict.legal.representedBy}
                value={<p>{profile.business_context.proprietor_name}</p>}
              />
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl flex flex-col rounded-3xl overflow-hidden">
            <CardHeader className="p-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-3 text-primary mb-1">
                <MapPin className="h-5 w-5" />
                <CardTitle className="text-xl font-bold text-white" asChild>
                  <h2>{dict.legal.contactInfo}</h2>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-4 flex-grow">
              <InfoLine
                icon={<Mail className="h-5 w-5" />}
                label={dict.legal.email}
                value={<a href={`mailto:${profile.contact_details.email}`} className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4">{profile.contact_details.email}</a>}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoLine
                  icon={<Phone className="h-5 w-5" />}
                  label={dict.legal.phone}
                  value={<p>{profile.contact_details.country_code} {profile.contact_details.phone_number}</p>}
                />
                <InfoLine
                  icon={<MapPin className="h-5 w-5" />}
                  label={dict.legal.address}
                  value={
                    <p className="text-sm leading-snug">
                      {profile.contact_details.street_name} {profile.contact_details.house_number}<br />
                      {profile.contact_details.postal_code} {profile.contact_details.city}, NL
                    </p>
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/40 backdrop-blur-2xl border-white/10 shadow-2xl mb-8 rounded-3xl overflow-hidden">
          <CardHeader className="p-8 pb-4 border-b border-white/5">
            <div className="flex items-center gap-3 text-primary mb-1">
              <KeyRound className="h-5 w-5" />
              <CardTitle className="text-xl font-bold text-white" asChild>
                <h2>{dict.legal.registry}</h2>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <InfoLine
                icon={<Landmark className="h-5 w-5" />}
                label={dict.legal.commercialRegistry}
                value={<p>Chamber of Commerce (KvK)</p>}
              />
              <InfoLine
                icon={<FileText className="h-5 w-5" />}
                label={dict.legal.kvkNumber}
                value={<p className="font-mono text-xl text-primary">{profile.primary_identifiers.commercial_registry_number}</p>}
              />
              <InfoLine
                icon={<ShieldCheck className="h-5 w-5" />}
                label={dict.legal.vatNumber}
                value={<p className="font-mono text-xl text-primary">{profile.primary_identifiers.vat_id_number}</p>}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/20 backdrop-blur-xl border-white/5 border-dashed rounded-3xl">
          <CardHeader className="p-8">
            <CardTitle className="text-base text-white/80" asChild>
              <h2>{dict.legal.disclaimer}</h2>
            </CardTitle>
            <CardDescription className="text-white/40" asChild>
              <p>{dict.legal.disclaimerSubtitle}</p>
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8 prose prose-sm dark:prose-invert max-w-none text-white/40 leading-relaxed italic">
            <p>{dict.legal.disclaimerContent}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
