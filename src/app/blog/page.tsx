import Link from 'next/link';
import { getSortedPostsData } from '@/lib/blog';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function BlogHome() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto max-w-4xl py-12 px-4 md:px-8">
      <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">Tovy Blog</h1>
      <div className="grid gap-8">
        {allPostsData.map(({ id, date, title, excerpt }) => (
          <Link href={`/blog/${id}`} key={id}>
            <Card className="hover:border-primary transition-colors">
              <CardHeader>
                <CardTitle className="text-2xl">{title}</CardTitle>
                <CardDescription>
                  <time dateTime={date}>{format(new Date(date), 'LLLL d, yyyy')}</time>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{excerpt}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
