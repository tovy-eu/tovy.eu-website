
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { PageLayout } from '@/components/layout/page-layout';
import { cn } from '@/lib/utils';
import { CookieBanner } from '@/components/layout/cookie-banner';

export const metadata: Metadata = {
  title: 'Tovy | Smart Data Ecosystems for Business Growth',
  description: 'We build smart data ecosystems that take work off your hands, creating a world where technology gives people more time, focus, and freedom to grow.',
};

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }} data-scroll-behavior="smooth">
      <body className={cn("font-body antialiased flex flex-col min-h-screen", poppins.className)}>
        <PageLayout>
          {children}
        </PageLayout>
        <Toaster />
        <CookieBanner />
      </body>
    </html>
  );
}
