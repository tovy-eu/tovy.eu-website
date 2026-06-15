import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import LegalNoticeClient from '@/components/legal/legal-notice-client';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { PageCategorySetter } from '@/components/layout/page-category-setter';

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
      title: dict.pages.legalNotice.metadata.title,
      description: dict.pages.legalNotice.metadata.description,
      keywords: dict.pages.legalNotice.metadata.keywords,
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
  return (
    <>
      <PageCategorySetter category="legal" />
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema([
        { name: dict.global.home, item: '/' },
        { name: dict.pages.legalNotice.metadata.title, item: '/legal-notice/' }
      ])} />
      <LegalNoticeClient profile={companyProfile.public_company_profile} dict={dict} />
    </>
  );
}
