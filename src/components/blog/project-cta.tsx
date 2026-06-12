import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/get-dictionary';

export default async function ProjectCta({ lang }: { lang: 'en' | 'nl' }) {
  const dict = await getDictionary(lang);
  return (
    <div className="text-center p-8 border-t border-gray-200 dark:border-gray-800">
      <h2 className="text-2xl font-bold mb-4">{dict.pages.knowledgeHub.projectCta.title}</h2>
      <p className="mb-6">{dict.pages.knowledgeHub.projectCta.description}</p>
      <Button asChild>
        <Link href={`/${lang}/project-request/`}>{dict.pages.knowledgeHub.projectCta.buttonText}</Link>
      </Button>
    </div>
  );
}
