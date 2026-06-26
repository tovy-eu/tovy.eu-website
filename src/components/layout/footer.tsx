import Link from "next/link";
import companyProfile from "@/content/company-profile.json";
import { i18n } from "@/lib/config";
import { getDictionary } from "@/lib/get-dictionary";
import { Github, Linkedin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Magnetic } from "@/components/ui/magnetic";
import { FooterCTA } from "@/components/layout/footer-cta";

type Locale = typeof i18n.locales[number];

export default async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const { public_company_profile: profile } = companyProfile;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-background px-6 py-12 md:px-12 relative overflow-hidden">
      <div className="mx-auto max-w-screen-xl">
        
        {/* Top Grid: Logo, Legal Buttons, CTA */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center text-center md:text-left">
          
          {/* Brand & Technical Status */}
          <div className="flex flex-col items-center md:items-start gap-2.5">
            <div className="flex select-none items-center">
              <span className="text-xl md:text-2xl font-bold tracking-tighter text-white">TOV</span>
              <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-xl md:text-2xl font-bold tracking-tighter text-transparent">
                Y
              </span>
            </div>
            {/* Slogan */}
            <div className="text-[10px] md:text-[11px] text-white/50 leading-relaxed font-medium -mt-1 mb-1 max-w-[200px] md:max-w-none">
              <p>{dictionary.global.footer["slogan-line-1"]}</p>
              <p>{dictionary.global.footer["slogan-line-2"]}</p>
            </div>
          </div>

          {/* Redesigned Pill-shaped Legal Buttons */}
          <div className="flex items-center justify-center gap-3">
            <Button asChild variant="ghost" className="h-8 rounded-full border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/5 text-white/50 hover:text-white text-[9px] uppercase tracking-widest px-4 transition-all duration-300">
              <Link href={`/${lang}/legal-notice/`}>
                {dictionary.global.footer["legal-notice"]}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="h-8 rounded-full border border-white/5 hover:border-white/10 bg-white/[0.01] hover:bg-white/5 text-white/50 hover:text-white text-[9px] uppercase tracking-widest px-4 transition-all duration-300">
              <Link href={`/${lang}/privacy-policy/`}>
                {dictionary.global.footer["privacy-policy"]}
              </Link>
            </Button>
          </div>

          {/* Right Column: CTA */}
          <div className="flex flex-col items-center md:items-end justify-center">
            <Magnetic strength={0.1}>
              <Button asChild size="sm" className="h-8 md:h-9 px-5 md:px-6 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border-none shadow-lg shadow-blue-500/10 transition-all duration-500">
                <FooterCTA href={`/${lang}/project-request/`} text={dictionary.global.common.workWithUs}>
                  <span className="font-bold text-[8px] md:text-[9px] uppercase tracking-widest">{dictionary.global.common.workWithUs}</span>
                </FooterCTA>
              </Button>
            </Magnetic>
          </div>

        </div>

        {/* Subtle Horizontal Divider */}
        <div className="h-px w-full bg-white/5 my-8" />

        {/* Bottom Row: Copyright and Social Icons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-10 sm:gap-6 text-center sm:text-left">

          {/* Copyright */}
          <div className="flex items-center gap-4 text-white/55 text-[10px] tracking-wider font-mono">
            <span>&copy; {currentYear} {profile.entity_name}</span>
          </div>

          {/* Social Profiles */}
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full border border-white/5 text-white/55 hover:text-white transition-all">
              <a
                href={profile.social_media_profiles.linkedin_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon" className="h-8 w-8 hover:bg-white/10 rounded-full border border-white/5 text-white/55 hover:text-white transition-all">
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

        </div>

      </div>
    </footer>
  );
}