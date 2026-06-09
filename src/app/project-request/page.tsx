import type { Metadata } from 'next';
import en from '@/dictionaries/en.json';

export const metadata: Metadata = {
  title: en.redirects.projectRequestTitle,
  description: en.redirects.description,
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: 'https://tovy.eu/en/project-request/',
  }
};

/**
 * Root project request redirection page. 
 * Optimized for static export by using an inline script to detect language and redirect 
 * as early as possible. This approach is safest for 'output: export' environments.
 */
export default function ProjectRequestRootPage() {
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
                window.location.replace('/' + target + '/project-request/' + search);
              } catch (e) {
                // Fallback to English if any error occurs
                window.location.replace('/en/project-request/' + (window.location.search || ''));
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
