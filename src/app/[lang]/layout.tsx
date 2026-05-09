
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { JsonLd, getCompanySchema, getPersonSchema } from '@/components/layout/json-ld';

/**
 * generateStaticParams is required for dynamic routes when using 'output: export'.
 */
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

/**
 * Setting dynamicParams to false ensures that any [lang] segment not 
 * defined in generateStaticParams (e.e.g., /fr/ or /abc/) will 
 * correctly trigger the 404 page instead of an error.
 */
export const dynamicParams = false;

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const urlLang = resolvedParams.lang;

  const dict = await getDictionary(urlLang);
  
  return (
    <>
      <JsonLd type="ProfessionalService" data={getCompanySchema(dict)} />
      <JsonLd type="Person" data={getPersonSchema()} />
      <ScrollProgress />
      <Header lang={urlLang} dict={dict} />
      <main id="main-content" className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer lang={urlLang} dict={dict} />
    </>
  );
}
