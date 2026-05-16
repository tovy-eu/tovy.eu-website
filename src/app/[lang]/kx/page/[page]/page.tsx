import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound, redirect } from 'next/navigation';
import { CONFIG, i18n } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { cn } from '@/lib/utils';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';

export async function generateStaticParams() {
  const params = [];
  for (const lang of i18n.locales) {
    const { totalPages } = getPaginatedPostsData(lang, 6, 1);
    // Generate all pages, including page 1, to satisfy the dev server
    for (let i = 1; i <= totalPages; i++) {
      params.push({ lang, page: i.toString() });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, page: string }> }): Promise<Metadata> {
  const { lang: langParam, page: pageParam } = await params;
  const dict = await getDictionary(langParam);
  const defaultOgImage = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200&h=630';
  const path = `/kx/page/${pageParam}`;

  return {
    title: `${dict.blog.title} - Page ${pageParam}`,
    description: dict.blog.subtitle,
    alternates: generateAlternates(path, langParam),
    openGraph: {
      title: `${dict.blog.title} - Page ${pageParam}`,
      description: dict.blog.subtitle,
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.blog.title} - Page ${pageParam}`,
      description: dict.blog.subtitle,
      images: [defaultOgImage],
    },
  };
}

export default async function KxPaginatedPage({ params }: { params: Promise<{ lang: string, page: string }> }) {
  const { lang, page } = await params;

  const currentPage = Number(page);

  // Server-side redirect for page 1 to the canonical URL
  if (currentPage === 1) {
    redirect(`/${lang}/kx/`);
  }

  if (!CONFIG.enableBlog) {
    notFound();
  }

  if (isNaN(currentPage) || currentPage < 2) { 
    notFound();
  }

  const dict = await getDictionary(lang);
  const { posts, totalPages } = getPaginatedPostsData(lang, 6, currentPage);

  if (posts.length === 0) {
    notFound();
  }

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
    { name: `Page ${currentPage}`, item: `/${lang}/kx/page/${currentPage}` },
  ];

  return (
    <div 
      className="relative flex flex-col min-h-screen pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))' }}
    >
      <JsonLd type="BreadcrumbList" data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <SectionHeader 
            badge="Knowledge Exchange Hub"
            title={`${dict.blog.title} - Page ${currentPage}`}
            description={dict.blog.subtitle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {posts.map((post:any) => (
            <Link 
              href={`/${lang}/kx/${post.id}/`} 
              key={post.id} 
              className="block group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background md:col-span-1"
            >
              <div className="relative h-full w-full p-[1px] overflow-hidden rounded-3xl transition-all duration-500">
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary via-[hsl(var(--accent-gradient-stop))] to-primary bg-[length:200%_auto] animate-[gradient-flow_15s_linear_infinite]" />
                
                <div className="relative h-full w-full bg-card/95 backdrop-blur-xl rounded-[calc(1.5rem-1px)] flex flex-col transition-all duration-300 shadow-2xl border border-white/5 group-hover:border-transparent overflow-hidden">
                  
                  <div className="relative w-full overflow-hidden aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  </div>

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

                    <h3 className="font-bold group-hover:text-primary transition-colors text-white leading-tight mb-4 text-xl">
                      {post.title}
                    </h3>

                    <p className="text-white/70 leading-relaxed mb-6 flex-grow line-clamp-2 text-sm">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex flex-wrap gap-2">
                        {post.tags?.slice(0, 2).map((tag:string) => (
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
          ))}
        </div>
        
        <div className="flex justify-center items-center gap-4">
          <Link href={currentPage === 2 ? `/${lang}/kx/` : `/${lang}/kx/page/${currentPage - 1}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
            Previous
          </Link>
          {currentPage < totalPages && (
            <Link href={`/${lang}/kx/page/${currentPage + 1}`} className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
              Next
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
