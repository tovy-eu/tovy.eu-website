
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from "../scroll-reveal";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

const solutions = [
  {
    title: "CogniLink CRM",
    description: "An intelligent CRM that automates lead scoring and provides deep customer insights, freeing up your sales team to focus on closing deals.",
    link: "#",
    imageId: "solution-1"
  },
  {
    title: "Insightify Analytics",
    description: "A platform that turns complex data into actionable insights with predictive modeling.",
    link: "#",
    imageId: "solution-2"
  },
  {
    title: "FlowState Scheduler",
    description: "An intelligent scheduling tool that optimizes team availability and minimizes meeting conflicts.",
    link: "#",
    imageId: "solution-3"
  }
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
              Delivered Solutions
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Trusted by our customers and partners who value their workforce
            </h2>
          </div>
        </ScrollReveal>
        <ScrollReveal>
          <div className="mt-16 flex justify-center">
            <Carousel 
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full max-w-sm md:max-w-md lg:max-w-lg"
            >
              <CarouselContent>
                {solutions.map((solution) => {
                  const image = solutionImages[solution.imageId];
                  return (
                    <CarouselItem key={solution.title}>
                      <div className="p-1">
                        <Card className="flex flex-col h-full">
                          <CardHeader>
                            {image && (
                              <div className="aspect-video relative w-full rounded-t-lg overflow-hidden mb-4">
                                <Image
                                  src={image.imageUrl}
                                  alt={`Showcase image for ${solution.title}`}
                                  width={image.width}
                                  height={image.height}
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
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
