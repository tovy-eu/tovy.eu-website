import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE_URL;
  const languages = ['en', 'nl', 'es', 'de'];
  const routes = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' as const },
    { path: '/project-request', priority: 0.9, changeFrequency: 'monthly' as const },
    { path: '/privacy-policy', priority: 0.5, changeFrequency: 'yearly' as const },
    { path: '/legal-notice', priority: 0.5, changeFrequency: 'yearly' as const },
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route.path}/`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    });
  });

  return sitemapEntries;
}
