import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { LegalNoticeClient } from '@/components/legal/legal-notice-client';

export const metadata: Metadata = {
  title: 'Legal Notice | Tovy',
  description: 'Legal Notice and company information for Tovy.',
};

export default function LegalNoticePage() {
  return <LegalNoticeClient profile={companyProfile.public_company_profile} />;
}
