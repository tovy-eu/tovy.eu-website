import { redirect } from 'next/navigation';

export default function ProjectRequestRoot() {
  // Redirect to localized version (English default)
  redirect('/en/project-request/');
}