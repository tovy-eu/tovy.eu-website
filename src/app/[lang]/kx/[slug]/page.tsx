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
import { WavyLines } from '@/components/landing/wavy-lines';
import { Magnetic } from '@/components/ui/magnetic';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';
import person from '@/content/person.json';

type Props = {
  params: Promise<{ lang: string; slug: string }>;
};

export async function generateStaticParams() {
  const langs = ['en', 'nl'];
  const params = [];
  
  for (const lang of langs) {
    const posts = getSortedPostsData(lang);
    for (const post of posts) {
      params.push({ lang, slug: post.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  const postData = await getPostData(slug, lang);
  const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';
  
  if (!postData) {
    return {
      title: 'Resource Not Found'
    };
  }
  
  const ogImage = postData.image || defaultOgImage;
  const path = `/kx/${slug}`;

  return {
    title: postData.title,
    description: postData.excerpt,
    alternates: generateAlternates(path, lang),
    openGraph: {
      title: postData.title,
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
  const postData = await getPostData(slug, lang);

  if (!postData) {
    notFound();
  }
  
  const image = postData.image;
  const dateObj = new Date(postData.date);
  const displayDate = isValid(dateObj) ? format(dateObj, 'LLLL d, yyyy') : 'Recently';
  const authorProfile = person;

  const breadcrumbs = [
    { name: 'Home', item: `/${lang}/` },
    { name: 'Knowledge Exchange', item: `/${lang}/kx/` },
    { name: postData.title, item: `/${lang}/kx/${slug}/` },
  ];

  return (
    <div 
      className="relative flex flex-col min-h-screen pt-16 md:pt-28 pb-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      {/* max-w-[680px] for desktop focus; px-0 ensures card touches edges on mobile */}
      <div className="w-full relative z-10 mx-auto max-w-[680px] flex flex-col gap-4 md:gap-6 px-0 md:px-4">

        <Card className="overflow-hidden bg-card/40 backdrop-blur-2xl border-x-0 border-y md:border border-white/10 shadow-2xl rounded-none md:rounded-3xl relative">
          
          {image ? (
            <div className="relative w-full aspect-video">
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <Button asChild variant="secondary" size="sm" className="bg-black/40 hover:bg-black/60 backdrop-blur-lg border border-white/10 text-white shadow-xl">
                  <Link href={`/${lang}/kx/`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {lang === 'en' ? 'Back' : 'Terug'}
                  </Link>
                </Button>
              </div>
              <Image
                src={image}
                alt={postData.title}
                fill
                className="object-cover"
                priority 
                sizes="(max-width: 768px) 100vw, 680px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          ) : (
            <div className="p-6 md:p-12 pb-0">
              <Button asChild variant="secondary" className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 text-white">
                <Link href={`/${lang}/kx/`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {lang === 'en' ? 'Back' : 'Terug'}
                </Link>
              </Button>
            </div>
          )}

          <CardHeader className="p-6 md:p-10 border-b border-white/5">
            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 border-primary/20 text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5">{tag}</Badge>
              ))}
            </div>
            <CardTitle 
              className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-[1.2] mb-6"
              asChild
            >
              <h1>{postData.title}</h1>
            </CardTitle>
            <CardDescription className="text-base flex flex-col gap-6 text-white/70">
              <div className="flex items-center gap-3 flex-wrap font-medium text-sm">
                <a href={authorProfile.url} target="_blank" rel="author noopener noreferrer" className="font-bold text-white/95 hover:text-primary transition-colors">{postData.author}</a>
                <span className="text-white/30">&bull;</span>
                <time className="text-white/80">{displayDate}</time>
                {postData.readingTime && (
                  <>
                    <span className="text-white/30">&bull;</span>
                    <div className="flex items-center gap-1.5 text-primary/90">
                      <BookOpen className="h-3.5 w-3.5" />
                      <span>{postData.readingTime} {dict.blog.readingTime}</span>
                    </div>
                  </>
                )}
              </div>
              {postData.introHtml && (
                <div 
                  className="prose dark:prose-invert prose-base md:prose-lg max-w-none prose-p:leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: postData.introHtml }}
                />
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="p-6 md:p-10">
            <article>
              <div 
                className="prose dark:prose-invert prose-base md:prose-lg max-w-none 
                prose-headings:text-white prose-p:text-zinc-200 prose-p:leading-relaxed
                prose-strong:text-white prose-a:text-primary transition-all"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
              />
            </article>

            <div className="mt-12 pt-8 border-t border-white/5">
              <div className="text-center">
                <h3 className="text-xl font-bold text-white mb-3">
                  {lang === 'en' ? 'Ready to scale?' : 'Klaar om te schalen?'}
                </h3>
                <p className="text-white/60 mb-8 text-sm">
                  {lang === 'en' 
                    ? 'Let’s build a foundation for growth.' 
                    : 'Laten we een fundament bouwen voor groei.'}
                </p>
                <Magnetic strength={0.2}>
                  <Button asChild size="lg" className="font-bold">
                    <Link href={`/${lang}/project-request/`}>
                      {dict.common.workWithUs}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Magnetic>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Navigation - added small padding so they don't hit edges if the card doesn't */}
        <div className="px-4 md:px-0 grid grid-col-1 md:grid-cols-2 gap-4">
          {postData.previousPost && (
            <Link href={`/${lang}/kx/${postData.previousPost.id}/`} className="group">
              <Card className="bg-card/20 border-white/5 p-4 group-hover:bg-card/40 transition-colors">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Previous</p>
                <h4 className="text-white text-sm font-bold line-clamp-1">{postData.previousPost.title}</h4>
              </Card>
            </Link>
          )}
          {postData.nextPost && (
            <Link href={`/${lang}/kx/${postData.nextPost.id}/`} className="group">
              <Card className="bg-card/20 border-white/5 p-4 text-right group-hover:bg-card/40 transition-colors">
                <p className="text-[10px] font-bold text-primary uppercase mb-1">Next</p>
                <h4 className="text-white text-sm font-bold line-clamp-1">{postData.nextPost.title}</h4>
              </Card>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
