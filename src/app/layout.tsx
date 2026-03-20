import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
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
    <html lang="en" style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body className={cn("font-sans antialiased flex flex-col min-h-screen", geistSans.variable)}>
        {/* Google tag (gtag.js) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ESH71F3XK7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            
            // Check localStorage for existing consent to prevent "denied-then-granted" flip
            var consentState = 'denied';
            try {
              var stored = localStorage.getItem('tovy-cookie-consent');
              if (stored) {
                var decision = JSON.parse(stored);
                if (decision && decision.granted) {
                  consentState = 'granted';
                }
              }
            } catch (e) {}

            gtag('consent', 'default', {
              'analytics_storage': consentState,
              'ad_storage': consentState,
              'ad_user_data': consentState,
              'ad_personalization': consentState,
              'wait_for_update': 500
            });

            gtag('js', new Date());
            gtag('config', 'G-ESH71F3XK7');
          `}
        </Script>
        
        {children}
        
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
