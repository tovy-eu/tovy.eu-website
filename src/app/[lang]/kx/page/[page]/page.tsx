import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound, redirect } from 'next/navigation';
import { CONFIG, i18n } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { cn } from '@/lib/utils';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';
import { Spotlight } from '@/components/ui/spotlight';

export async function generateStaticParams() {
  const params = [];
  for (const lang of i18n.locales) {
    const { totalPages } = getPaginatedPostsData(lang, 6, 1);
    for (let i = 1; i <= totalPages; i++) {
      params.push({ lang, page: i.toString() });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string, page: string }> }): Promise<Metadata> {
  const { lang: langParam, page: pageParam } = await params;
  const dict = await getDictionary(langParam);
  const defaultOgImage = 'https://tovy.eu/images/tovy-og-image.webp';
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

  const breadcrumbs = [
    { name: 'Home', item: `/${lang}/` },
    { name: 'Knowledge Exchange Hub', item: `/${lang}/kx/` },
    { name: `Page ${currentPage}`, item: `/${lang}/kx/page/${currentPage}/` },
  ];

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
            title={`${dict.blog.title} - Page ${currentPage}`}
            description={dict.blog.subtitle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          {posts.map((post) => (
            <Link 
              href={`/${lang}/kx/${post.id}/`} 
              key={post.id} 
              className="block group focus-visible:outline-none transition-all duration-500 md:col-span-6 lg:col-span-4"
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl border border-white/5 bg-card/60 transition-all duration-500 hover:border-white/10 group-hover:shadow-2xl">
                <Spotlight color="rgba(43, 94, 255, 0.1)" />
                
                <div className="flex flex-col h-full">
                  <div className="relative w-full overflow-hidden aspect-video">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      priority={i === 0}
                      {...(i === 0 ? { fetchPriority: "high" } : {})}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  </div>

                  <div className="flex flex-col p-8 flex-grow relative z-10">
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

                    <h3 className="font-bold text-white/90 leading-[1.1] tracking-tight mb-4 group-hover:text-white transition-colors text-balance text-xl md:text-2xl">
                      {post.title}
                    </h3>

                    <p className="text-white/40 leading-relaxed font-medium tracking-tight mb-8 text-pretty line-clamp-2 text-base">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-8">
                      <div className="flex flex-wrap gap-4">
                        {post.tags?.slice(0, 2).map((tag: string) => (
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
          ))}
        </div>
        
        <div className="flex justify-center items-center gap-6">
          <Button asChild variant="ghost" className="hover:bg-white/5 text-white/40 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest h-10 px-6 rounded-full">
            <Link href={currentPage === 2 ? `/${lang}/kx/` : `/${lang}/kx/page/${currentPage - 1}/`}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Link>
          </Button>
          
          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest font-mono">
            Page {currentPage} of {totalPages}
          </div>

          {currentPage < totalPages ? (
            <Button asChild variant="ghost" className="hover:bg-white/5 text-white/40 hover:text-white/60 text-[10px] font-bold uppercase tracking-widest h-10 px-6 rounded-full">
              <Link href={`/${lang}/kx/page/${currentPage + 1}/`}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <div className="w-[100px]" /> /* Spacer to keep center alignment */
          )}
        </div>
      </div>
    </div>
  );
}
