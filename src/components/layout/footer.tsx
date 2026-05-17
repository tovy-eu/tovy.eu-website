import Link from "next/link";
import companyProfile from "@/content/company-profile.json";
import { i18n } from "@/lib/config";
import { getDictionary } from "@/lib/get-dictionary";
import { Github, Linkedin } from "lucide-react";

import { JsonLd, getOrganizationSchema } from "@/components/layout/json-ld";
import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";

type Locale = typeof i18n.locales[number];

export default async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const { public_company_profile: profile } = companyProfile;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background px-4 py-12 md:px-8">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-y-10 text-center md:grid-cols-3 md:text-left">
        
        {/* Left Column: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="flex select-none items-center">
            <span className="text-xl font-bold tracking-tighter">TOV</span>
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-xl font-bold tracking-tighter text-transparent">
              Y
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {profile.entity_name}.{" "}
            {dictionary.common.allRightsReserved}
          </p>
        </div>

        {/* Center Column: Socials & Legal */}
        <div className="order-last md:order-none flex flex-col items-center gap-y-4">
          <div className="flex items-center gap-x-2">
            <Button asChild variant="ghost" size="icon" className="hover:bg-white/10">
              <a
                href={profile.social_media_profiles.linkedin_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="hover:bg-white/10">
              <a
                href={profile.social_media_profiles.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-4 w-4" />
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm text-muted-foreground">
            <Link
              href={`/${lang}/legal-notice`}
              className="transition-colors hover:text-foreground"
            >
              {dictionary.footer["legal-notice"]}
            </Link>
            <span className="text-muted-foreground/50 hidden md:inline">|</span>
            <Link
              href={`/${lang}/privacy-policy`}
              className="transition-colors hover:text-foreground"
            >
              {dictionary.footer["privacy-policy"]}
            </Link>
          </div>
        </div>

        {/* Right Column: Bottom CTA - Matching Header Style */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <Magnetic strength={0.2}>
            <Button asChild size="sm" className="h-9 md:h-10 px-4 md:px-6">
              <Link href={`/${lang}/project-request/`}>
                <span className="font-bold text-sm">{dictionary.common.workWithUs}</span>
              </Link>
            </Button>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
