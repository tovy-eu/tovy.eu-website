'use client';

import { useState, useEffect } from 'react';
import type { JSONContent } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Download, Building, MapPin, Mail, Phone, User, FileText, Landmark, KeyRound, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Dictionary } from '@/lib/get-dictionary';
import { WavyLines } from '@/components/landing/wavy-lines';

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
  <div className="flex items-start gap-4">
    <div className="text-primary mt-1 shrink-0">{icon}</div>
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60 mb-1">{label}</p>
      <div className="text-foreground font-medium break-words">{value}</div>
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
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'json_download', {
        event_category: 'engagement',
        event_label: 'Download Company Profile'
      });
    }
  };

  return (
    <div 
      className="relative min-h-screen py-16 sm:py-24 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="container relative z-10 mx-auto max-w-5xl px-4 md:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              {dict.legal.title}
            </h1>
            <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
              {dict.legal.subtitle}
            </p>
          </div>
          {downloadHref && (
            <Button asChild variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10 text-white shrink-0" onClick={handleDownloadClick}>
              <a href={downloadHref} download="company-profile.json">
                <Download className="mr-2 h-4 w-4" />
                {dict.common.downloadJson}
              </a>
            </Button>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Company Identification */}
          <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-2xl flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <Building className="h-5 w-5" />
                <CardTitle className="text-lg">{dict.legal.companyDetails}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <InfoLine
                icon={<ShieldCheck className="h-5 w-5" />}
                label={dict.legal.companyName}
                value={<p className="text-lg font-bold">{profile.entity_name} <span className="text-sm font-normal text-muted-foreground">({profile.legal_structure})</span></p>}
              />
              <InfoLine
                icon={<User className="h-5 w-5" />}
                label={dict.legal.representedBy}
                value={<p>{profile.business_context.proprietor_name}</p>}
              />
            </CardContent>
          </Card>

          {/* Contact & Location */}
          <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-2xl flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2 text-primary mb-1">
                <MapPin className="h-5 w-5" />
                <CardTitle className="text-lg">{dict.legal.contactInfo}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 flex-grow">
              <InfoLine
                icon={<Mail className="h-5 w-5" />}
                label={dict.legal.email}
                value={<a href={`mailto:${profile.contact_details.email}`} className="underline hover:text-primary transition-colors">{profile.contact_details.email}</a>}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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

        {/* Registry & Identifiers */}
        <Card className="bg-card/40 backdrop-blur-md border-white/5 shadow-2xl mb-8">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-primary mb-1">
              <KeyRound className="h-5 w-5" />
              <CardTitle className="text-lg">{dict.legal.registry}</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <InfoLine
                icon={<Landmark className="h-5 w-5" />}
                label={dict.legal.commercialRegistry}
                value={<p>Chamber of Commerce (KvK)</p>}
              />
              <InfoLine
                icon={<FileText className="h-5 w-5" />}
                label={dict.legal.kvkNumber}
                value={<p className="font-mono text-lg">{profile.primary_identifiers.commercial_registry_number}</p>}
              />
              <InfoLine
                icon={<ShieldCheck className="h-5 w-5" />}
                label={dict.legal.vatNumber}
                value={<p className="font-mono text-lg">{profile.primary_identifiers.vat_id_number}</p>}
              />
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer Section */}
        <Card className="bg-card/20 backdrop-blur-sm border-white/5 border-dashed">
          <CardHeader>
            <CardTitle className="text-base text-foreground/80">{dict.legal.disclaimer}</CardTitle>
            <CardDescription className="text-muted-foreground/60">{dict.legal.disclaimerSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/60 leading-relaxed italic">
            <p>{dict.legal.disclaimerContent}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}