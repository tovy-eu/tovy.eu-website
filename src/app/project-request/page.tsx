import type { Metadata } from 'next';
import en from '@/dictionaries/en.json';
import { buildRedirectScript } from '@/lib/redirect-script';

export const metadata: Metadata = {
  title: en.global.redirects.projectRequestTitle,
  description: en.global.redirects.description,
  alternates: {
    canonical: 'https://www.tovy.eu/en/project-request/',
  }
};

/**
 * Root project request redirection page.
 * Optimized for static export by using an inline script to detect language and redirect
 * as early as possible. This approach is safest for 'output: export' environments.
 */
export default function ProjectRequestRootPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a1120]">
      <script dangerouslySetInnerHTML={{ __html: buildRedirectScript('project-request/') }} />
      {/* 
        The page is intentionally left blank of text to prevent a "Loading..." flicker.
        The background color matches the site's theme for a seamless transition.
      */}
    </div>
  );
}
