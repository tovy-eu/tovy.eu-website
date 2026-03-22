import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import Script from 'next/script';
import { GoogleTagManager } from '@next/third-parties/google';
import { WebVitals } from '@/components/layout/web-vitals';

const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';

export const metadata: Metadata = {
  title: {
    default: 'Tovy | Smart Data Ecosystems for Business Growth',
    template: '%s | Tovy'
  },
  description: 'We build smart data ecosystems that take work off your hands, creating a world where technology gives people more time, focus, and freedom to grow.',
  metadataBase: new URL('https://tovy.eu'),
  other: {
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.googletagmanager.com https://www.google-analytics.com https://images.unsplash.com https://picsum.photos; connect-src 'self' https://www.google-analytics.com https://stats.g.doubleclick.net https://region1.google-analytics.com; frame-src 'self' https://www.googletagmanager.com; font-src 'self' data:;",
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://tovy.eu',
    siteName: 'Tovy',
    title: 'Tovy | Smart Data Ecosystems',
    description: 'Smart data ecosystems and AI foundations for modern business growth.',
    images: [
      {
        url: defaultOgImage,
        width: 1200,
        height: 630,
        alt: 'Tovy - AI & Data Engineering',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tovy | Smart Data Ecosystems',
    description: 'Smart data ecosystems and AI foundations for modern business growth.',
    images: [defaultOgImage],
  },
};

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen", geistSans.variable)}>
        <GoogleTagManager gtmId="GTM-TSG26723" />
        
        {/* Google Tag Manager (noscript) fallback */}
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSG26723"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {/* Consent Mode v2 Initialization Script - Runs before tags fire */}
        <Script
          id="google-consent-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              
              /* Set default consent state immediately from localStorage if available */
              var storedConsent = 'denied';
              try {
                var stored = localStorage.getItem('tovy-cookie-consent');
                if (stored) {
                  var decision = JSON.parse(stored);
                  if (decision && decision.granted) {
                    storedConsent = 'granted';
                  }
                }
              } catch (e) {}

              gtag('consent', 'default', {
                'analytics_storage': storedConsent,
                'ad_storage': storedConsent,
                'ad_user_data': storedConsent,
                'ad_personalization': storedConsent,
                'wait_for_update': 500
              });
            `
          }}
        />
        
        <WebVitals />
        
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
