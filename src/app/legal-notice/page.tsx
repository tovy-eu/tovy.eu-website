
import { redirect } from 'next/navigation';

export default function LegalNoticeRoot() {
  // Static export fallback - ideally users are routed to /[lang]/legal-notice
  redirect('/en/legal-notice/');
}
