import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { cn } from '@/lib/utils';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';
import { Spotlight } from '@/components/ui/spotlight';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const defaultOgImage = '/images/tovy-og-image.webp';
  const path = `/kx/`;

  return {
    title: dict.blog.metaTitle || dict.blog.title,
    description: dict.blog.metaDescription || dict.blog.subtitle,
    keywords: dict.blog.keywords || [],
    alternates: generateAlternates(path, lang),
    openGraph: {
      title: dict.blog.metaTitle || dict.blog.title,
      description: dict.blog.metaDescription || dict.blog.subtitle,
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.blog.metaTitle || dict.blog.title,
      description: dict.blog.metaDescription || dict.blog.subtitle,
      images: [defaultOgImage],
    },
  };
}

export default async function KxHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!CONFIG.enableBlog) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const currentPage = 1;
  const { posts, totalPages } = getPaginatedPostsData(lang, 6, currentPage);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? format(d, 'LLLL d, yyyy') : 'Recently';
  };

  const safeISODate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? d.toISOString() : undefined;
  };

  const breadcrumbs = [
    { name: 'Home', item: `/${lang}/` },
    { name: 'Knowledge Exchange Hub', item: `/${lang}/kx/` },
  ];

  if (posts.length === 0) {
    return (
      <div 
        className="relative flex flex-col items-center justify-center min-h-screen pt-32 md:pt-40 pb-24 px-4 overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
      >
        <WavyLines />
        <div className="relative z-10 text-center">
          <SectionHeader 
            badge="Knowledge Exchange Hub"
            title={dict.blog.title}
            description={dict.blog.noPosts}
          />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative flex flex-col min-h-screen pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="text-center mb-24">
          <SectionHeader 
            index="KX"
            badge="Knowledge Exchange Hub"
            title={dict.blog.title}
            description={dict.blog.subtitle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          {posts.map((post, index) => {
            const isFeatured = index === 0 && currentPage === 1;
            
            return (
              <Link 
                href={`/${lang}/kx/${post.id}/`} 
                key={post.id} 
                className={cn(
                  "block group focus-visible:outline-none transition-all duration-500",
                  isFeatured ? "md:col-span-12 lg:col-span-8" : "md:col-span-6 lg:col-span-4"
                )}
              >
                <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-card/60 transition-all duration-500 hover:border-white/10 group-hover:shadow-2xl">
                  <Spotlight color="rgba(43, 94, 255, 0.1)" />
                  
                  <div className="flex flex-col h-full">
                    <div className={cn(
                      "relative w-full overflow-hidden",
                      isFeatured ? "aspect-[21/9]" : "aspect-video"
                    )}>
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                        sizes={isFeatured ? "(max-width: 768px) 100vw, 80vw" : "(max-width: 768px) 100vw, 40vw"}
                        priority={isFeatured} 
                        {...(isFeatured ? { fetchPriority: "high" } : {})}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>

                    <div className="flex flex-col p-8 md:p-10 flex-grow relative z-10">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">
                            // {formatDate(post.date)}
                          </p>
                          <span className="h-px w-4 bg-white/10" />
                          <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-primary/60 uppercase">
                            {post.author}
                          </p>
                        </div>
                      </div>

                      <h3 className={cn(
                        "font-bold text-white/90 leading-[1.1] tracking-tight mb-4 group-hover:text-white transition-colors text-balance",
                        isFeatured ? "text-3xl md:text-4xl lg:text-5xl" : "text-xl md:text-2xl"
                      )}>
                        {post.title}
                      </h3>

                      <p className={cn(
                        "text-white/40 leading-relaxed font-medium tracking-tight mb-8 text-pretty",
                        isFeatured ? "line-clamp-3 text-lg" : "line-clamp-2 text-base"
                      )}>
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-8">
                        <div className="flex flex-wrap gap-4">
                          {post.tags?.slice(0, 2).map(tag => (
                            <span key={tag} className="font-mono text-[8px] font-bold tracking-[0.4em] uppercase text-white/20">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center text-primary/80 font-black text-[9px] tracking-[0.3em] uppercase gap-3 group/link">
                          {lang === 'en' ? 'Access Entry' : 'Open Archief'} 
                          <ArrowRight className="h-4 w-4 transition-transform group-hover/link:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        
        <div className="flex justify-center items-center gap-4">
          {totalPages > 1 && (
            <Link href={`/${lang}/kx/page/2/`} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-[10px] font-bold uppercase tracking-widest">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
