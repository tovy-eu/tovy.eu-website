
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { SubscriptionForm } from '@/components/blog/subscription-form';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

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
  
  const image = PlaceHolderImages.find(img => img.id === postData.image_id);

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-8">
      <Card className="overflow-hidden">
        {image && (
          <div className="relative w-full aspect-video">
            <Image
              src={image.imageUrl}
              alt={postData.title}
              fill
              className="object-cover"
              data-ai-hint={image.imageHint}
            />
          </div>
        )}
        <CardHeader className="border-b">
          <CardTitle className="text-4xl">{postData.title}</CardTitle>
          <CardDescription className="text-lg pt-2">
            {postData.author} &bull; <time dateTime={new Date(postData.date).toISOString()}>{format(new Date(postData.date), 'LLLL d, yyyy')}</time>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <article>
            <div 
              className="prose dark:prose-invert lg:prose-xl max-w-none"
              dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
            />
          </article>
        </CardContent>
      </Card>

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </div>
  );
}
