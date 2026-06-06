import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound } from 'next/navigation';
import { CONFIG } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';
import { Spotlight } from '@/components/ui/spotlight';
import { i18n } from '@/lib/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const defaultOgImage = '/images/tovy-og-image.webp';
  const path = '/kx';

  return {
    title: dict.blog.title,
    description: dict.blog.subtitle,
    alternates: generateAlternates(path, lang),
    openGraph: {
      title: dict.blog.title,
      description: dict.blog.subtitle,
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.blog.title,
      description: dict.blog.subtitle,
      images: [defaultOgImage],
    },
  };
}

export default async function KxHub({ params }: { params: Promise<{ lang: string }> }) {
  if (!CONFIG.enableBlog) {
    notFound();
  }

  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  // Always page 1 for the main kx hub
  const currentPage = 1;
  const { posts, totalPages } = getPaginatedPostsData(lang, 6, currentPage);

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? format(d, 'LLLL d, yyyy') : 'Recently';
  };

  const breadcrumbs = [
    { name: dict.common.home || 'Home', item: `/${lang}/` },
    { name: dict.common.kxHub || 'Knowledge Exchange Hub', item: `/${lang}/kx/` },
  ];

  if (posts.length === 0) {
    return (
      <div className="relative min-h-screen flex flex-col pt-40 pb-24 px-4 overflow-hidden" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}>
        <WavyLines />
        <div className="container relative z-10 mx-auto max-w-4xl text-center">
          <SectionHeader 
            badge={dict.blog.badge || "Knowledge Exchange"}
            title={dict.blog.title}
            description={dict.blog.subtitle}
          />
          <div className="mt-20 p-12 rounded-[2.5rem] bg-card/40 backdrop-blur-xl border border-white/10">
            <p className="text-white/60 text-lg">{dict.blog.noPosts}</p>
            <Button asChild className="mt-8 rounded-full px-8" variant="outline">
              <Link href={`/${lang}/`}>{dict.common.backToFoundation || "Back to Foundation"}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen flex flex-col pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <SectionHeader 
            badge={dict.blog.badge || "Knowledge Exchange"}
            title={dict.blog.title}
            description={dict.blog.subtitle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          {posts.map((post, i) => {
            const isFeatured = i === 0 && currentPage === 1;
            
            return (
              <Link 
                href={`/${lang}/kx/${post.id}/`} 
                key={post.id} 
                className={isFeatured ? "block group focus-visible:outline-none transition-all duration-500 md:col-span-12 lg:col-span-8 lg:row-span-2" : "block group focus-visible:outline-none transition-all duration-500 md:col-span-6 lg:col-span-4"}
              >
                <div className="h-full flex flex-col bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden group-hover:border-primary/40 group-hover:shadow-[0_0_50px_rgba(43,94,255,0.15)] transition-all duration-700 relative">
                  <Spotlight color="rgba(43, 94, 255, 0.05)" />
                  
                  <div className={isFeatured ? "relative h-[300px] md:h-[450px] overflow-hidden" : "relative h-[240px] overflow-hidden"}>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes={isFeatured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
                      priority={isFeatured}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                    <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[9px] font-bold uppercase tracking-widest text-primary-foreground">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col p-8 md:p-10 flex-grow relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-white/30 uppercase">
                          {"// "}{formatDate(post.date)}
                        </p>
                        <span className="h-px w-4 bg-white/10" />
                        <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-primary/60 uppercase">
                          {post.author}
                        </p>
                    </div>

                    <h3 className={isFeatured ? "text-2xl md:text-4xl font-bold text-white mb-6 leading-tight tracking-tight group-hover:text-primary transition-colors duration-500" : "text-xl md:text-2xl font-bold text-white mb-4 leading-tight tracking-tight group-hover:text-primary transition-colors duration-500"}>
                      {post.title}
                    </h3>

                    <p className={isFeatured ? "text-white/40 leading-relaxed font-medium tracking-tight mb-8 text-pretty line-clamp-3 text-lg" : "text-white/40 leading-relaxed font-medium tracking-tight mb-8 text-pretty line-clamp-2 text-base"}>
                      {post.excerpt}
                    </p>

                    <div className="mt-auto flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-500">
                      {dict.common.exploreIntelligence || "Explore Intelligence"} <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Pagination placeholder */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-4 pt-12 border-t border-white/5">
            {Array.from({ length: totalPages }).map((_, index) => {
                const pageNum = index + 1;
                const isActive = pageNum === currentPage;
                return (
                    <Link
                        key={pageNum}
                        href={pageNum === 1 ? `/${lang}/kx/` : `/${lang}/kx/page/${pageNum}/`}
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono text-xs font-bold transition-all duration-500 border ${
                            isActive 
                            ? "bg-primary border-primary text-white shadow-[0_0_20px_rgba(43,94,255,0.3)]" 
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {pageNum.toString().padStart(2, '0')}
                    </Link>
                );
            })}
          </div>
        )}
      </div>
    </div>
  );
}