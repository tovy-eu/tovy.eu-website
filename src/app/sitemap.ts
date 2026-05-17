import { getSortedPostsData } from '@/lib/blog'
import { MetadataRoute } from 'next'
import { CONFIG } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.tovy.eu'; 
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
        url: `${baseUrl}/${lang}${route}/`
      });
    });

    if (CONFIG.enableBlog) {
      const posts = getSortedPostsData(lang);
      posts.forEach((post) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/kx/${post.id}/`,
          lastModified: new Date(post.date),
        });
      });
    }
  });

  return sitemapEntries;
}
