// src/lib/metadata.ts

import { i18n, SITE_URL } from '@/lib/config';
import { Metadata } from 'next';

/**
 * Generates the 'alternates' metadata object for hreflang tags.
 * This helps search engines understand the relationship between language-specific pages.
 * @param path - The page's path without the locale prefix (e.g., '/kx/some-post').
 * @param lang - The current language of the page.
 * @returns A Next.js Metadata['alternates'] object.
 */
export function generateAlternates(path: string, lang: string): Metadata['alternates'] {
  let formattedPath = path.startsWith('/') ? path : `/${path}`;
  if (!formattedPath.endsWith('/')) {
    formattedPath = `${formattedPath}/`;
  }

  return {
    canonical: `${SITE_URL}/${lang}${formattedPath}`,
    languages: {
      'en': `${SITE_URL}/en${formattedPath}`,
      'nl': `${SITE_URL}/nl${formattedPath}`,
      'x-default': `${SITE_URL}/${i18n.defaultLocale}${formattedPath}`,
    },
  };
}
