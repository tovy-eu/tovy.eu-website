import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

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
  
  return (
    <>
      <Header lang={lang} />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <Footer lang={lang} />
    </>
  );
}
