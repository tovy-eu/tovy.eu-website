"use client";

import { useCookieConsent } from "@/hooks/use-cookie-consent";
import Script from "next/script";

// The GTM ID for your container.
const GTM_ID = "GTM-TSG26723";

/**
 * Renders the Google Tag Manager (GTM) script.
 * 
 * This implementation is privacy-first. The GTM script is only rendered
 * if the user has consented to analytics cookies.
 * 
 * It uses the standard GTM script loader, which fetches the gtm.js library
 * directly from Google's servers. The server-side proxying is handled by
 * the `transport_url` setting within the GTM container's configuration,
 * not by altering this script.
 *
 * @returns The GTM script tag, or null if consent has not been given.
 */
export default function GtmScript() {
  const { hasCookieConsent } = useCookieConsent();

  // Only render the GTM script if the user has consented to analytics.
  if (!hasCookieConsent) {
    return null;
  }

  return (
    <>
      {/* Standard Google Tag Manager script */}
      <Script id="google-tag-manager" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </Script>
      {/* Standard GTM noscript fallback */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
          height="0"
          width="0"
          style={{ display: 'none', visibility: 'hidden' }}
        />
      </noscript>
    </>
  );
}
