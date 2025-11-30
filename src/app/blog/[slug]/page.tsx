
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { SubscriptionForm } from '@/components/blog/subscription-form';
import type { Metadata } from 'next';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  try {
    const posts = getSortedPostsData();
    if (!posts || posts.length === 0) {
      return [];
    }
    return posts.map(post => ({
      slug: post.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for blog:", error);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const postData = await getPostData(slug);
  if (!postData) {
    return {
      title: 'Post Not Found'
    }
  }
  return {
    title: `${postData.title} | Tovy`,
    description: postData.excerpt,
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = params;
  const postData = await getPostData(slug);

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
          <CardDescription className="text-lg pt-2 flex items-center gap-2 flex-wrap">
            <span>{postData.author}</span>
            <span>&bull;</span>
            <time dateTime={new Date(postData.date).toISOString()}>{format(new Date(postData.date), 'LLLL d, yyyy')}</time>
            {postData.readingTime && 
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {postData.readingTime} min read</span>
              </>
            }
          </CardDescription>
           {postData.tags && postData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {postData.tags.map(tag => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
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
      
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {postData.previousPost ? (
          <Button asChild variant="outline">
            <Link href={`/blog/${postData.previousPost.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Link>
          </Button>
        ) : <div />}
        {postData.nextPost ? (
          <Button asChild variant="outline" className="md:justify-self-end">
            <Link href={`/blog/${postData.nextPost.id}`}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : <div />}
      </div>

      <div className="mt-12">
        <SubscriptionForm />
      </div>
    </div>
  );
}
