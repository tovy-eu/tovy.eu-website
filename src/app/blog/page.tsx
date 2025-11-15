import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import { SubscriptionForm } from '@/components/blog/subscription-form';

export const metadata: Metadata = {
  title: 'Blog | Tovy AI',
  description: 'Insights and articles on AI system development, business automation, and cognitive freedom from Tovy AI.',
};

export default function BlogHome() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto max-w-5xl py-12 px-4 md:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">Tovy Blog</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Insights on AI automation, business optimization, and achieving cognitive freedom.</p>
      </div>
      
      <div className="mb-16">
        <SubscriptionForm />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {allPostsData.map(({ id, date, title, excerpt }) => (
          <Link href={`/blog/${id}`} key={id} className="block group">
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="text-xl lg:text-2xl group-hover:text-primary transition-colors">{title}</CardTitle>
                <CardDescription>
                  <time dateTime={date}>{format(new Date(date), 'LLLL d, yyyy')}</time>
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground">{excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
