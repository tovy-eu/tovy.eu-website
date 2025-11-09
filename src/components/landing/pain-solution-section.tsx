import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";

export function PainSolutionSection() {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-base font-semibold leading-7 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          The Tovy Difference
        </h2>
        <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          AI should simplify, not complicate.
        </p>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-destructive/10 border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="text-destructive" />
              <span>The Chaos of Traditional AI</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Black-box systems you can't control.</p>
            <p>Endless tweaking and unreliable results.</p>
            <p>Complex tools that slow down your team.</p>
            <p>Unpredictable costs and project delays.</p>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="text-primary" />
              <span>Calm Clarity with Tovy</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Transparent systems with full code ownership.</p>
            <p>Reliable, predictable, and optimized performance.</p>
            <p>Simple integration and developer-first approach.</p>
            <p>Peace of mind with clear deliverables and support.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
