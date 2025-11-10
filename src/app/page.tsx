import { HeroSection } from "@/components/landing/hero-section";
import { PainSolutionSection } from "@/components/landing/pain-solution-section";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionDivider } from "@/components/landing/section-divider";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />

      <SectionDivider />

      <ScrollReveal className="w-full">
        <PainSolutionSection />
      </ScrollReveal>
      
      <div className="w-full max-w-6xl px-4 md:px-8">
        <SectionDivider />

        <div id="about">
          <ScrollReveal>
            <AboutSection />
          </ScrollReveal>
        </div>
      </div>

      <SectionDivider />

      <div id="testimonials" className="w-full">
        <ScrollReveal>
          <TestimonialsSection />
        </ScrollReveal>
      </div>
    </div>
  );
}
