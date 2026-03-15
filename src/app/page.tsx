
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root redirection page. 
 * Since middleware is not supported in 'output: export', we use a client-side redirect.
 */
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Detect browser language
    const preferredLanguage = navigator.language.split('-')[0];
    const supportedLanguages = ['en', 'nl'];
    const targetLang = supportedLanguages.includes(preferredLanguage) ? preferredLanguage : 'en';
    
    router.replace(`/${targetLang}/`);
  }, [router]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="animate-pulse text-primary font-bold text-2xl">Loading...</div>
    </div>
  );
}
