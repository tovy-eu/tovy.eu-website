import type { Metadata } from 'next';
import en from '@/dictionaries/en.json';
import { buildRedirectScript } from '@/lib/redirect-script';

export const metadata: Metadata = {
  title: en.pages.paymentSuccess.metadata.title,
  description: en.pages.paymentSuccess.metadata.description,
  alternates: {
    canonical: 'https://www.tovy.eu/en/payment-success/',
  },
  robots: 'noindex, follow',
};

/**
 * Root payment success redirection page.
 * Optimized for static export by using an inline script to detect language and redirect
 * as early as possible. This approach is safest for 'output: export' environments.
 * noindex page -> no referrer stash needed.
 */
export default function PaymentSuccessRootPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0a1120]">
      <script dangerouslySetInnerHTML={{ __html: buildRedirectScript('payment-success/', false) }} />
    </div>
  );
}
