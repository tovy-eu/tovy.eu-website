
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import { getDictionary } from '@/lib/get-dictionary';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { JsonLd, getCompanySchema } from '@/components/layout/json-ld';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export default async function LocalizedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  
  return (
    <>
      <JsonLd type="ProfessionalService" data={getCompanySchema(dict)} />
      <ScrollProgress />
      <Header lang={lang} dict={dict} />
      <main id="main-content" className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer lang={lang} dict={dict} />
    </>
  );
}
