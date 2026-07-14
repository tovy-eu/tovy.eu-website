import type { Metadata } from 'next';
import en from '@/dictionaries/en.json';

export const metadata: Metadata = {
  title: en.pages.paymentSuccess.metadata.title,
  description: en.pages.paymentSuccess.metadata.description,
  alternates: {
    canonical: 'https://www.tovy.eu/en/payment-success/',
  },
  robots: 'noindex, follow',
};

/**
 * Root payment success redirection page. 
 * Optimized for static export by using an inline script to detect language and redirect 
 * as early as possible. This approach is safest for 'output: export' environments.
 */
export default function PaymentSuccessRootPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a1120]">
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
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
                window.location.replace('/' + target + '/payment-success/' + search);
              } catch (e) {
                // Fallback to English if any error occurs
                window.location.replace('/en/payment-success/' + (window.location.search || ''));
              }
            })();
          `,
        }}
      />
    </div>
  );
}
