import { getSortedPostsData } from '@/lib/blog'
import { MetadataRoute } from 'next'
import { CONFIG, SITE_URL } from '@/lib/config';

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

  if (CONFIG.enableBlog) {
    routes.push({ path: '/kx', priority: 0.7, changeFrequency: 'weekly' as const });
  }

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

    if (CONFIG.enableBlog) {
      const posts = getSortedPostsData(lang);
      posts.forEach((post) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/kx/${post.id}/`,
          lastModified: new Date(post.date),
          changeFrequency: 'never' as const,
          priority: 0.6,
        });
      });
    }
  });

  return sitemapEntries;
}
