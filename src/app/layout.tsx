import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import GtmScript from '@/components/layout/gtm-script';


export const metadata: Metadata = {
  metadataBase: new URL('https://tovy.eu'),
  title: {
    template: 'Tovy | %s',
    default: 'Tovy | Shaping the Future of Data',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen", GeistSans.variable, GeistMono.variable)}>
        <GtmScript />
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
