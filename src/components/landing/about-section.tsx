import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Cpu, Zap, Bird, Lightbulb } from "lucide-react";

const pillars = [
  {
    icon: <Cpu className="h-8 w-8 text-primary" />,
    title: "Technology",
    description: "We use robust, state-of-the-art technology to build systems that are powerful and easy to maintain."
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: "Optimization",
    description: "Performance is not an afterthought. We design for speed, efficiency, and reliability from day one."
  },
  {
    icon: <Bird className="h-8 w-8 text-primary" />,
    title: "Freedom",
    description: "You get full ownership of the code. Our goal is to empower you, not lock you into a service."
  },
  {
    icon: <Lightbulb className="h-8 w-8 text-primary" />,
    title: "Innovation",
    description: "We build with a forward-looking mindset, ensuring your systems are adaptable and ready for the future."
  }
];

export function AboutSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          We build systems that let people and technology work in harmony.
        </p>
        <p className="mt-6 text-lg leading-8 text-foreground/80">
          Our philosophy is built on four core pillars. They are the foundation of every project we undertake, ensuring we deliver not just code, but confidence and control.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pillars.map((pillar) => (
          <Card key={pillar.title} className="text-center transition-all hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
            <CardHeader className="items-center">
              <div className="p-4 bg-primary/10 rounded-lg">
                {pillar.icon}
              </div>
              <CardTitle className="mt-4">{pillar.title}</CardTitle>
            </CardHeader>
            <CardDescription className="p-6 pt-0">
              {pillar.description}
            </CardDescription>
          </Card>
        ))}
      </div>
    </section>
  );
}
