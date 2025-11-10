import { CheckCircle2, XCircle } from "lucide-react";

const pains = [
  "Black-box systemen waar u geen controle over heeft.",
  "Eindeloos tweaken en onbetrouwbare resultaten.",
  "Complexe tools die uw team vertragen.",
  "Onvoorspelbare kosten en projectvertragingen.",
];

const solutions = [
  "Transparante systemen met volledige eigendom van de code.",
  "Betrouwbare, voorspelbare en geoptimaliseerde prestaties.",
  "Eenvoudige integratie en een aanpak gericht op ontwikkelaars.",
  "Gemoedsrust met duidelijke deliverables en ondersteuning.",
];

export function PainSolutionSection() {
  return (
    <div 
      className="bg-gradient-to-b from-primary/10 to-[#8F668C]/10 rounded-2xl"
      style={{
        backgroundImage: `
          linear-gradient(to right, hsl(var(--border) / 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--border) / 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, hsl(var(--primary) / 0.1), hsl(var(--accent) / 0.1))
        `,
        backgroundSize: '2rem 2rem, 2rem 2rem, 100% 100%',
      }}
    >
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center px-4">
          <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-[#8F668C] bg-clip-text text-transparent">
            Het Tovy Verschil
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            AI moet vereenvoudigen, niet compliceren.
          </p>
        </div>
        <div className="mt-16 space-y-8 px-4">
          <div className="p-[1px] rounded-lg bg-gradient-to-r from-primary to-[#8F668C]">
            <div className="bg-card rounded-lg p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                
                {/* Pains Column */}
                <div className="space-y-6">
                  <h3 className="text-2xl font-semibold">U hoeft niet</h3>
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
                  <h3 className="text-2xl font-semibold">Kalme Duidelijkheid met Tovy</h3>
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
        </div>
      </section>
    </div>
  );
}
