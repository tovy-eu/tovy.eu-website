import { getSortedPostsData } from '@/lib/blog'
import { MetadataRoute } from 'next'
import { CONFIG } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tovy.eu'; 
  const languages = ['en', 'nl'];

  const routes = [
    '',
    '/project-request',
    '/privacy-policy',
    '/legal-notice',
  ];

  if (CONFIG.enableBlog) {
    routes.push('/kx');
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}/`,
        lastModified: new Date(),
        changeFrequency: route === '/kx' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });

    if (CONFIG.enableBlog) {
      const posts = getSortedPostsData(lang);
      posts.forEach((post) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/kx/${post.id}/`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  });

  return sitemapEntries;
}
