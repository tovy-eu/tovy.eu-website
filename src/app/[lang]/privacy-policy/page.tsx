
import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';
import PrivacyPolicyClient from '@/components/legal/privacy-policy-client';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const path = '/privacy-policy';

    return {
      title: dict.privacy?.metaTitle || dict.privacy.title,
      description: dict.privacy?.metaDescription || dict.privacy.intro.substring(0, 160),
      alternates: generateAlternates(path, lang),
    };
  } catch (error) {
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

  return <PrivacyPolicyClient email={email} dict={dict} />;
}
