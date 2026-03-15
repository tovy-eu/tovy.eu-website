
'use client';

import { useState, useEffect } from 'react';
import type { JSONContent } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Download, Building, MapPin, Mail, Phone, User, FileText, Landmark, KeyRound } from 'lucide-react';
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
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      <div className="text-muted-foreground">{value}</div>
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

  return (
    <div 
      className="relative min-h-screen py-16 sm:py-24 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="container relative z-10 mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
              {dict.legal.title}
            </h1>
            <p className="mt-4 text-muted-foreground max-w-xl text-lg">
              Official company identification and contact details for Tovy.
            </p>
          </div>
          {downloadHref && (
            <Button asChild variant="outline" className="mt-6 sm:mt-0 bg-white/5 border-white/10 hover:bg-white/10 text-white">
              <a href={downloadHref} download="company-profile.json">
                <Download className="mr-2 h-4 w-4" />
                {dict.common.downloadJson}
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-card/40 backdrop-blur-md border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">{dict.legal.companyDetails}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoLine
                  icon={<Building className="h-5 w-5" />}
                  label={dict.legal.companyName}
                  value={<p>{profile.entity_name} ({profile.legal_structure})</p>}
                />
                <InfoLine
                  icon={<User className="h-5 w-5" />}
                  label={dict.legal.representedBy}
                  value={<p>{profile.business_context.proprietor_name}</p>}
                />
                <InfoLine
                  icon={<MapPin className="h-5 w-5" />}
                  label={dict.legal.address}
                  value={
                    <p>
                      {profile.contact_details.street_name} {profile.contact_details.house_number}<br />
                      {profile.contact_details.postal_code} {profile.contact_details.city}<br />
                      {dict.legal.nederland}
                    </p>
                  }
                />
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">{dict.legal.contactInfo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoLine
                  icon={<Mail className="h-5 w-5" />}
                  label={dict.legal.email}
                  value={<a href={`mailto:${profile.contact_details.email}`} className="underline hover:text-primary transition-colors">{profile.contact_details.email}</a>}
                />
                <InfoLine
                  icon={<Phone className="h-5 w-5" />}
                  label={dict.legal.phone}
                  value={<p>{profile.contact_details.country_code} {profile.contact_details.phone_number}</p>}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/40 backdrop-blur-md border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">{dict.legal.registry}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoLine
                  icon={<Landmark className="h-5 w-5" />}
                  label={dict.legal.commercialRegistry}
                  value={<p>Dutch Chamber of Commerce (KvK)</p>}
                />
                <InfoLine
                  icon={<KeyRound className="h-5 w-5" />}
                  label={dict.legal.kvkNumber}
                  value={<p>{profile.primary_identifiers.commercial_registry_number}</p>}
                />
                <div className="md:col-span-2">
                  <InfoLine
                    icon={<FileText className="h-5 w-5" />}
                    label={dict.legal.vatNumber}
                    value={<p className="text-lg font-mono tracking-wider">{profile.primary_identifiers.vat_id_number}</p>}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/40 backdrop-blur-md border-none shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl">{dict.legal.disclaimer}</CardTitle>
                <CardDescription className="text-muted-foreground/80">{dict.legal.disclaimerSubtitle}</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground/80 leading-relaxed">
                <p>{dict.legal.disclaimerContent}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
