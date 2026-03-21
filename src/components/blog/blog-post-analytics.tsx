'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface BlogPostAnalyticsProps {
  slug: string;
  title: string;
}

/**
 * A client-side component that tracks blog post views using the type-safe utility.
 */
export function BlogPostAnalytics({ slug, title }: BlogPostAnalyticsProps) {
  useEffect(() => {
    trackEvent({
      name: 'blog_post_view',
      event_category: 'engagement',
      event_label: 'Blog Post Viewed',
      blog_slug: slug,
      blog_title: title,
    });
  }, [slug, title]);

  return null;
}
