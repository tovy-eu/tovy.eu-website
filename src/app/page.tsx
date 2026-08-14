import type { Metadata } from 'next';
import en from '@/dictionaries/en.json';

export const metadata: Metadata = {
  title: en.global.redirects.title,
  description: en.global.redirects.description,
  alternates: {
    canonical: 'https://www.tovy.eu/en/',
  }
};

/**
 * Root redirection page. 
 * Optimized for static export by using an inline script to detect language and redirect 
 * as early as possible. This approach is safest for 'output: export' environments.
 */
export default function RootPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a1120]">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                // Stash the real external referrer before the client-side redirect below,
                // which would otherwise make the destination see our own domain (self-referral).
                if (!sessionStorage.getItem('tovy_entry_referrer') && document.referrer) {
                  sessionStorage.setItem('tovy_entry_referrer', document.referrer);
                }
                var target = 'en'; // Default language
                var supported = ['en', 'nl', 'es', 'de'];
                var cookieLang = (document.cookie.match(/^(?:.*;)?NEXT_LOCALE=([^;]+)(?:.*)?$/) || [, ''])[1];

                if (cookieLang && supported.includes(cookieLang)) {
                  target = cookieLang;
                } else {
                  var browserLang = navigator.language.split('-')[0];
                  if (supported.includes(browserLang)) {
                    target = browserLang;
                  }
                  // Set the cookie if not already set or invalid
                  document.cookie = 'NEXT_LOCALE=' + target + '; Path=/; Max-Age=' + (365 * 24 * 60 * 60) + '; Secure; SameSite=Lax';
                }
                var search = window.location.search || '';
                window.location.replace('/' + target + '/' + search);
              } catch (e) {
                // Fallback to English if any error occurs
                window.location.replace('/en/' + (window.location.search || ''));
              }
            })();
          `,
        }}
      />
      {/* 
        The page is intentionally left blank of text to prevent a "Loading..." flicker.
        The background color matches the site's theme for a seamless transition.
      */}
    </div>
  );
}
