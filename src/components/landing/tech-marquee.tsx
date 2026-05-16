
import React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/lib/get-dictionary';
import { cn } from '@/lib/utils';
import { SectionHeader } from './section-header';

export function TechMarquee({ dict }: { dict: Dictionary }) {
  const techLogos = [
    { "id": "gcp", "url": "/images/tech/gcp.webp", "alt": "Google Cloud logo" },
    { "id": "aws", "url": "https://picsum.photos/seed/aws/150/60", "alt": "Amazon AWS logo" },
    { "id": "azure", "url": "/images/tech/azure.webp", "alt": "Microsoft Azure logo" },
    { "id": "dbt", "url": "https://picsum.photos/seed/dbt/150/60", "alt": "dbt logo" },
    { "id": "snowflake", "url": "https://picsum.photos/seed/snowflake/150/60", "alt": "Snowflake logo" },
    { "id": "databricks", "url": "/images/tech/databricks.webp", "alt": "Databricks logo" },
    { "id": "python", "url": "/images/tech/python.webp", "alt": "Python language logo" },
    { "id": "typescript", "url": "https://picsum.photos/seed/ts/150/60", "alt": "TypeScript logo" },
    { "id": "powerbi", "url": "/images/tech/power-bi.webp", "alt": "Power BI logo" },
    { "id": "oracle", "url": "/images/tech/oracle.webp", "alt": "Oracle logo" },
    { "id": "sap", "url": "/images/tech/sap.webp", "alt": "SAP logo" },
    { "id": "sql", "url": "/images/tech/sql.webp", "alt": "SQL logo" }
  ];

  // Triple the logos for a long, smooth continuous loop
  const duplicatedLogos = [...techLogos, ...techLogos, ...techLogos];

  return (
    <div className="w-full py-16 bg-background/30 border-b border-white/5 overflow-hidden">
      <div className="container mx-auto px-4 mb-12">
        <SectionHeader
          badge={dict.common.techStack}
          title={dict.marquee.title}
          description={dict.marquee.subtitle}
        />
      </div>
      <div className="relative flex items-center">
        <div className="flex animate-marquee whitespace-nowrap gap-12 sm:gap-20 items-center">
          {duplicatedLogos.map((logo, index) => {
            const isBig = ['gcp', 'databricks', 'powerbi'].includes(logo.id);
            
            return (
              <div 
                key={`${logo.id}-${index}`} 
                className={cn(
                  "relative flex items-center justify-center h-8 w-28 sm:h-10 sm:w-36 opacity-20 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100 flex-shrink-0",
                  isBig && "sm:w-44" // Provide more horizontal room for high-priority logos
                )}
              >
                <div className={cn(
                  "relative w-full h-full transition-all duration-300",
                  isBig ? "max-w-full max-h-full scale-110" : "max-w-[80%] max-h-[80%]"
                )}>
                  <Image
                    src={logo.url}
                    alt={logo.alt}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Subtle Edge Fades for professional "trusted dashboard" feel */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </div>
  );
}
