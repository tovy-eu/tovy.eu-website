/**
 * Central configuration for application features.
 * Set enableBlog to false to hide the blog from the UI and sitemap.
 */
export const CONFIG = {
  enableBlog: false,
};

export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'nl', 'es', 'de'],
} as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tovy.eu';
