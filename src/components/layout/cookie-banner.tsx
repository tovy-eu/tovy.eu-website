
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Cookie } from 'lucide-react';
import { getConsent, updateConsent } from '@/lib/consent';

export function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // This code only runs on the client
    const consent = getConsent();
    if (consent === null) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    updateConsent(true);
    setShowBanner(false);
  };

  const handleDecline = () => {
    updateConsent(false);
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-lg",
        "transition-transform duration-500 ease-in-out",
        showBanner ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="container mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Cookie className="h-5 w-5 mt-1 text-primary flex-shrink-0"/>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your experience and for analytics purposes. By clicking "Accept", you agree to our use of cookies. For more details, see our{' '}
            <Link href="/privacy-policy" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0 w-full sm:w-auto">
          <Button onClick={handleDecline} variant="secondary" size="sm" className="flex-grow sm:flex-grow-0">
            Decline
          </Button>
          <Button onClick={handleAccept} size="sm" className="flex-grow sm:flex-grow-0">
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
