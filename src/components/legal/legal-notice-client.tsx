
'use client';

import { useState, useEffect } from 'react';
import type { JSONContent } from '@/lib/definitions';
import { Button } from '@/components/ui/button';
import { Download, Building, MapPin, Mail, Phone, User, FileText, Landmark, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

type LegalNoticeClientProps = {
  profile: JSONContent['public_company_profile'];
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


export function LegalNoticeClient({ profile }: LegalNoticeClientProps) {
  const [downloadHref, setDownloadHref] = useState('');

  useEffect(() => {
    // This runs on the client, avoiding server/client mismatch for the href
    const jsonString = JSON.stringify({ public_company_profile: profile }, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadHref(url);

    // Cleanup the object URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [profile]); // Re-run if profile changes

  return (
    <div className="bg-gradient-to-b from-accent/10 to-primary/10 py-16 sm:py-24">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Legal Notice</h1>
          </div>
          {downloadHref && (
            <Button asChild variant="link" className="mt-4 sm:mt-0">
              <a href={downloadHref} download="company-profile.json">
                <Download className="mr-2 h-4 w-4" />
                Download as JSON
              </a>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Company Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoLine
                  icon={<Building className="h-5 w-5" />}
                  label="Company Name"
                  value={<p>{profile.entity_name} ({profile.legal_structure})</p>}
                />
                <InfoLine
                  icon={<User className="h-5 w-5" />}
                  label="Represented by (Proprietor)"
                  value={<p>{profile.business_context.proprietor_name}</p>}
                />
                <InfoLine
                  icon={<MapPin className="h-5 w-5" />}
                  label="Address"
                  value={
                    <p>
                      {profile.contact_details.street_name} {profile.contact_details.house_number}<br />
                      {profile.contact_details.postal_code} {profile.contact_details.city}<br />
                      Nederland
                    </p>
                  }
                />
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoLine
                  icon={<Mail className="h-5 w-5" />}
                  label="Email"
                  value={<a href={`mailto:${profile.contact_details.email}`} className="underline hover:text-primary">{profile.contact_details.email}</a>}
                />
                <InfoLine
                  icon={<Phone className="h-5 w-5" />}
                  label="Phone"
                  value={<p>{profile.contact_details.country_code} {profile.contact_details.phone_number}</p>}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Registry & Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <InfoLine
                  icon={<Landmark className="h-5 w-5" />}
                  label="Commercial Registry"
                  value={<p>Dutch Chamber of Commerce (Kamer van Koophandel)</p>}
                />
                <InfoLine
                  icon={<KeyRound className="h-5 w-5" />}
                  label="KvK Number (Registration Number)"
                  value={<p>{profile.primary_identifiers.commercial_registry_number}</p>}
                />
                <InfoLine
                  icon={<FileText className="h-5 w-5" />}
                  label="VAT Identification Number"
                  value={<p>{profile.primary_identifiers.vat_id_number}</p>}
                />
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Disclaimer</CardTitle>
                <CardDescription>Our responsibility regarding website content.</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground">
                <p>The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
