
import { getPostData, getSortedPostsData } from '@/lib/blog';
import { notFound } from 'next/navigation';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getDictionary } from '@/lib/get-dictionary';
import { CONFIG } from '@/lib/config';
import { BlogPostAnalytics } from '@/components/blog/blog-post-analytics';
import { WavyLines } from '@/components/landing/wavy-lines';
import { Magnetic } from '@/components/ui/magnetic';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';

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
  const { lang, slug } = await params;
  const postData = await getPostData(slug);
  const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';
  
  if (!postData) {
    return {
      title: 'Resource Not Found'
    };
  }
  
  const ogImage = postData.image || defaultOgImage;

  return {
    title: postData.title,
    description: postData.excerpt,
    alternates: {
      canonical: `/${lang}/kx/${slug}/`,
      languages: {
        'en': `/en/kx/${slug}/`,
        'nl': `/nl/kx/${slug}/`,
      },
    },
    openGraph: {
      title: `${postData.title} | Tovy Knowledge Exchange Hub`,
      description: postData.excerpt,
      type: 'article',
      publishedTime: postData.date,
      authors: [postData.author],
      images: [{ url: ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.excerpt,
      images: [ogImage],
    },
  };
}

export default async function KxResource({ params }: Props) {
  if (!CONFIG.enableBlog) {
    notFound();
  }

  const { lang, slug } = await params;
  const dict = await getDictionary(lang);
  const postData = await getPostData(slug);

  if (!postData) {
    notFound();
  }
  
  const image = postData.image;
  const dateObj = new Date(postData.date);
  const displayDate = isValid(dateObj) ? format(dateObj, 'LLLL d, yyyy') : 'Recently';

  const breadcrumbs = [
    { name: 'Home', item: `/${lang}/` },
    { name: 'Knowledge Exchange Hub', item: `/${lang}/kx/` },
    { name: postData.title, item: `/${lang}/kx/${slug}/` },
  ];

  return (
    <div 
      className="relative flex flex-col min-h-screen pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-4xl">
        {/* Client-side analytics component to track the view */}
        <BlogPostAnalytics slug={slug} title={postData.title} />

        <div className="mb-8">
          <Button asChild variant="ghost" className="hover:bg-white/10 text-white/60 hover:text-white transition-colors">
            <Link href={`/${lang}/kx/`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Knowledge Exchange Hub
            </Link>
          </Button>
        </div>

        <Card className="overflow-hidden bg-card/40 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl">
          {image && (
            <div className="relative w-full aspect-video">
              <Image
                src={image}
                alt={postData.title}
                fill
                className="object-cover"
                priority // LCP optimization for the main article image
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          )}
          <CardHeader className="p-8 md:p-12 border-b border-white/5">
            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 border-primary/20 text-primary-foreground text-[10px] uppercase tracking-wider">{tag}</Badge>
              ))}
            </div>
            <CardTitle className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-6" asChild>
              <h1>{postData.title}</h1>
            </CardTitle>
            <CardDescription className="text-base md:text-lg flex items-center gap-4 flex-wrap text-white/50" asChild>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{postData.author}</span>
                  <span>&bull;</span>
                  <time dateTime={isValid(dateObj) ? dateObj.toISOString() : undefined}>{displayDate}</time>
                </div>
                {postData.readingTime && (
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{postData.readingTime} {dict.blog.readingTime}</span>
                  </div>
                )}
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 md:p-12 lg:p-16">
            <article>
              <div 
                className="prose dark:prose-invert prose-lg md:prose-xl max-w-none 
                prose-headings:text-white prose-headings:font-bold 
                prose-p:text-white/70 prose-p:leading-relaxed 
                prose-strong:text-white prose-a:text-primary hover:prose-a:text-primary/80 
                prose-blockquote:border-primary prose-blockquote:bg-white/5 prose-blockquote:p-6 prose-blockquote:rounded-r-lg
                prose-img:rounded-2xl prose-img:shadow-2xl mb-16"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
              />
            </article>

            {/* CTA Section */}
            <div className="mt-16 pt-16 border-t border-white/5 text-center">
              <div className="max-w-xl mx-auto">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  {lang === 'en' ? 'Ready to scale your data ecosystem?' : 'Klaar om je data-ecosysteem op te schalen?'}
                </h3>
                <p className="text-white/60 mb-10 text-lg leading-relaxed">
                  {lang === 'en' 
                    ? 'Let’s build a foundation that gives your team more time, focus, and freedom to grow.' 
                    : 'Laten we een fundament bouwen dat je team meer tijd, focus en ruimte geeft om te groeien.'}
                </p>
                <div className="flex justify-center">
                  <Magnetic strength={0.25}>
                    <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-base sm:text-lg h-12 sm:h-14 shadow-2xl px-10">
                      <Link href={`/${lang}/project-request/`}>
                        {dict.common.workWithUs}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </Magnetic>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          {postData.previousPost ? (
            <Link href={`/${lang}/kx/${postData.previousPost.id}/`} className="group">
              <Card className="h-full bg-card/20 backdrop-blur-md border border-white/5 hover:border-primary/50 transition-all p-6 group-hover:bg-card/40">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Previous</p>
                <h4 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-2">{postData.previousPost.title}</h4>
              </Card>
            </Link>
          ) : <div />}
          
          {postData.nextPost ? (
            <Link href={`/${lang}/kx/${postData.nextPost.id}/`} className="group">
              <Card className="h-full bg-card/20 backdrop-blur-md border border-white/5 hover:border-primary/50 transition-all p-6 text-right group-hover:bg-card/40">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">Next</p>
                <h4 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-2">{postData.nextPost.title}</h4>
              </Card>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
