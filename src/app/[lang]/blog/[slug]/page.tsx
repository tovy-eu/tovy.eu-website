
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { SubscriptionForm } from '@/components/blog/subscription-form';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/get-dictionary';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  const langs = ['en', 'nl'];
  
  const params = [];
  for (const lang of langs) {
    for (const post of posts) {
      params.push({ lang, slug: post.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const postData = await getPostData(slug);
  
  if (!postData) {
    return {
      title: 'Post Not Found'
    };
  }
  
  return {
    title: `${postData.title} | Tovy`,
    description: postData.excerpt,
  };
}

export default async function BlogPost({ params }: Props) {
  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }
  
  const image = postData.image;

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4 md:px-8">
      <Card className="overflow-hidden bg-card/40 backdrop-blur-md border-none">
        {image && (
          <div className="relative w-full aspect-video">
            <Image
              src={image}
              alt={postData.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-4xl">{postData.title}</CardTitle>
          <CardDescription className="text-lg pt-2 flex items-center gap-2 flex-wrap">
            <span>{dict.blog.by} {postData.author}</span>
            <span>&bull;</span>
            <time dateTime={new Date(postData.date).toISOString()}>{format(new Date(postData.date), 'LLLL d, yyyy')}</time>
            {postData.readingTime && 
              <>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><BookOpen className="h-4 w-4" /> {postData.readingTime} {dict.blog.readingTime}</span>
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
          <Button asChild variant="outline" className="bg-card/40 border-none backdrop-blur-md hover:bg-white/10 text-foreground">
            <Link href={`/${lang}/blog/${postData.previousPost.id}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {dict.blog.previous}
            </Link>
          </Button>
        ) : <div />}
        {postData.nextPost ? (
          <Button asChild variant="outline" className="md:justify-self-end bg-card/40 border-none backdrop-blur-md hover:bg-white/10 text-foreground">
            <Link href={`/${lang}/blog/${postData.nextPost.id}`}>
              {dict.blog.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        ) : <div />}
      </div>

      <div className="mt-12">
        <SubscriptionForm dict={dict} />
      </div>
    </div>
  );
}
