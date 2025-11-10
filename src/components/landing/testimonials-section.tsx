import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const testimonials = [
  {
    quote: "Tovy AI leverde een systeem dat niet alleen krachtig was, maar ook ongelooflijk eenvoudig te beheren voor ons team. De transparantie en controle die we nu hebben, is een game-changer.",
    name: "Alex Rivera",
    title: "CTO, Innovate Inc.",
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageUrl || '',
    avatarHint: PlaceHolderImages.find(p => p.id === 'testimonial-1')?.imageHint || '',
  },
  {
    quote: "De snelheid en betrouwbaarheid van het AI-systeem dat Tovy voor ons heeft gebouwd, overtrof alle verwachtingen. Onze operationele efficiëntie is omhooggeschoten.",
    name: "Samantha Chen",
    title: "Hoofd Operaties, Logicore",
    avatar: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageUrl || '',
    avatarHint: PlaceHolderImages.find(p => p.id === 'testimonial-2')?.imageHint || '',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">
          Gemoedsrust, Geleverd
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          Vertrouwd door teams die duidelijkheid en controle waarderen.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="p-8">
            <CardContent className="p-0">
              <p className="text-foreground/80">"{testimonial.quote}"</p>
              <div className="mt-6 flex items-center gap-4">
                <Avatar>
                  {testimonial.avatar && (
                    <Image
                      src={testimonial.avatar}
                      alt={`Avatar van ${testimonial.name}`}
                      width={40}
                      height={40}
                      data-ai-hint={testimonial.avatarHint}
                    />
                  )}
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
