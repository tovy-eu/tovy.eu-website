import type { Service, ProfessionalService, FAQPage, BreadcrumbList, Person, Article } from "schema-dts";
import companyProfile from "@/content/company-profile.json";
import personProfile from "@/content/person.json";
import type { Dictionary } from "@/lib/get-dictionary";
import type { PostData } from "@/lib/blog";

interface JsonLdProps {
  type?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

export function JsonLd({ type: _type, data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function getOrganizationSchema(dict: Dictionary): ProfessionalService {
  return {
    "@type": "ProfessionalService",
    "@id": "https://tovy.eu/#organization",
    name: "Tovy",
    url: "https://tovy.eu",
    logo: "https://tovy.eu/images/tovy-og-image.webp",
    image: "https://tovy.eu/images/tovy-og-image.webp",
    description: dict.pages.home.hero.subtitle,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${companyProfile.public_company_profile.contact_details.street_name} ${companyProfile.public_company_profile.contact_details.house_number}`,
      addressLocality: companyProfile.public_company_profile.contact_details.city,
      postalCode: companyProfile.public_company_profile.contact_details.postal_code,
      addressCountry: "NL",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 52.3676,
      longitude: 4.9041,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: companyProfile.public_company_profile.contact_details.phone_number,
      contactType: "customer service",
      email: companyProfile.public_company_profile.contact_details.email,
    },
    sameAs: [
      companyProfile.public_company_profile.social_media_profiles.linkedin_url,
      companyProfile.public_company_profile.social_media_profiles.github_url,
    ],
  };
}

export function getPersonSchema(): Person {
  return {
    "@type": "Person",
    name: personProfile.public_ceo_profile.name,
    jobTitle: personProfile.public_ceo_profile.jobTitle,
    url: "https://tovy.eu",
    sameAs: personProfile.public_ceo_profile.sameAs,
  };
}

export function getBreadcrumbSchema(items: { name: string; item: string }[]): BreadcrumbList {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `https://tovy.eu${item.item}`,
    })),
  };
}

export function getServicesSchema(dict: Dictionary): Service[] {
  return Object.values(dict.pages.home.engineering.services).map((service: unknown) => {
    const s = service as { title: string; desc: string };
    return {
      "@type": "Service",
      name: s.title,
      description: s.desc,
      provider: {
        "@id": "https://tovy.eu/#organization",
      },
      areaServed: "Europe",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Data Engineering Services",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
            },
          },
        ],
      },
    };
  });
}

export function getFaqSchema(dict: Dictionary): FAQPage {
  const allQuestions = dict.pages.home.faq.categories.flatMap((category: { questions: { question: string; answer: string }[] }) => category.questions);
  return {
    "@type": "FAQPage",
    mainEntity: allQuestions.map((item: { question: string; answer: string }) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer.replace(/<[^>]*>?/gm, ""),
      },
    })),
  };
}

export function getArticleSchema(post: PostData): Article {
  return {
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.image ? `https://tovy.eu${post.image}` : "https://tovy.eu/images/tovy-og-image.webp",
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Person",
      name: post.author,
    },
    publisher: {
      "@id": "https://tovy.eu/#organization",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://tovy.eu/kx/${post.id}`,
    },
  };
}
