import { HeroSection } from "@/components/landing/hero-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { getDictionary } from "@/lib/get-dictionary";
import { JsonLd, getServicesSchema, getFaqSchema } from "@/components/layout/json-ld";
import { PageCategorySetter } from "@/components/layout/page-category-setter";
import type { Metadata } from 'next';
import { generateAlternates } from '@/lib/metadata';

import { i18n } from '@/lib/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const title = dict.pages.home.metadata.title;
    const description = dict.pages.home.metadata.description;
    const path = '/';

    return {
      title,
      description,
      alternates: generateAlternates(path, lang),
      openGraph: {
        title,
        description,
        siteName: 'Tovy',
        images: [
          {
            url: `https://tovy.eu/images/tovy-og-image.webp`,
            width: 1200,
            height: 630,
            alt: description,
          },
        ],
        locale: lang,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Error',
      description: 'Page not found',
    };
  }
}

import { AboutSection } from "@/components/landing/about-section";
import { EngineeringSection } from "@/components/landing/engineering-section";
import FaqSection from "@/components/landing/faq-section";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      <PageCategorySetter category="landing" />
      {/* Machine Experience (MX) Structured Data */}
      <JsonLd type="Service" data={getServicesSchema(dict)} />
      <JsonLd type="FAQPage" data={getFaqSchema(dict)} />

      <HeroSection dict={dict} />

      <SectionDivider />
      
      <AboutSection dict={dict} />

      <SectionDivider />

      <EngineeringSection dict={dict} />

      <SectionDivider />

      <FaqSection dict={dict} />

      {/* <SectionDivider /> */}

      {/* <TestimonialsSection dict={dict} /> */}
    </div>
  );
}
