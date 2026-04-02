import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import { GoogleTagManager } from '@next/third-parties/google';
import { WebVitals } from '@/components/layout/web-vitals';
import Script from 'next/script';

const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';

export const metadata: Metadata = {
  title: {
    default: 'Tovy | Smart Data Ecosystems for Business Growth',
    template: '%s | Tovy'
  },
  description: 'We build smart data ecosystems that take work off your hands, creating a world where technology gives people more time, focus, and freedom to grow.',
  metadataBase: new URL('https://tovy.eu'),
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
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen", geistSans.variable)}>
        {/* CSP Meta Tag - Expanded connect-src and img-src for Firebase and Google services */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://www.googletagmanager.com https://*.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com https://images.unsplash.com https://picsum.photos; connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com https://stats.g.doubleclick.net https://*.googletagmanager.com https://*.googleapis.com https://*.firebase.com https://*.firebaseio.com; frame-src 'self' https://www.googletagmanager.com https://*.googletagmanager.com; font-src 'self' data:;" 
        />
        
        {/* Consent Mode v2 Initialization */}
        <Script
          id="gtm-consent-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              
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

        <GoogleTagManager gtmId="GTM-TSG26723" />
        
        <noscript>
          <iframe 
            src="https://www.googletagmanager.com/ns.html?id=GTM-TSG26723"
            height="0" 
            width="0" 
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        
        <WebVitals />
        
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
