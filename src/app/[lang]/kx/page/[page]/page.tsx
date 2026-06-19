import Link from 'next/link';
import Image from 'next/image';
import { getPaginatedPostsData } from '@/lib/blog';
import { format, isValid } from 'date-fns';
import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { getDictionary } from '@/lib/get-dictionary';
import { notFound, redirect } from 'next/navigation';
import { CONFIG, i18n } from '@/lib/config';
import { WavyLines } from '@/components/landing/wavy-lines';
import { SectionHeader } from '@/components/landing/section-header';
import { JsonLd, getBreadcrumbSchema } from '@/components/layout/json-ld';
import { generateAlternates } from '@/lib/metadata';
import { Spotlight } from '@/components/ui/spotlight';
import { PageCategorySetter } from '@/components/layout/page-category-setter';

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!CONFIG.enableBlog) {
    return i18n.locales.map((lang) => ({ lang, page: '2' }));
  }

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

  const pageText = dict.global.common.page || 'Page';

  return {
    title: `${dict.pages.knowledgeHub.metadata.title} - ${pageText} ${pageParam}`,
    description: dict.pages.knowledgeHub.metadata.description,
    robots: CONFIG.enableBlog ? undefined : { index: false },
    alternates: generateAlternates(path, langParam),
    openGraph: {
      title: `${dict.pages.knowledgeHub.metadata.title} - ${pageText} ${pageParam}`,
      description: dict.pages.knowledgeHub.metadata.description,
      type: 'website',
      images: [{ url: defaultOgImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${dict.pages.knowledgeHub.metadata.title} - ${pageText} ${pageParam}`,
      description: dict.pages.knowledgeHub.metadata.description,
      images: [defaultOgImage],
    },
  };
}

type Props = {
  params: Promise<{ lang: string; page: string }>;
};

export default async function KxPagination({ params }: Props) {
  const { lang, page } = await params;
  const dict = await getDictionary(lang);
  const currentPage = parseInt(page);

  if (currentPage === 1) {
    redirect(`/${lang}/kx/`);
  }

  if (!CONFIG.enableBlog) {
    notFound();
  }

  const { posts, totalPages } = getPaginatedPostsData(lang, 6, currentPage);

  if (posts.length === 0 || currentPage > totalPages) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return isValid(d) ? format(d, 'LLLL d, yyyy') : 'Recently';
  };

  const pageText = dict.global.common.page || 'Page';

  const breadcrumbs = [
    { name: dict.global.common.home || 'Home', item: `/${lang}/` },
    { name: dict.global.common.kxHub || 'Knowledge Exchange Hub', item: `/${lang}/kx/` },
    { name: `${pageText} ${currentPage}`, item: `/${lang}/kx/page/${currentPage}/` },
  ];

  return (
    <div
      className="relative min-h-screen flex flex-col pt-32 md:pt-40 pb-24 px-4 md:px-8 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <PageCategorySetter category="knowledge-base" />
      <JsonLd data={getBreadcrumbSchema(breadcrumbs)} />
      <WavyLines />
      
      <div className="container relative z-10 mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <SectionHeader 
            badge={dict.pages.knowledgeHub.hub.badge || "Knowledge Exchange"}
            title={dict.pages.knowledgeHub.hub.title}
            description={dict.pages.knowledgeHub.hub.subtitle}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-24">
          {posts.map((post) => (
            <Link 
              href={`/${lang}/kx/${post.id}/`} 
              key={post.id} 
              className="block group focus-visible:outline-none transition-all duration-500 md:col-span-6 lg:col-span-4"
            >
              <div className="h-full flex flex-col bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] overflow-hidden group-hover:border-primary/40 group-hover:shadow-[0_0_50px_rgba(43,94,255,0.15)] transition-all duration-700 relative">
                <Spotlight color="rgba(43, 94, 255, 0.05)" />
                
                <div className="relative h-[240px] overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-all duration-1000 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
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

                <div className="flex flex-col p-8 flex-grow relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                      <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-white/50 uppercase">
                        {"// "}{formatDate(post.date)}
                      </p>
                      <span className="h-px w-4 bg-white/10" />
                      <p className="font-mono text-[9px] font-bold tracking-[0.3em] text-primary/60 uppercase">
                        {post.author}
                      </p>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-tight tracking-tight group-hover:text-primary transition-colors duration-500">
                    {post.title}
                  </h3>

                  <p className="text-white/55 leading-relaxed font-medium tracking-tight mb-8 text-pretty line-clamp-2 text-base">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em] group-hover:gap-4 transition-all duration-500">
                    {dict.global.common.explore || "Explore"} <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pt-12 border-t border-white/5">
          <div className="flex gap-4 order-2 md:order-1">
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
                            : "bg-white/5 border-white/10 text-white/55 hover:bg-white/10 hover:text-white"
                        }`}
                    >
                        {pageNum.toString().padStart(2, '0')}
                    </Link>
                );
            })}
          </div>

          <div className="flex gap-4 order-1 md:order-2">
            <Button
                variant="ghost"
                asChild
                disabled={currentPage === 1}
                className="rounded-full px-6 hover:bg-white/5 text-white/55 font-bold text-[10px] uppercase tracking-widest border border-white/5"
            >
                <Link href={currentPage === 2 ? `/${lang}/kx/` : `/${lang}/kx/page/${currentPage - 1}/`}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {dict.pages.knowledgeHub.hub.previous || "Previous"}
                </Link>
            </Button>
            <Button
                variant="ghost"
                asChild
                disabled={currentPage === totalPages}
                className="rounded-full px-6 hover:bg-white/5 text-white/55 font-bold text-[10px] uppercase tracking-widest border border-white/5"
            >
                <Link href={`/${lang}/kx/page/${currentPage + 1}/`}>
                    {dict.pages.knowledgeHub.hub.next || "Next"} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}