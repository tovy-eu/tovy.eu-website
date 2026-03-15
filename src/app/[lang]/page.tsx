
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { SubscriptionForm } from "@/components/blog/subscription-form";
import { EngineeringSection } from "@/components/landing/engineering-section";
import { getDictionary } from "@/lib/get-dictionary";

export default async function Home({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang);

  return (
    <div className="flex flex-col items-center">
      <HeroSection dict={dict} />

      <SectionDivider />
      
      <AboutSection />

      <SectionDivider />

      <EngineeringSection />

      <div className="w-full">
        <SectionDivider />
        <div className="py-16 sm:py-24 container mx-auto max-w-2xl">
          <SubscriptionForm dict={dict} />
        </div>
      </div>
    </div>
  );
}
