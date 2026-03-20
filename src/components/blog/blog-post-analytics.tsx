'use client';

import { useEffect } from 'react';

interface BlogPostAnalyticsProps {
  slug: string;
  title: string;
}

/**
 * A client-side component that tracks blog post views.
 * It uses the global window.gtag function established in the root layout.
 */
export function BlogPostAnalytics({ slug, title }: BlogPostAnalyticsProps) {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'blog_post_view', {
        event_category: 'engagement',
        event_label: 'Blog Post Viewed',
        blog_slug: slug,
        blog_title: title,
      });
    }
  }, [slug, title]);

  return null; // This component doesn't render anything visible
}
