import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import LegalNoticeClient from '@/components/legal/legal-notice-client';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';

import { i18n } from '@/lib/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const path = '/legal-notice';

    return {
      title: dict.legal?.metaTitle || dict.legal.title,
      description: dict.legal?.metaDescription || `Legal Notice and company information for Tovy.`,
      keywords: dict.legal?.keywords || [],
      alternates: generateAlternates(path, lang),
    };
  } catch {
    return {
      title: 'Error',
      description: 'Page not found',
    };
  }
}

export default async function LegalNoticePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return <LegalNoticeClient profile={companyProfile.public_company_profile} dict={dict} />;
}
