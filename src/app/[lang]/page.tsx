import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { PainSolutionSection } from "@/components/landing/pain-solution-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { SubscriptionForm } from "@/components/blog/subscription-form";
import { EngineeringSection } from "@/components/landing/engineering-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { getDictionary } from "@/lib/get-dictionary";

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="flex flex-col items-center">
      <HeroSection dict={dict} />

      <SectionDivider />

      <PainSolutionSection dict={dict} />

      <SectionDivider />
      
      <AboutSection dict={dict} />

      <SectionDivider />

      <EngineeringSection dict={dict} />

      <SectionDivider />

      <TestimonialsSection dict={dict} />

      <div className="w-full">
        <SectionDivider />
        <div className="py-16 sm:py-24 container mx-auto max-w-2xl">
          <SubscriptionForm dict={dict} />
        </div>
      </div>
    </div>
  );
}
