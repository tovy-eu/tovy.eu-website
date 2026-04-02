"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Github, Linkedin } from "lucide-react";
import Link from "next/link";
import companyProfile from '@/content/company-profile.json';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Dictionary } from "@/lib/get-dictionary";
import { trackEvent } from "@/lib/analytics";

const socialLinks = [
  {
    name: "GitHub",
    url: "https://github.com/tovy-engineering",
    icon: <Github className="h-5 w-5" />,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/company/tovy",
    icon: <Linkedin className="h-5 w-5" />,
  },
];

export default function Footer({ lang = "en", dict }: { lang?: string; dict?: Dictionary }) {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleSocialClick = (platform: string) => {
    trackEvent({
      name: 'social_link_click',
      event_category: 'engagement',
      event_label: platform
    });
  };

  const privacyText = dict?.common.privacyPolicy || "Privacy Policy";
  const legalText = dict?.common.legalNotice || "Legal Notice";
  const rightsText = dict?.common.allRightsReserved || "All rights reserved.";

  return (
    <footer className="w-full border-t border-white/10 bg-card/40 backdrop-blur-xl">
      <div className="container mx-auto flex flex-col items-center gap-8 py-10 max-w-6xl px-4 md:px-8">
        
        <div className="flex items-center gap-4">
          <TooltipProvider>
            {socialLinks.map((link) => (
              <Tooltip key={link.name}>
                <TooltipTrigger asChild>
                  <Button 
                    asChild 
                    variant="ghost" 
                    className="h-11 w-11 rounded-full hover:bg-white/10"
                    onClick={() => handleSocialClick(link.name)}
                  >
                    <Link href={link.url} target="_blank" aria-label={link.name}>
                      {link.icon}
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{link.name}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm text-muted-foreground">
          <Link href={`/${lang}/privacy-policy/`} className="hover:text-primary transition-colors py-2 px-1">
            {privacyText}
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <Link href={`/${lang}/legal-notice/`} className="hover:text-primary transition-colors py-2 px-1">
            {legalText}
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <Link href={`mailto:${companyProfile.public_company_profile.contact_details.email}`} className="hover:text-primary transition-colors py-2 px-1">
            {companyProfile.public_company_profile.contact_details.email}
          </Link>
          <div className="h-4 w-px bg-white/10 hidden sm:block"></div>
          <span className="py-2 px-1">{companyProfile.public_company_profile.primary_identifiers.vat_id_number}</span>
        </div>
        
        <div className="text-sm text-muted-foreground text-center">
          © {year} {companyProfile.public_company_profile.entity_name}. {rightsText}
        </div>
      </div>
    </footer>
  );
}
