'use client';

import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useEffect, useState } from 'react';

// Metadata is still supported in client components
export const metadata: Metadata = {
  title: 'Legal Notice | Tovy',
  description: 'Legal Notice and company information for Tovy.',
};

export default function LegalNoticePage() {
  const { public_company_profile: profile } = companyProfile;
  const [downloadHref, setDownloadHref] = useState('');

  useEffect(() => {
    // This runs on the client, avoiding server/client mismatch for the href
    const jsonString = JSON.stringify(companyProfile, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    setDownloadHref(url);

    // Cleanup the object URL when the component unmounts
    return () => {
      URL.revokeObjectURL(url);
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-3xl font-bold">Legal Notice (Impressum)</h1>
        {downloadHref && (
          <Button asChild variant="link">
            <a href={downloadHref} download="company-profile.json">
              <Download className="mr-2 h-4 w-4" />
              Download JSON
            </a>
          </Button>
        )}
      </div>

      <div className="space-y-4 text-muted-foreground">
        <p>Information pursuant to the German Telemedia Act (TMG) and other relevant EU regulations.</p>
        
        <div className="space-y-2 pt-4 text-foreground">
          <h2 className="text-xl font-semibold">Company Name:</h2>
          <p className="text-muted-foreground">{profile.entity_name}</p>

          <h2 className="text-xl font-semibold">Legal Structure:</h2>
          <p className="text-muted-foreground">{profile.legal_structure}</p>
          
          <h2 className="text-xl font-semibold">Address:</h2>
          <p className="text-muted-foreground">
            {profile.contact_details.street_name} {profile.contact_details.house_number}<br />
            {profile.contact_details.postal_code} {profile.contact_details.city}<br />
            Nederland
          </p>
          
          <h2 className="text-xl font-semibold">Contact:</h2>
          <p className="text-muted-foreground">
            Email: <a href={`mailto:${profile.contact_details.email}`} className="underline hover:text-primary">{profile.contact_details.email}</a><br />
            Phone: {profile.contact_details.country_code} {profile.contact_details.phone_number}
          </p>

          <h2 className="text-xl font-semibold">Represented by (Proprietor):</h2>
          <p className="text-muted-foreground">{profile.business_context.proprietor_name}</p>

          <h2 className="text-xl font-semibold">Commercial Registry:</h2>
          <p className="text-muted-foreground">
            Dutch Chamber of Commerce (Kamer van Koophandel)
          </p>
          
          <h2 className="text-xl font-semibold">KvK Number (Registration Number):</h2>
          <p className="text-muted-foreground">
            {profile.primary_identifiers.commercial_registry_number}
          </p>

          <h2 className="text-xl font-semibold">VAT Identification Number:</h2>
          <p className="text-muted-foreground">
            {profile.primary_identifiers.vat_id_number}
          </p>

          <h2 className="text-xl font-semibold">Primary Business Activity:</h2>
          <p className="text-muted-foreground">
            {profile.business_context.primary_activity_description}
          </p>
        </div>

        <div className="pt-6">
            <h2 className="text-2xl font-semibold text-foreground">Disclaimer</h2>
            <p className="mt-2">The contents of our pages have been created with the utmost care. However, we cannot guarantee the contents' accuracy, completeness or topicality. According to statutory provisions, we are furthermore responsible for our own content on these web pages. In this matter, please note that we are not obliged to monitor the transmitted or saved information of third parties, or investigate circumstances pointing to illegal activity.</p>
        </div>
      </div>
    </div>
  );
}
