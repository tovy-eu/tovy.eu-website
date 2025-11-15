import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { SubscriptionForm } from '@/components/blog/subscription-form';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map(post => ({
    slug: post.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const postData = await getPostData(params.slug);
  if (!postData) {
    return {
      title: 'Post Not Found'
    }
  }
  return {
    title: `${postData.title} | Tovy AI`,
    description: postData.excerpt,
  }
}

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);

  if (!postData) {
    notFound();
  }

  return (
    <>
    <article className="container mx-auto max-w-3xl py-12 px-4 md:px-8">
      <h1 className="text-4xl font-bold mb-2 text-foreground">{postData.title}</h1>
      <p className="text-muted-foreground text-lg">
        <time dateTime={new Date(postData.date).toISOString()}>{format(new Date(postData.date), 'LLLL d, yyyy')}</time>
      </p>
      <div 
        className="prose dark:prose-invert lg:prose-xl max-w-none mt-8"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
      />
    </article>
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-8">
        <SubscriptionForm />
    </div>
    </>
  );
}
