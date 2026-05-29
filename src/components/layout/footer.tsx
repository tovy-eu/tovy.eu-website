import Link from "next/link";
import { TrackedLink } from "@/components/ui/tracked-link";
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
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-y-10 md:gap-y-12 text-center md:grid-cols-3 md:text-left">
        
        {/* Left Column: Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-3 md:gap-4">
          <div className="flex select-none items-center">
            <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">TOV</span>
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-xl md:text-2xl font-bold tracking-tighter text-transparent">
              Y
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2 md:gap-3">
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold text-white">
              &copy; {currentYear} {profile.entity_name}
            </p>
            {/* Technical Density: Build Marker */}
            <div className="flex items-center gap-2 font-mono text-[8px] md:text-[9px] text-white/80 uppercase tracking-widest">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
              Platform Status: Operational // v1.2.0-stable
            </div>
          </div>
        </div>

        {/* Center Column: Socials & Legal */}
        <div className="order-last md:order-none flex flex-col items-center gap-y-6 md:gap-y-5">
          <div className="flex items-center gap-x-4 md:gap-x-5">
            <Button asChild variant="ghost" size="icon" className="h-11 w-11 md:h-12 md:w-12 hover:bg-white/10 rounded-full border border-white/5 transition-all">
              <a
                href={profile.social_media_profiles.linkedin_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-11 w-11 md:h-12 md:w-12 hover:bg-white/10 rounded-full border border-white/5 transition-all">
              <a
                href={profile.social_media_profiles.github_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5 md:h-6 md:w-6" />
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-8 gap-y-3 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] text-white">
            <Link
              href={`/${lang}/legal-notice/`}
              className="transition-colors hover:text-primary py-2 px-1"
            >
              {dictionary.footer["legal-notice"]}
            </Link>
            <span className="text-white/40 hidden md:inline">|</span>
            <Link
              href={`/${lang}/privacy-policy/`}
              className="transition-colors hover:text-primary py-2 px-1"
            >
              {dictionary.footer["privacy-policy"]}
            </Link>
          </div>
        </div>

        {/* Right Column: Bottom CTA - Matching Header Style */}
        <div className="flex flex-col items-center md:items-end justify-center">
          <Magnetic strength={0.1}>
            <Button asChild size="sm" className="h-8 md:h-9 px-5 md:px-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/10 transition-all duration-500">
              <TrackedLink href={`/${lang}/project-request/`} eventParams={{ location: "footer", text: dictionary.common.workWithUs }}>
                <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest">{dictionary.common.workWithUs}</span>
              </TrackedLink>
            </Button>
          </Magnetic>
        </div>

      </div>
    </footer>
  );
}
