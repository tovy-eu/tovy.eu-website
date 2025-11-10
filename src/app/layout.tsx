import type { Metadata } from 'next';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { PageLayout } from '@/components/layout/page-layout';

export const metadata: Metadata = {
  title: 'Tovy AI Partner',
  description: 'Uw AI-ontwikkelingspartner voor schone, snelle en betrouwbare systemen.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" style={{ scrollBehavior: 'smooth' }}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen">
        <PageLayout>
          {children}
        </PageLayout>
        <Toaster />
      </body>
    </html>
  );
}
