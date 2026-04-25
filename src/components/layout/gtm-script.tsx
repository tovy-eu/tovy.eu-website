'use client';

import { GoogleTagManager } from '@next/third-parties/google';
import { getConsent } from '@/lib/consent';
import { useEffect, useState } from 'react';

export default function GtmScript() {
  const [consentGranted, setConsentGranted] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = getConsent();
      const isGranted = consent?.granted || false;
      if (isGranted !== consentGranted) {
        setConsentGranted(isGranted);
      }
    };

    checkConsent();

    window.addEventListener('storage', checkConsent);
    window.addEventListener('consent-changed', checkConsent);

    return () => {
      window.removeEventListener('storage', checkConsent);
      window.removeEventListener('consent-changed', checkConsent);
    };
  }, [consentGranted]);

  if (!consentGranted) {
    return null;
  }

  return (
    <>
      <GoogleTagManager gtmId="GTM-TSG26723" />
      <noscript>
        <iframe
          src="https://www.googletagmanager.com/ns.html?id=GTM-TSG26723"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
