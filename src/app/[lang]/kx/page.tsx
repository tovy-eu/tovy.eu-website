
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';
import { SectionDivider } from '@/components/landing/section-divider';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { cn } from '@/lib/utils';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';

  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    openGraph: {
      title: `${dict.blog.title} | Tovy`,
      description: dict.blog.subtitle,
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.blog.title} | Tovy`,
      description: dict.blog.subtitle,
      images: [defaultOgImage],
    },
  };
}

export default async function KxHome({ params }: { params: Promise<{ lang: string }> }) {
  if (!CONFIG.enableBlog) {
    notFound();
  }

  const { lang } = await params;
  const dict = await getDictionary(lang);
  const allPostsData = getSortedPostsData();

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? format(d, 'LLLL d, yyyy') : 'Recently';
  };

  const safeISODate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? d.toISOString() : undefined;
  };

  if (allPostsData.length === 0) {
    return (
      <div 
        className="relative flex flex-col items-center justify-center min-h-screen py-24 px-4 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
      >
        <WavyLines />
        <div className="relative z-10 text-center">
          <SectionHeader 
            badge="KX Hub"
            title={dict.blog.title}
            description={dict.blog.noPosts}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col min-h-screen py-24 px-4 md:px-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <SectionHeader 
            badge="Knowledge Exchange"
            title={dict.blog.title}
            description={dict.blog.subtitle}
          />
        </div>
        
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {allPostsData.map((post, index) => {
            const isFeatured = index === 0;
            const isMedium = index === 1 || index === 2;
            
            return (
              <Link 
                href={`/${lang}/kx/${post.id}/`} 
                key={post.id} 
                className={cn(
                  "block group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                  isFeatured ? "md:col-span-2 md:row-span-2" : "md:col-span-1"
                )}
              >
                <Card className="h-full flex flex-col overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(43,94,255,0.2)] bg-card/40 backdrop-blur-xl border border-white/10 group-focus-visible:bg-card/60 rounded-3xl">
                  <div className={cn(
                    "relative w-full overflow-hidden",
                    isFeatured ? "aspect-[16/10] md:aspect-auto md:flex-grow" : "aspect-video"
                  )}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      priority={isFeatured}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {isFeatured && (
                      <div className="absolute top-6 left-6">
                        <Badge className="bg-primary/20 backdrop-blur-md border-primary/20 text-primary-foreground text-[10px] uppercase tracking-wider px-3 py-1">
                          {dict.blog.featured}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col p-6 md:p-8">
                    <CardHeader className="p-0 mb-4">
                      <CardTitle className={cn(
                        "font-bold group-hover:text-primary transition-colors text-white leading-tight mb-2",
                        isFeatured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl"
                      )} asChild>
                        <h3 dangerouslySetInnerHTML={{ __html: post.title }} />
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 flex-wrap text-white/40 text-xs" asChild>
                        <div>
                          <time dateTime={safeISODate(post.date)}>{formatDate(post.date)}</time>
                          <span>&bull;</span>
                          <span>{post.author}</span>
                          {post.readingTime && (
                            <>
                              <span>&bull;</span>
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" /> {post.readingTime} {dict.blog.readingTime}
                              </span>
                            </>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-0 flex-grow">
                      <p className={cn(
                        "text-white/60 leading-relaxed mb-6",
                        isFeatured ? "line-clamp-4 text-base" : "line-clamp-3 text-sm"
                      )}>
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {post.tags?.slice(0, isFeatured ? 4 : 2).map(tag => (
                          <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-[10px] text-white/80 px-2 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>

                    <div className="mt-auto flex items-center text-primary font-bold text-[10px] md:text-xs tracking-widest uppercase group-hover:gap-2 transition-all">
                      Read Resource <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="my-16">
          <SectionDivider />
        </div>
      </div>
    </div>
  );
}
