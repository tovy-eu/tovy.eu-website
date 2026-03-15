
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import '../globals.css';
import '../pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { CookieBanner } from '@/components/layout/cookie-banner';
import Script from 'next/script';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { HubSpotNavigationTracker } from '@/components/layout/hubspot-tracker';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  return {
    title: params.lang === 'nl' ? 'Tovy | Slimme Data Ecosystemen' : 'Tovy | Smart Data Ecosystems',
    description: 'We build smart data ecosystems that take work off your hands.',
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  return (
    <html lang={params.lang} style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <head>
        <Script id="google-consent-mode" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('consent', 'default', {
              'analytics_storage': 'denied',
              'ad_storage': 'denied',
              'ad_user_data': 'denied',
              'ad_personalization': 'denied',
              'wait_for_update': 500
            });
          `}
        </Script>
      </head>
      <body className={cn("font-body antialiased flex flex-col min-h-screen", poppins.className)}>
        <HubSpotNavigationTracker />
        <Header lang={params.lang} />
        <main className="flex-grow">
          {children}
        </main>
        <Footer lang={params.lang} />
        <Toaster />
        <CookieBanner />

        <Script
          id="hs-script-loader"
          strategy="afterInteractive"
          src="//js-eu1.hs-scripts.com/147968095.js"
          async
          defer
        />
      </body>
    </html>
  );
}
