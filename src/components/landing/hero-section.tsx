import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { ArrowDown } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="relative w-full flex flex-col items-center justify-center min-h-[80vh] text-center py-20 md:py-32"
      style={{
        background: 'linear-gradient(to bottom, #2980B9, #6DD5FA, #FFFFFF)'
      }}
    >
      <div className="z-10 max-w-4xl px-4">
        <h1 className="text-4xl font-bold tracking-tight text-black sm:text-6xl md:text-7xl">
          Your AI development partner
        </h1>
        <p className="mt-6 text-lg leading-8 text-black/80 sm:text-xl">
          We build clean, fast, and reliable systems that give you full control and peace of mind.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Button asChild size="lg" className="font-semibold text-lg">
            <Link href="/project-request">
              Submit your idea
              <ArrowDown className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
