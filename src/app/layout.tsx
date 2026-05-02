import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import CookieBanner from '@/components/layout/cookie-banner';
import GtmScript from '@/components/layout/gtm-script';


export const metadata: Metadata = {
  metadataBase: new URL('https://tovy.eu'),
};

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className={cn("font-sans antialiased flex flex-col min-h-screen", geistSans.variable)}>
        <GtmScript />
        {children}
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
