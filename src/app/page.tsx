import { HeroSection } from "@/components/landing/hero-section";
import { PainSolutionSection } from "@/components/landing/pain-solution-section";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionDivider } from "@/components/landing/section-divider";
import { FadeInOnLoad } from "@/components/fade-in-on-load";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <FadeInOnLoad>
        <HeroSection />
      </FadeInOnLoad>
      <div className="w-full max-w-6xl px-4 md:px-8">
        <SectionDivider />

        <ScrollReveal>
          <PainSolutionSection />
        </ScrollReveal>

        <SectionDivider />

        <div id="about">
          <ScrollReveal>
            <AboutSection />
          </ScrollReveal>
        </div>

        <SectionDivider />

        <div id="testimonials">
          <ScrollReveal>
            <TestimonialsSection />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}
