'use client';

import { useState, useEffect } from 'react';
import { getConsent } from '@/lib/consent';

export function useCookieConsent() {
  const [hasCookieConsent, setHasCookieConsent] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    setHasCookieConsent(consent?.granted ?? false);

    const handleConsentChange = () => {
      const newConsent = getConsent();
      setHasCookieConsent(newConsent?.granted ?? false);
    };

    window.addEventListener('consent-changed', handleConsentChange);

    return () => {
      window.removeEventListener('consent-changed', handleConsentChange);
    };
  }, []);

  return { hasCookieConsent };
}
