
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { WavyLines } from '@/components/landing/wavy-lines';

export default function NotFound() {
  return (
    <div
      className="relative flex min-h-[80vh] flex-col items-center justify-center text-center py-20 md:py-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%,rgba(120,119,198,0.3),hsla(0,0%,100%,0))'
      }}
    >
      <WavyLines />
      <div className="z-10 max-w-2xl px-4 flex flex-col items-center justify-center">
        <h1
          className="text-8xl font-bold tracking-tight bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent sm:text-9xl"
          style={{ textShadow: '0 0 15px hsla(var(--primary), 0.3)' }}
        >
          404
        </h1>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Page Not Found
        </h2>
        <p className="mt-6 text-lg leading-8 text-white/80">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved or deleted.
        </p>
        <div className="mt-10">
          <Button asChild size="lg" className="font-semibold text-lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Return to Homepage
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
