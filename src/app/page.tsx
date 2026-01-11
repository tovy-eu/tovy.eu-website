
import { HeroSection } from "@/components/landing/hero-section";
import { AboutSection } from "@/components/landing/about-section";
import { SectionDivider } from "@/components/landing/section-divider";
import { SubscriptionForm } from "@/components/blog/subscription-form";
import { EngineeringSection } from "@/components/landing/engineering-section";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Tovy",
      "url": "https://tovy.eu", // Replace with your actual domain
      "logo": "https://tovy.eu/logo.png", // Replace with a URL to your logo
      "contactPoint": {
        "@type": "ContactPoint",
        "email": "info@tovy.eu",
        "contactType": "Customer Service"
      }
    },
    {
      "@type": "Service",
      "serviceType": "AI System Development for industries",
      "provider": {
        "@type": "Organization",
        "name": "Tovy"
      },
      "description": "We build clean, fast, and reliable AI systems that give you full control and turn manual labor into cognitive freedom."
    },
    {
      "@type": "Review",
      "itemReviewed": {
        "@type": "Organization",
        "name": "Tovy"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Alex Rivera"
      },
      "reviewBody": "Tovy delivered a system that was not only powerful but also incredibly easy for our team to manage. The transparency and control we have now is a game-changer."
    },
    {
      "@type": "Review",
      "itemReviewed": {
        "@type": "Organization",
        "name": "Tovy"
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": "5",
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": "Samantha Chen"
      },
      "reviewBody": "The speed and reliability of the AI system Tovy built for us exceeded all expectations. Our operational efficiency has skyrocketed."
    }
  ]
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col items-center">
        <HeroSection />

        <SectionDivider />
        
        <AboutSection />

        <SectionDivider />

        <EngineeringSection />

        <div className="w-full">
          <SectionDivider />
          <div className="py-16 sm:py-24 container mx-auto max-w-2xl">
            <SubscriptionForm />
          </div>
        </div>
      </div>
    </>
  );
}
