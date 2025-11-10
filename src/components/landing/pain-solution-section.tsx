import { CheckCircle2, XCircle, BrainCircuit } from "lucide-react";

const pains = [
  "Black-box systems you can't control.",
  "Endless tweaking and unreliable results.",
  "Complex tools that slow down your team.",
  "Unpredictable costs and project delays.",
];

const solutions = [
  "Transparent systems with full code ownership.",
  "Reliable, predictable, and optimized performance.",
  "Simple integration and developer-first approach.",
  "Peace of mind with clear deliverables and support.",
];

const clientRole = "Bring your domain expertise and a clear vision. We'll handle the technology.";

export function PainSolutionSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">
          The Tovy Difference
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          AI should simplify, not complicate.
        </p>
      </div>
      <div className="mt-16 space-y-8">
        <div className="bg-card border rounded-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            
            {/* Pains Column */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">You don't have to</h3>
              <ul className="space-y-4">
                {pains.map((pain, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <XCircle className="h-6 w-6 text-destructive" />
                    </div>
                    <span className="text-muted-foreground">{pain}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Column */}
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">Calm Clarity with Tovy</h3>
              <ul className="space-y-4">
                {solutions.map((solution, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <CheckCircle2 className="h-6 w-6 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{solution}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
