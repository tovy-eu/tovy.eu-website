
import type { Organization, Service, WebSite, ProfessionalService, FAQPage, BreadcrumbList, Person, Article, WebPage } from 'schema-dts';
import companyProfile from '@/content/company-profile.json';
import personProfile from '@/content/person.json';
import type { Dictionary } from '@/lib/get-dictionary';
import type { PostData } from '@/lib/blog';

interface JsonLdProps {
  type: 'Organization' | 'ProfessionalService' | 'Service' | 'WebSite' | 'FAQPage' | 'BreadcrumbList' | 'Person' | 'Article' | 'WebPage';
  data: any;
}

/**
 * A utility component to inject JSON-LD structured data into the head.
 * This is the cornerstone of Machine Experience (MX) Design.
 */
export function JsonLd({ type, data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Generates the primary Organization schema for Tovy.
 */
export function getOrganizationSchema(dict: Dictionary): Organization {
  const profile = companyProfile.public_company_profile;
  return {
    '@type': 'Organization',
    '@id': 'https://tovy.eu/#organization',
    name: profile.entity_name,
    description: dict.hero.subtitle,
    url: 'https://tovy.eu',
    logo: 'https://tovy.eu/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${profile.contact_details.street_name} ${profile.contact_details.house_number}`,
      addressLocality: profile.contact_details.city,
      postalCode: profile.contact_details.postal_code,
      addressCountry: 'NL',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: `${profile.contact_details.country_code}${profile.contact_details.phone_number}`,
      contactType: 'customer service',
      email: profile.contact_details.email,
    },
    vatID: profile.primary_identifiers.vat_id_number,
    identifier: profile.primary_identifiers.commercial_registry_number,
  };
}

/**
 * Generates the Person schema for the CEO.
 */
export function getPersonSchema(): Person {
    const person = personProfile.public_ceo_profile;
    return {
        '@type': 'Person',
        name: person.name,
        jobTitle: person.jobTitle,
        image: person.image,
        sameAs: person.sameAs,
        worksFor: {
            '@type': 'Organization',
            name: companyProfile.public_company_profile.entity_name,
        },
    };
}

/**
 * Generates Breadcrumb schema for navigation depth.
 */
export function getBreadcrumbSchema(items: { name: string; item: string }[]): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://tovy.eu${item.item}`,
    })),
  };
}

/**
 * Generates the Service schemas for Tovy's core offerings.
 */
export function getServicesSchema(dict: Dictionary): Service[] {
  const services = [
    {
      name: dict.engineering.services.strategic.title,
      description: dict.engineering.services.strategic.desc,
    },
    {
      name: dict.engineering.services.cloud.title,
      description: dict.engineering.services.cloud.desc,
    },
    {
      name: dict.engineering.services.data.title,
      description: dict.engineering.services.data.desc,
    },
    {
      name: dict.engineering.services.automation.title,
      description: dict.engineering.services.automation.desc,
    },
  ];

  return services.map(s => ({
    '@type': 'Service',
    name: s.name,
    description: s.description,
    provider: {
      '@id': 'https://tovy.eu/#organization',
    },
    areaServed: 'EU',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Data Engineering Services',
    }
  }));
}

/**
 * Generates FAQ schema to support Prompt-Optimized Search (MX).
 */
export function getFaqSchema(dict: Dictionary): FAQPage {
  const allQuestions = dict.faq.categories.flatMap(category => category.questions);
  return {
    '@type': 'FAQPage',
    mainEntity: allQuestions.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.replace(/<[^>]*>?/gm, ''), // Strip HTML for JSON-LD
      },
    })),
  };
}

/**
 * Generates Article schema for blog posts.
 */
export function getArticleSchema(post: PostData): Article {
  const profile = companyProfile.public_company_profile;
  const author = personProfile.public_ceo_profile;
  
  const article: Article = {
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://tovy.eu/kx/${post.id}`,
    },
    headline: post.title,
    description: post.excerpt,
    image: post.image,
    author: {
      '@type': 'Person',
      name: author.name,
      url: author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: profile.entity_name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://tovy.eu/logo.png',
      },
    },
    datePublished: post.date,
    isAccessibleForFree: true,
    hasPart: [
      {
        '@type': 'WebPageElement',
        isAccessibleForFree: true,
        cssSelector: '.subscription-form',
      }
    ]
  };

  return article;
}
