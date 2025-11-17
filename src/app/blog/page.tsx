
import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import { SubscriptionForm } from '@/components/blog/subscription-form';

export const metadata: Metadata = {
  title: 'Blog | Tovy',
  description: 'Articles on business automation and cognitive freedom from Tovy.',
};

export default function BlogHome() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Articles on business automation and cognitive freedom by Tovy.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {allPostsData.map(({ id, date, title, excerpt, author }) => (
          <Link href={`/blog/${id}`} key={id} className="block group">
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors text-foreground">{title}</CardTitle>
                <CardDescription>
                  <time dateTime={new Date(date).toISOString()}>{format(new Date(date), 'LLLL d, yyyy')}</time> &bull; {author}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="w-full flex justify-center">
        <div className="w-full max-w-2xl">
          <SubscriptionForm />
        </div>
      </div>
    </div>
  );
}
