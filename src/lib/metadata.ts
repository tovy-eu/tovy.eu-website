import { i18n, SITE_URL } from '@/lib/config';
import { Metadata } from 'next';

export function alternates(path: string, lang: string): Metadata['alternates'] {
  const p = `${path.startsWith('/') ? path : `/${path}`}`.replace(/\/?$/, '/');
  return {
    canonical: `${SITE_URL}/${lang}${p}`,
    languages: {
      ...Object.fromEntries(i18n.locales.map((l) => [l, `${SITE_URL}/${l}${p}`])),
      'x-default': `${SITE_URL}/${i18n.defaultLocale}${p}`,
    },
  };
}
