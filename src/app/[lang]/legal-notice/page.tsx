import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import LegalNoticeClient from '@/components/legal/legal-notice-client';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.legal.title} | Tovy`,
    description: `Legal Notice and company information for Tovy.`,
  };
}

export default async function LegalNoticePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <LegalNoticeClient profile={companyProfile.public_company_profile} dict={dict} />;
}
