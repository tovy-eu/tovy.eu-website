'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';
import { getConsent, updateConsent } from '@/lib/consent';
import { grantConsent } from '@/lib/tracking';
import { usePathname } from 'next/navigation';
import type { Dictionary } from '@/lib/get-dictionary';

export default function CookieBanner({ dict }: { dict?: Dictionary }) {
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  useEffect(() => {
    const consent = getConsent();
    if (consent === null) {
      const timeoutId = setTimeout(() => {
        setShowBanner(true);
      }, 500); // Slight delay for better UX and to avoid hydration conflicts
      return () => clearTimeout(timeoutId);
    }
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    setShowBanner(false);
    grantConsent(); // Consent Mode v2: flip storage signals to granted
    window.dispatchEvent(new Event('consent-changed'));
  };

  const handleDecline = () => {
    updateConsent(false);
    setShowBanner(false);
    window.dispatchEvent(new Event('consent-changed'));
  };

  if (!showBanner) {
    return null;
  }

  const text = dict?.global?.cookieBanner?.text || "We use cookies to enhance your experience and for analytics purposes. By clicking \"Accept\", you agree to our use of cookies. For more details, see our";
  const privacyPolicy = dict?.global?.cookieBanner?.privacyPolicy || "Privacy Policy";
  const decline = dict?.global?.cookieBanner?.decline || "Decline";
  const accept = dict?.global?.cookieBanner?.accept || "Accept";

  return (
    <div
      className={cn(
        "fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm z-50 p-4 rounded-xl bg-background/90 backdrop-blur-md border border-border shadow-lg",
        "transition-all duration-500 ease-in-out",
        showBanner ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 mt-0.5 text-primary flex-shrink-0"/>
          <p className="text-sm text-muted-foreground">
            {text}{' '}
            <Link href={`/${lang}/privacy-policy/`} className="underline hover:text-primary">
              {privacyPolicy}
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 justify-end">
          <Button onClick={handleDecline} variant="secondary" size="sm">
            {decline}
          </Button>
          <Button onClick={handleAccept} size="sm">
            {accept}
          </Button>
        </div>
      </div>
    </div>
  );
}