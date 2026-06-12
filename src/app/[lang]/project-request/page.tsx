
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { WavyLines } from '@/components/landing/wavy-lines';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';

const ProjectIntakeForm = dynamic(() => import('@/components/landing/project-intake-form').then(mod => mod.ProjectIntakeForm), {
  loading: () => <div className="w-full h-[500px] md:h-[600px] flex items-center justify-center bg-card/20 animate-pulse rounded-[2.5rem]" />
});

import { i18n } from '@/lib/config';

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

type Props = {
  params: Promise<{ lang: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const path = '/project-request';

    return {
      title: dict.pages.projectRequest.metadata.title,
      description: dict.pages.projectRequest.metadata.description,
      keywords: dict.pages.projectRequest.metadata.keywords,
      alternates: generateAlternates(path, lang),
    };
  } catch {
    return {
      title: 'Error',
      description: 'Page not found',
    };
  }
}

export default async function ProjectRequestPage({ params }: Props) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <div 
      className="relative flex min-h-[100dvh] flex-col items-center justify-start md:justify-center overflow-hidden p-0 md:p-8"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="w-full max-w-6xl z-10 flex flex-col justify-start md:justify-center flex-grow py-0 md:py-32">
        <ProjectIntakeForm dict={dict} />
      </div>
    </div>
  );
}
