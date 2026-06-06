import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { JsonLd, getOrganizationSchema, getPersonSchema } from '@/components/layout/json-ld';
import { i18n } from '@/lib/config';
import "../globals.css";
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils";
import CookieBanner from "@/components/layout/cookie-banner";
import { AnalyticsProviderHead, AnalyticsProviderBody } from "@/components/layout/analytics-provider";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export const dynamicParams = false;

export const metadata: Metadata = {
  metadataBase: new URL("https://tovy.eu"),
  title: {
    template: "%s | Tovy",
    default: "Data Engineering for E-commerce Growth | Tovy",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "nl_NL",
    siteName: "Tovy",
    images: [
      {
        url: "https://tovy.eu/images/tovy-og-image.webp",
        width: 1200,
        height: 630,
        alt: "Tovy Data Engineering",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Data Engineering for E-commerce Growth | Tovy",
    images: ["https://tovy.eu/images/tovy-og-image.webp"],
  },
};

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
    <html lang={lang} className={`${GeistSans.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <AnalyticsProviderHead />
        <JsonLd type="Organization" data={getOrganizationSchema(dict)} />
        <JsonLd type="Person" data={getPersonSchema()} />
      </head>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen")}>
        <AnalyticsProviderBody />
        <Header lang={lang} dict={dict} />
        <main id="main-content" className="flex-grow flex flex-col">
          {children}
        </main>
        <Footer lang={lang} />
        <Toaster />
        <CookieBanner dict={dict} />
      </body>
    </html>
  );
}
