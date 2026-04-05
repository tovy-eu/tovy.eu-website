
import { redirect } from 'next/navigation';

export default function KxRoot() {
  // Static export fallback - ideally users are routed to /[lang]/kx
  redirect('/en/kx/');
}
