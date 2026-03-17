
import { getSortedPostsData } from '@/lib/blog'
import { MetadataRoute } from 'next'
import { CONFIG } from '@/lib/config';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://tovy.eu'; 
  const languages = ['en', 'nl'];
  const posts = getSortedPostsData();

  const routes = [
    '',
    '/project-request',
    '/privacy-policy',
    '/legal-notice',
  ];

  if (CONFIG.enableBlog) {
    routes.push('/blog');
  }

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add localized routes for all main pages
  languages.forEach((lang) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${baseUrl}/${lang}${route}/`,
        lastModified: new Date(),
        changeFrequency: route === '/blog' ? 'weekly' : 'monthly',
        priority: route === '' ? 1.0 : 0.8,
      });
    });

    // Add localized routes for all blog posts if blog is enabled
    if (CONFIG.enableBlog) {
      posts.forEach((post) => {
        sitemapEntries.push({
          url: `${baseUrl}/${lang}/blog/${post.id}/`,
          lastModified: new Date(post.date),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      });
    }
  });

  return sitemapEntries;
}
