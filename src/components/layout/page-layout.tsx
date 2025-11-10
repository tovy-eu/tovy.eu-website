"use client";

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isProjectRequestPage = pathname === '/project-request';

  return (
    <>
      {!isProjectRequestPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isProjectRequestPage && <Footer />}
    </>
  );
}
