
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { JsonLd, getOrganizationSchema, getPersonSchema } from '@/components/layout/json-ld';
import { i18n } from '@/lib/config';

/**
 * generateStaticParams is required for dynamic routes when using 'output: export'.
 */
export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

/**
 * Setting dynamicParams to false ensures that any [lang] segment not 
 * defined in generateStaticParams (e.g., /fr/ or /abc/) will 
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
  const { lang: rawLang } = await params;
  
  // Gracefully handle invalid or missing lang parameters during 404 rendering
  const lang = i18n.locales.includes(rawLang as any) ? (rawLang as 'en' | 'nl') : i18n.defaultLocale;

  const dict = await getDictionary(lang);
  
  return (
    <>
      <JsonLd type="Organization" data={getOrganizationSchema(dict)} />
      <JsonLd type="Person" data={getPersonSchema()} />
      <ScrollProgress />
      <Header lang={lang} dict={dict} />
      <main id="main-content" className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer lang={lang} />
    </>
  );
}
