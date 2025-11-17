import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import './pain-solution-texture.css';
import { Toaster } from "@/components/ui/toaster"
import { PageLayout } from '@/components/layout/page-layout';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Tovy AI | Custom AI Systems for Business Automation',
  description: 'We build clean, fast, and reliable AI systems that give you full control and turn manual labor into cognitive freedom.',
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
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={cn("font-body antialiased flex flex-col min-h-screen", poppins.className)}>
        <PageLayout>
          {children}
        </PageLayout>
        <Toaster />
      </body>
    </html>
  );
}
