'use client';

import { useState, useEffect } from 'react';
import { getConsent } from '@/lib/consent';

export function useCookieConsent() {
  const [hasCookieConsent, setHasCookieConsent] = useState(false);

  useEffect(() => {
    const consent = getConsent();
    const isGranted = consent?.granted ?? false;
    
    // Defer update to avoid synchronous state update warning during hydration
    const timeoutId = setTimeout(() => {
      setHasCookieConsent(isGranted);
    }, 0);

    const handleConsentChange = () => {
      const newConsent = getConsent();
      setHasCookieConsent(newConsent?.granted ?? false);
    };

    window.addEventListener('consent-changed', handleConsentChange);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('consent-changed', handleConsentChange);
    };
  }, []);

  return { hasCookieConsent };
}
