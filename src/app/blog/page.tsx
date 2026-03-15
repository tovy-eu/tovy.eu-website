
import { redirect } from 'next/navigation';

export default function BlogRoot() {
  // Static export fallback - ideally users are routed to /[lang]/blog
  redirect('/en/blog/');
}
