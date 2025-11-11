

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ScrollReveal } from "../scroll-reveal";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";

const testimonials = [
  {
    quote: "Tovy delivered a system that was not only powerful but also incredibly easy for our team to manage. The transparency and control we have now is a game-changer.",
    name: "Alex Rivera",
    title: "CTO, Innovate Inc.",
    initials: "AR",
    imageId: "testimonial-1"
  },
  {
    quote: "The speed and reliability of the AI system Tovy built for us exceeded all expectations. Our operational efficiency has skyrocketed.",
    name: "Samantha Chen",
    title: "Head of Operations, Logicore",
    initials: "SC",
    imageId: "testimonial-2"
  },
];

const testimonialImages = Object.fromEntries(PlaceHolderImages.map(img => [img.id, img]));

export function TestimonialsSection() {
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
          <div className="mt-16">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-4xl mx-auto"
            >
              <CarouselContent>
                {testimonials.map((testimonial, index) => {
                  const image = testimonialImages[testimonial.imageId];
                  return (
                    <CarouselItem key={index} className="md:basis-1/2">
                        <Card className="h-full p-8">
                          <CardContent className="p-0 flex flex-col h-full">
                            <p className="text-foreground/80 flex-grow">"{testimonial.quote}"</p>
                            <div className="mt-6 flex items-center gap-4">
                              <Avatar>
                                {image && (
                                  <AvatarImage asChild>
                                    <Image
                                      src={image.imageUrl}
                                      alt={`Portrait of ${testimonial.name}, ${testimonial.title}`}
                                      width={image.width}
                                      height={image.height}
                                      data-ai-hint={image.imageHint}
                                      className="object-cover"
                                    />
                                  </AvatarImage>
                                )}
                                <AvatarFallback>{testimonial.initials}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold">{testimonial.name}</p>
                                <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                    </CarouselItem>
                  )
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
