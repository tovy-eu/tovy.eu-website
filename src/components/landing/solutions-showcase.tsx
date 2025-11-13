
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from "../scroll-reveal";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const solutions = [
  {
    title: "CogniLink CRM",
    description: "An intelligent CRM that automates lead scoring and provides deep customer insights, freeing up your sales team to focus on closing deals.",
    link: "#",
    imageId: "solution-1"
  },
  {
    title: "FlowState Scheduler",
    description: "A smart scheduling platform that optimizes team availability and project timelines, eliminating coordination headaches.",
    link: "#",
    imageId: "solution-2"
  },
  {
    title: "Insightify Analytics",
    description: "Turn raw data into actionable business intelligence. Insightify provides clear, automated reports to guide your strategy.",
    link: "#",
    imageId: "solution-3"
  },
];

const solutionImages = Object.fromEntries(PlaceHolderImages.map(img => [img.id, img]));

export function SolutionsShowcase() {
  return (
    <section 
      className="w-full py-16 sm:py-24"
      style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.1), hsl(var(--background)))' }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">
              Peace of Mind, Delivered
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by teams who value clarity and control.
            </h2>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => {
              const image = solutionImages[solution.imageId];
              return (
                <Card key={solution.title} className="flex flex-col">
                  <CardHeader>
                    {image && (
                      <div className="aspect-video relative w-full rounded-t-lg overflow-hidden mb-4">
                        <Image
                          src={image.imageUrl}
                          alt={`Showcase image for ${solution.title}`}
                          fill
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
                    <CardTitle>{solution.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription>{solution.description}</CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link" className="p-0 h-auto">
                      <Link href={solution.link}>
                        View Solution <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
