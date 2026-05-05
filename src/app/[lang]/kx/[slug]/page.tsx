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
      
      <div className="w-full md:container relative z-10 mx-auto max-w-4xl flex flex-col gap-4 md:gap-6">

        <Card className="overflow-hidden bg-card/40 backdrop-blur-2xl border-y md:border border-white/10 shadow-2xl rounded-none md:rounded-3xl relative">
          
          {image ? (
            <div className="relative w-full aspect-video">
              <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
                <Button asChild variant="secondary" className="bg-black/40 hover:bg-black/60 backdrop-blur-lg border border-white/10 text-white shadow-xl">
                  <Link href={`/${lang}/kx/`}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {lang === 'en' ? 'Back to Hub' : 'Terug naar Hub'}
                  </Link>
                </Button>
              </div>
              <Image
                src={image}
                alt={postData.title}
                fill
                className="object-cover"
                priority 
                sizes="(max-width: 1200px) 100vw, 1200px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            </div>
          ) : (
            <div className="p-6 md:p-12 pb-0">
              <Button asChild variant="secondary" className="bg-white/5 hover:bg-white/10 backdrop-blur-lg border border-white/10 text-white transition-colors">
                <Link href={`/${lang}/kx/`}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {lang === 'en' ? 'Back to Hub' : 'Terug naar Hub'}
                </Link>
              </Button>
            </div>
          )}

          <CardHeader className="p-6 md:p-12 border-b border-white/5">
            <div className="flex flex-wrap gap-2 mb-6">
              {postData.tags?.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-primary/20 border-primary/20 text-primary-foreground text-[11px] font-bold uppercase tracking-widest px-3 py-1">{tag}</Badge>
              ))}
            </div>
            <CardTitle 
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-6"
              style={{ textShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }} 
              asChild
            >
              <h1>{postData.title}</h1>
            </CardTitle>
            <CardDescription className="text-base md:text-lg flex flex-col gap-6 text-white/70">
              <div>
                <div className="flex items-center gap-3 flex-wrap font-medium">
                  <span className="font-bold text-white/95">{postData.author}</span>
                  <span className="text-white/30">&bull;</span>
                  <time className="text-white/80" dateTime={isValid(dateObj) ? dateObj.toISOString() : undefined}>{displayDate}</time>
                  {postData.readingTime && (
                    <>
                      <span className="text-white/30">&bull;</span>
                      <div className="flex items-center gap-2 text-primary/90">
                        <BookOpen className="h-4 w-4" />
                        <span>{postData.readingTime} {dict.blog.readingTime}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {postData.introHtml && (
                <div 
                  className="prose dark:prose-invert prose-lg md:prose-xl max-w-none 
                  prose-headings:text-white prose-headings:font-bold 
                  prose-p:text-white prose-p:font-medium prose-p:leading-relaxed 
                  prose-strong:text-white prose-strong:font-bold
                  prose-a:text-primary hover:prose-a:text-primary/80"
                  dangerouslySetInnerHTML={{ __html: postData.introHtml }}
                />
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-12 lg:p-16">
            <article>
              <div 
                className="prose dark:prose-invert prose-lg md:prose-xl max-w-none 
                prose-headings:text-white prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:mt-10
                prose-p:text-zinc-100 prose-p:leading-[1.85] prose-p:tracking-normal
                prose-li:text-zinc-100 prose-li:leading-[1.85] 
                prose-ul:marker:text-primary/70 prose-ol:marker:text-primary/70
                prose-strong:text-white prose-strong:font-bold prose-strong:px-1.5 prose-strong:py-0.5 prose-strong:bg-white/10 prose-strong:rounded-md
                prose-a:font-semibold prose-a:text-white prose-a:underline prose-a:decoration-primary/70 prose-a:decoration-2 prose-a:underline-offset-4 hover:prose-a:text-primary hover:prose-a:bg-primary/10 hover:prose-a:rounded hover:prose-a:px-1 hover:prose-a:-mx-1 transition-all
                prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-gradient-to-r prose-blockquote:from-primary/10 prose-blockquote:to-transparent prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:text-zinc-100 prose-blockquote:font-medium prose-blockquote:italic prose-blockquote:rounded-r-xl
                prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[0.9em] prose-code:font-medium
                prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl prose-pre:rounded-2xl
                prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border prose-img:border-white/5 
                prose-hr:border-white/10 mb-16"
                dangerouslySetInnerHTML={{ __html: postData.contentHtml }} 
              />
            </article>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <div className="max-w-xl mx-auto">
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                  {lang === 'en' ? 'Ready to scale your data ecosystem?' : 'Klaar om uw data-ecosysteem op te schalen?'}
                </h3>
                <p className="text-white/60 mb-6 text-base leading-relaxed">
                  {lang === 'en' 
                    ? 'Let’s build a foundation that gives your team more time, focus, and freedom to grow.' 
                    : 'Laten we een fundament bouwen dat uw team meer tijd, focus en ruimte geeft om te groeien.'}
                </p>
                <div className="flex justify-center">
                  <Magnetic strength={0.25}>
                    <Button asChild size="lg" className="w-full sm:w-auto font-semibold text-base h-12 shadow-2xl px-8">
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
        
        <div className="px-4 md:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          {postData.previousPost ? (
            <Link href={`/${lang}/kx/${postData.previousPost.id}/`} className="group">
              <Card className="h-full bg-card/20 backdrop-blur-md border border-white/5 hover:border-primary/50 transition-all p-6 group-hover:bg-card/40">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">
                  {lang === 'en' ? 'Previous' : 'Vorige'}
                </p>
                <h4 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-2">{postData.previousPost.title}</h4>
              </Card>
            </Link>
          ) : <div />}
          
          {postData.nextPost ? (
            <Link href={`/${lang}/kx/${postData.nextPost.id}/`} className="group">
              <Card className="h-full bg-card/20 backdrop-blur-md border border-white/5 hover:border-primary/50 transition-all p-6 text-right group-hover:bg-card/40">
                <p className="text-[10px] font-bold tracking-widest text-primary uppercase mb-2">
                  {lang === 'en' ? 'Next' : 'Volgende'}
                </p>
                <h4 className="text-white font-bold group-hover:text-primary transition-colors line-clamp-2">{postData.nextPost.title}</h4>
              </Card>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
