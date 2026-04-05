
import dynamic from 'next/dynamic';
import { HeroSection } from "@/components/landing/hero-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { getDictionary } from "@/lib/get-dictionary";
import { JsonLd, getServicesSchema, getFaqSchema } from "@/components/layout/json-ld";
import type { Metadata } from 'next';

export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'nl' }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return {
    alternates: {
      canonical: `/${lang}/`,
      languages: {
        'en': '/en/',
        'nl': '/nl/',
      },
    },
  };
}

// Dynamically import below-the-fold sections to reduce unused JS on initial load
const PainSolutionSection = dynamic(() => import("@/components/landing/pain-solution-section").then(mod => mod.PainSolutionSection));
const AboutSection = dynamic(() => import("@/components/landing/about-section").then(mod => mod.AboutSection));
const EngineeringSection = dynamic(() => import("@/components/landing/engineering-section").then(mod => mod.EngineeringSection));
const TestimonialsSection = dynamic(() => import("@/components/landing/testimonials-section").then(mod => mod.TestimonialsSection));

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center">
      {/* Machine Experience (MX) Structured Data */}
      <JsonLd type="Service" data={getServicesSchema(dict)} />
      <JsonLd type="FAQPage" data={getFaqSchema(dict)} />

      <HeroSection dict={dict} />

      <SectionDivider />

      <PainSolutionSection dict={dict} />

      <SectionDivider />
      
      <AboutSection dict={dict} />

      <SectionDivider />

      <EngineeringSection dict={dict} />

      <SectionDivider />

      <TestimonialsSection dict={dict} />
    </div>
  );
}
