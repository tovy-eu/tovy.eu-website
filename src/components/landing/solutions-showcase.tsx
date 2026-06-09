'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ScrollReveal } from "../scroll-reveal";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Dictionary } from "@/lib/get-dictionary";

export function SolutionsShowcase({ dict }: { dict: Dictionary }) {
  const solutions = dict.solutions?.items || [];

  return (
    <section 
      className="w-full py-16 sm:py-24"
      style={{ background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.1), hsl(var(--background)))' }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-8">
        <ScrollReveal>
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">
              {dict.solutions?.badge}
            </h2>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              {dict.solutions?.title}
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
                {solutions.map((solution: { title: string; description: string; link: string }) => (
                    <CarouselItem key={solution.title}>
                      <div className="p-1">
                        <Card className="flex flex-col h-full">
                          <CardHeader>
                            <CardTitle>{solution.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex-grow">
                            <CardDescription>{solution.description}</CardDescription>
                          </CardContent>
                          <CardFooter>
                            <Button asChild variant="link" className="p-0 h-auto">
                              <Link href={solution.link}>
                                {dict.solutions?.viewSolution} <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
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
