import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { SectionDivider } from "@/components/landing/section-divider";

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <HeroSection />

      <SectionDivider />
      
      <div id="about" className="w-full">
        <AboutSection />
      </div>

      <SectionDivider />

      <div id="testimonials" className="w-full">
        <TestimonialsSection />
      </div>
    </div>
  );
}
