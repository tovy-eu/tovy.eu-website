
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import { SubscriptionForm } from '@/components/blog/subscription-form';
import { SectionDivider } from '@/components/landing/section-divider';
import { Badge } from '@/components/ui/badge';
import { BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Blog | Tovy',
  description: 'Articles on business automation and cognitive freedom from Tovy.',
};

export default function BlogHome() {
  const allPostsData = getSortedPostsData();

  if (allPostsData.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Blog</h1>
        <p className="text-lg text-muted-foreground mt-4">No blog posts found. Check back soon!</p>
      </div>
    );
  }

  const featuredPost = allPostsData[0];
  const otherPosts = allPostsData.slice(1);
  const featuredImage = featuredPost.image;

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Articles on business automation and cognitive freedom by Tovy.</p>
      </div>
      
      {/* Featured Post */}
      <div className="mb-16">
        <Link href={`/blog/${featuredPost.id}`} className="block group">
          <Card className="grid md:grid-cols-2 overflow-hidden transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
            {featuredImage && (
              <div className="relative w-full aspect-video md:aspect-auto">
                <Image
                  src={featuredImage}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
            <div className="flex flex-col p-6">
              <CardHeader>
                <CardTitle className="text-2xl lg:text-3xl group-hover:text-primary transition-colors text-foreground">{featuredPost.title}</CardTitle>
                <CardDescription>
                  <time dateTime={new Date(featuredPost.date).toISOString()}>{format(new Date(featuredPost.date), 'LLLL d, yyyy')}</time> &bull; {featuredPost.author}
                   {featuredPost.readingTime && <span className="flex items-center gap-1 mt-1"><BookOpen className="h-4 w-4" /> {featuredPost.readingTime} min read</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{featuredPost.excerpt}</p>
                {featuredPost.tags && featuredPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-4">
                    {featuredPost.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </div>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {otherPosts.map(({ id, date, title, excerpt, author, image, tags, readingTime }) => {
          return (
            <Link href={`/blog/${id}`} key={id} className="block group">
              <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1 overflow-hidden">
                {image && (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors text-foreground">{title}</CardTitle>
                  <CardDescription>
                    <time dateTime={new Date(date).toISOString()}>{format(new Date(date), 'LLLL d, yyyy')}</time> &bull; {author}
                    {readingTime && <span className="flex items-center gap-1 mt-1"><BookOpen className="h-4 w-4" /> {readingTime} min read</span>}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{excerpt}</p>
                  {tags && tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-4">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="my-16">
        <SectionDivider />
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
}
