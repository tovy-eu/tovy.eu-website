import type { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';
import { alternates } from '@/lib/metadata';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { PageCategorySetter } from '@/components/layout/page-category-setter';
import PaymentSuccessClient from '@/components/landing/payment-success-client';
import companyProfile from '@/content/company-profile.json';
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
    const path = '/payment-success';

    return {
      title: dict.pages.paymentSuccess.metadata.title,
      description: dict.pages.paymentSuccess.metadata.description,
      alternates: alternates(path, lang),
      robots: 'noindex, follow', // Do not index payment success page in search results
    };
  } catch {
    return {
      title: 'Payment Successful',
      description: 'Your payment was successful.',
    };
  }
}

export default async function PaymentSuccessPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const email = companyProfile.public_company_profile.contact_details.email;

  return (
    <>
      <PageCategorySetter category="form" />
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema([
        { name: dict.global.common.home, item: '/' },
        { name: dict.pages.paymentSuccess.metadata.title, item: '/payment-success/' }
      ])} />
      <PaymentSuccessClient dict={dict} email={email} lang={lang} />
    </>
  );
}
