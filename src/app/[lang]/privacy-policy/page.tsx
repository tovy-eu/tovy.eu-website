
import type { Metadata } from 'next';
import companyProfile from '@/content/company-profile.json';
import { getDictionary } from '@/lib/get-dictionary';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  return {
    title: `${dict.privacy.title} | Tovy`,
    description: dict.privacy.intro.substring(0, 160),
  };
}

export default async function PrivacyPolicyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const email = companyProfile.public_company_profile.contact_details.email;

  return (
    <div className="container mx-auto max-w-4xl pt-32 md:pt-40 pb-24 px-4 md:px-8">
      <h1 className="text-3xl font-bold mb-6">{dict.privacy.title}</h1>
      <div className="space-y-6 text-muted-foreground">
        <p>{dict.privacy.intro}</p>

        {dict.privacy.sections.map((section: any, index: number) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground pt-4">{section.title}</h2>
            <p>
              {section.content}
              {index === 0 || index === 5 ? (
                <>
                  {" "}
                  <a href={`mailto:${email}`} className="underline hover:text-primary">
                    {email}
                  </a>
                  .
                </>
              ) : null}
            </p>
            {section.list && (
              <ul className="list-disc list-inside space-y-4 pl-4">
                {section.list.map((item: string, i: number) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            )}
            {section.footer && <p className="mt-2">{section.footer}</p>}
          </div>
        ))}

        <p className="pt-4">{dict.privacy.effectiveDate}</p>
      </div>
    </div>
  );
}
