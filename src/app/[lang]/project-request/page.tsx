
import type { Metadata } from 'next';
import { ProjectIntakeForm } from '@/components/landing/project-intake-form';
import { WavyLines } from '@/components/landing/wavy-lines';
import { getDictionary } from '@/lib/get-dictionary';
import { generateAlternates } from '@/lib/metadata';

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
      title: dict.projectForm.title,
      description: dict.projectForm.subtitle,
      alternates: generateAlternates(path, lang),
      robots: {
        index: false,
        follow: true,
      },
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
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-4 md:p-8 pt-32 md:pt-40 pb-24"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="w-full max-w-2xl z-10 flex flex-col justify-center">
        <ProjectIntakeForm dict={dict} />
      </div>
    </div>
  );
}
