import { getSortedPostsData } from '@/lib/blog';
import { redirect } from 'next/navigation';

/**
 * generateStaticParams is required for dynamic routes when using 'output: export'.
 */
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default function BlogPostRoot() {
  redirect('/en/blog/');
}
