
import type { Organization, Service, WebSite, ProfessionalService, FAQPage } from 'schema-dts';
import companyProfile from '@/content/company-profile.json';
import type { Dictionary } from '@/lib/get-dictionary';

interface JsonLdProps {
  type: 'Organization' | 'ProfessionalService' | 'Service' | 'WebSite' | 'FAQPage';
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
 * Generates the primary ProfessionalService schema for Tovy.
 */
export function getCompanySchema(dict: Dictionary): ProfessionalService {
  const profile = companyProfile.public_company_profile;
  return {
    '@type': 'ProfessionalService',
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
    iso6523: profile.primary_identifiers.commercial_registry_number,
    foundingDate: profile.business_context.start_date,
    founder: {
      '@type': 'Person',
      name: profile.business_context.proprietor_name,
    },
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
      name: dict.engineering.services.analytics.title,
      description: dict.engineering.services.analytics.desc,
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
  return {
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is the starting budget for a project with Tovy?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: dict.projectForm.steps.budget.description,
        },
      },
      {
        '@type': 'Question',
        name: 'How fast can Tovy deliver a working data solution?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: dict.projectForm.steps.timeline.description,
        },
      },
      {
        '@type': 'Question',
        name: 'Does Tovy offer consulting for startups?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, Tovy provides strategic design and MVP builds starting from €2.500, specifically tailored for startups needing a reliable AI and Data foundation.',
        },
      },
    ],
  };
}
