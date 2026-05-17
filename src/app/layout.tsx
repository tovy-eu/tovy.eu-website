import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import { GtmScriptHead, GtmScriptBody } from '@/components/layout/gtm-script';

export const metadata: Metadata = {
  metadataBase: new URL('https://tovy.eu'),
  title: 'Tovy',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} scroll-smooth`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <GtmScriptHead />
      </head>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen")}>
        <GtmScriptBody />
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
