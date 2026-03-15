
import { redirect } from 'next/navigation';

export default function PrivacyPolicyRoot() {
  // Redirect to localized version (English default)
  redirect('/en/privacy-policy/');
}
