
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

  const featuredPost = allPostsData[0];
  const otherPosts = allPostsData.slice(1);

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
        
        {/* Featured Resource */}
        <div className="mb-16">
          <Link 
            href={`/${lang}/kx/${featuredPost.id}/`} 
            className="block group rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            <Card className="grid md:grid-cols-2 overflow-hidden transition-all duration-500 ease-in-out hover:shadow-[0_0_30px_rgba(43,94,255,0.2)] bg-card/40 backdrop-blur-xl border border-white/10 group-focus-visible:bg-card/60 rounded-3xl">
              <div className="relative w-full aspect-video md:aspect-auto overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-transparent md:to-transparent" />
              </div>
              <div className="flex flex-col p-8 md:p-10">
                <CardHeader className="p-0 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-[0.3em] text-primary uppercase">{dict.blog.featured}</span>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold group-hover:text-primary transition-colors text-white leading-tight" asChild>
                    <h2>{featuredPost.title}</h2>
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 flex-wrap text-white/50 pt-2" asChild>
                    <div>
                      <time dateTime={safeISODate(featuredPost.date)}>{formatDate(featuredPost.date)}</time>
                      <span>&bull;</span>
                      <span>{featuredPost.author}</span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 flex-grow">
                  <p className="text-white/70 leading-relaxed line-clamp-3 mb-6">{featuredPost.excerpt}</p>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {featuredPost.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-white/80">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
                <div className="mt-auto flex items-center text-primary font-bold text-sm tracking-wider uppercase group-hover:gap-2 transition-all">
                  Read Resource <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {otherPosts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {otherPosts.map(({ id, date, title, excerpt, author, image, tags, readingTime }) => (
              <Link 
                href={`/${lang}/kx/${id}/`} 
                key={id} 
                className="block group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              >
                <Card className="h-full flex flex-col transition-all duration-500 ease-in-out hover:shadow-[0_0_20px_rgba(43,94,255,0.15)] overflow-hidden bg-card/30 backdrop-blur-xl border border-white/5 group-focus-visible:bg-card/50 rounded-2xl">
                  <div className="relative w-full aspect-video overflow-hidden">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <CardHeader className="p-6 pb-2">
                    <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors text-white line-clamp-2 leading-tight" asChild>
                      <h3>{title}</h3>
                    </CardTitle>
                    <CardDescription className="text-xs text-white/40 pt-1" asChild>
                      <time dateTime={safeISODate(date)}>{formatDate(date)}</time>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-2 flex-grow">
                    <p className="text-white/60 text-sm leading-relaxed line-clamp-3 mb-4">{excerpt}</p>
                    <div className="flex flex-wrap gap-1.5 mt-auto">
                      {tags?.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="bg-white/5 border-white/10 text-[10px] py-0">{tag}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="my-16">
          <SectionDivider />
        </div>
      </div>
    </div>
  );
}
