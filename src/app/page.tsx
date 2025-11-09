import { HeroSection } from "@/components/landing/hero-section";
import { PainSolutionSection } from "@/components/landing/pain-solution-section";
import { AboutSection } from "@/components/landing/about-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { ProjectIntakeForm } from "@/components/landing/project-intake-form";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <main className="flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 md:px-8">
        <HeroSection />
        
        <ScrollReveal>
          <PainSolutionSection />
        </ScrollReveal>

        <div id="about">
          <ScrollReveal>
            <AboutSection />
          </ScrollReveal>
        </div>

        <div id="testimonials">
          <ScrollReveal>
            <TestimonialsSection />
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <div id="project-form" className="py-24 sm:py-32">
            <ProjectIntakeForm />
          </div>
        </ScrollReveal>
      </div>
    </main>
  );
}
