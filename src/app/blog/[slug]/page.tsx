import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { SubscriptionForm } from '@/components/blog/subscription-form';

export function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map(post => ({
    slug: post.id,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
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
    <article className="container mx-auto max-w-3xl py-12 px-4 md:px-8 prose dark:prose-invert lg:prose-xl">
      <h1 className="mb-2">{postData.title}</h1>
      <p className="text-muted-foreground text-lg">
        <time dateTime={postData.date}>{format(new Date(postData.date), 'LLLL d, yyyy')}</time>
      </p>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-8">
        <SubscriptionForm />
    </div>
    </>
  );
}
