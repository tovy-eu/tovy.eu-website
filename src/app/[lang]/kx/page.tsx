
import Link from 'next/link';
import Image from 'next/image';
import { getSortedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
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
    title: `${dict.blog.title} | Tovy Hub`,
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
            badge="Knowledge Exchange"
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
            badge="KX Hub"
            title={dict.blog.title}
            description={dict.blog.subtitle}
          />
        </div>
        
        {/* Bento Grid Layout synchronized with Engineering Section styling */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {allPostsData.map((post, index) => {
            const isFeatured = index === 0;
            
            return (
              <Link 
                href={`/${lang}/kx/${post.id}/`} 
                key={post.id} 
                className={cn(
                  "block group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background",
                  isFeatured ? "md:col-span-2" : "md:col-span-1"
                )}
              >
                <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl transition-all duration-500">
                  {/* Animated Border Gradient Layer */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" />
                  
                  {/* Inner Content Layer with Engineering Section Visuals */}
                  <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent overflow-hidden">
                    
                    {/* Image Header */}
                    <div className={cn(
                      "relative w-full overflow-hidden",
                      isFeatured ? "aspect-[21/9]" : "aspect-video"
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
                        <div className="absolute top-4 left-4 md:top-6 md:left-6">
                          <Badge className="bg-primary/20 backdrop-blur-md border-primary/20 text-primary-foreground text-[10px] uppercase tracking-wider px-3 py-1">
                            {dict.blog.featured}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col p-6 md:p-8 flex-grow">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="text-primary">
                          <BookOpen className="h-4 w-4" />
                        </div>
                        <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
                          <time dateTime={safeISODate(post.date)}>{formatDate(post.date)}</time>
                          <span className="mx-2">&bull;</span>
                          <span>{post.author}</span>
                        </p>
                      </div>

                      <h3 className={cn(
                        "font-bold group-hover:text-primary transition-colors text-white leading-tight mb-4",
                        isFeatured ? "text-2xl md:text-3xl lg:text-4xl" : "text-xl"
                      )}>
                        {post.title}
                      </h3>

                      <p className={cn(
                        "text-white/70 leading-relaxed mb-6 flex-grow",
                        isFeatured ? "line-clamp-3 text-base" : "line-clamp-2 text-sm"
                      )}>
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex flex-wrap gap-2">
                          {post.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="text-[9px] md:text-[10px] font-bold tracking-[0.25em] uppercase text-white/30">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-primary font-bold text-[10px] tracking-widest uppercase gap-2">
                          {lang === 'en' ? 'Read' : 'Lees'} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
