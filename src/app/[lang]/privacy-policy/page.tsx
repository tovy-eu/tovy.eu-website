
import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import PrivacyPolicyClient from '@/components/legal/privacy-policy-client';
import { PageCategorySetter } from '@/components/layout/page-category-setter';

import { i18n } from '@/lib/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const path = '/privacy-policy';

    return {
      title: dict.pages.privacyPolicy.metadata.title,
      description: dict.pages.privacyPolicy.metadata.description,
      alternates: generateAlternates(path, lang),
    };
  } catch {
    return {
      title: 'Error',
      description: 'Page not found',
    };
  }
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const email = companyProfile.public_company_profile.contact_details.email;

  return (
    <>
      <PageCategorySetter category="legal" />
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema([
        { name: dict.global.home, item: '/' },
        { name: dict.pages.privacyPolicy.metadata.title, item: '/privacy-policy/' }
      ])} />
      <PrivacyPolicyClient email={email} dict={dict} />
    </>
  );
}
