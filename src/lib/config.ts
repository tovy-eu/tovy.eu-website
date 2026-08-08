export const CONFIG = {};

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'nl', 'es', 'de'],
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.tovy.eu';
