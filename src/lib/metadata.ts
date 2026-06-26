import { i18n, SITE_URL } from '@/lib/config';
import { Metadata } from 'next';

// ponytail: 4 static language codes. inline if complexity increases.
export function alternates(path: string, lang: string): Metadata['alternates'] {
  const p = `${path.startsWith('/') ? path : `/${path}`}`.replace(/\/?$/, '/');
  return {
    canonical: `${SITE_URL}/${lang}${p}`,
    languages: {
      'en': `${SITE_URL}/en${p}`,
      'nl': `${SITE_URL}/nl${p}`,
      'es': `${SITE_URL}/es${p}`,
      'de': `${SITE_URL}/de${p}`,
      'x-default': `${SITE_URL}/${i18n.defaultLocale}${p}`,
    },
  };
}
