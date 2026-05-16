import Link from 'next/link';
import companyProfile from '@/content/company-profile.json';
import { Locale } from '@/lib/config';
import { getDictionary } from '@/lib/get-dictionary';
import { Github, Linkedin } from 'lucide-react';

import { JsonLd } from '@/components/layout/json-ld';
import { Button } from '@/components/ui/button';

export default async function Footer({ lang }: { lang: Locale }) {
  const dictionary = await getDictionary(lang);
  const { public_company_profile: profile } = companyProfile;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background px-4 py-8 md:px-8">
      <div className="mx-auto grid max-w-screen-xl grid-cols-1 items-center gap-y-6 text-center md:grid-cols-3 md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <div className="flex select-none items-center">
            <span className="text-xl font-bold tracking-tighter">TOV</span>
            <span className="bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-xl font-bold tracking-tighter text-transparent">
              Y
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} {profile.entity_name}.{' '}
            {dictionary.common.allRightsReserved}
          </p>
        </div>

        <div className="order-first flex flex-col items-center gap-y-4 md:order-none">
          <div className="flex items-center gap-x-2">
            <Button asChild variant="ghost" size="icon">
              <a
                href={profile.social_media_profiles.linkedin_url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="ghost" size="icon">
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
          <div className="flex items-center justify-center gap-x-4 text-sm text-muted-foreground">
            <Link
              href={`/${lang}/legal-notice`}
              className="transition-colors hover:text-foreground"
            >
              {dictionary.footer['legal-notice']}
            </Link>
            <span className="text-muted-foreground/50">|</span>
            <Link
              href={`/${lang}/privacy-policy`}
              className="transition-colors hover:text-foreground"
            >
              {dictionary.footer['privacy-policy']}
            </Link>
          </div>
        </div>

        {/* Empty div for grid balancing */}
        <div></div>
      </div>
      <JsonLd data={companyProfile} />
    </footer>
  );
}
