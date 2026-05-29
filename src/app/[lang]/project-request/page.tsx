
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { WavyLines } from '@/components/landing/wavy-lines';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';

const ProjectIntakeForm = dynamic(() => import('@/components/landing/project-intake-form').then(mod => mod.ProjectIntakeForm), {
  loading: () => <div className="w-full h-[600px] flex items-center justify-center bg-card/20 animate-pulse rounded-[2.5rem]" />
});

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
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
      title: dict.projectForm.metaTitle || dict.projectForm.title,
      description: dict.projectForm.metaDescription || dict.projectForm.subtitle,
      keywords: dict.projectForm.keywords || [],
      alternates: generateAlternates(path, lang),
    };
  } catch (error) {
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="w-full max-w-6xl z-10 flex flex-col justify-center flex-grow py-32">
        <ProjectIntakeForm dict={dict} />
      </div>
    </div>
  );
}
