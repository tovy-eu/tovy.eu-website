'use client';

import Script from 'next/script';
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
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          '/metrics/?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-TSG26723');
        `}
      </Script>
      <noscript>
        <iframe
          src="/metrics/ns.html?id=GTM-TSG26723"
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
