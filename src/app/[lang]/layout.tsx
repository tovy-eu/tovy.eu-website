import type { Metadata } from "next";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { JsonLd, getOrganizationSchema, getPersonSchema } from '@/components/layout/json-ld';
import { i18n } from '@/lib/config';
import "../globals.css";
import { Toaster } from "@/components/ui/toaster"
import CookieBanner from "@/components/layout/cookie-banner";
import { AnalyticsProviderHead, AnalyticsProviderBody } from "@/components/layout/analytics-provider";
import { LanguageSync } from "@/components/layout/language-sync";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = i18n.locales.includes(rawLang as typeof i18n.locales[number]) 
    ? (rawLang as typeof i18n.locales[number]) 
    : i18n.defaultLocale;
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL("https://tovy.eu"),
    title: {
      template: dict.global.metadata.template,
      default: dict.global.metadata.defaultTitle,
    },
    openGraph: {
      type: "website",
      locale: lang === 'en' ? 'en_US' : `${lang}_${lang.toUpperCase()}`,
      siteName: "Tovy",
      images: [
        {
          url: "https://tovy.eu/images/tovy-og-image.webp",
          width: 1200,
          height: 630,
          alt: dict.global.metadata.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.global.metadata.twitterTitle || dict.global.metadata.defaultTitle,
      images: ["https://tovy.eu/images/tovy-og-image.webp"],
    },
    other: {
      'revisit-after': '14 days',
      'googlebot': 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
    },
  };
}

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang: rawLang } = await params;
  const lang = i18n.locales.includes(rawLang as typeof i18n.locales[number]) ? (rawLang as typeof i18n.locales[number]) : i18n.defaultLocale;
  const dict = await getDictionary(lang);
  
  return (
    <>
      <LanguageSync lang={lang} />
      <AnalyticsProviderHead />
      <JsonLd type="Organization" data={getOrganizationSchema(dict)} />
      <JsonLd type="Person" data={getPersonSchema()} />
      <AnalyticsProviderBody />
      <Header lang={lang} dict={dict} />
      <main id="main-content" className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer lang={lang} />
      <Toaster />
      <CookieBanner dict={dict} />
    </>
  );
}
