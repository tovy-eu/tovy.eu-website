"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { logEvent } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, Send, CheckCircle, Check, Home } from "lucide-react";
import { cn } from "@/lib/utils";

const formSteps = [
  { field: "maturity", label: "Hoe volwassen is uw gebruik van AI?*", description: "Dit helpt ons te zien hoe ver u AI in uw bedrijf heeft doorgevoerd." },
  { field: "companySize", label: "Wat is uw bedrijfsgrootte?*", description: "Dit helpt ons de schaal van uw organisatie en de mogelijke projectomvang te begrijpen." },
  { field: "engineeringTeam", label: "Heeft u een intern engineeringteam?*", description: "Dit helpt ons te begrijpen of we zullen samenwerken met uw team of de ontwikkeling end-to-end zullen afhandelen." },
  { field: "projectDetails", label: "Waarmee heeft u hulp nodig?*"},
  { field: "budgetReadiness", label: "Bent u klaar om in dit project te investeren?*", description: "Onze projecten beginnen doorgaans vanaf $10.000, wat MVP's, pilots of eerste productiebuilds dekt." },
  { field: "timelineReadiness", label: "We gaan graag snel – u ook?*", description: "Na de aftrap kan ons team binnen twee weken een eerste werkende versie opleveren. We hebben elke maand beperkte capaciteit, dus we geven voorrang aan bedrijven die klaar zijn om actie te ondernemen." },
  { field: "contactDetails", label: "Contactgegevens*", description: "Deel alstublieft uw naam en bedrijfsinformatie." },
];

const totalSteps = formSteps.length;

const options: Record<string, { label: string, hint?: string }[]> = {
  companySize: [
    { label: "1-10 medewerkers" },
    { label: "11-50 medewerkers" },
    { label: "51-200 medewerkers" },
    { label: "201+ medewerkers" },
  ],
  engineeringTeam: [
    { label: "Ja", hint: "J" },
    { label: "Nee", hint: "N" },
  ],
  budgetReadiness: [
    { label: "Ja, dat past", hint: "A" },
    { label: "Nee, nu niet", hint: "B" },
  ],
  timelineReadiness: [
    { label: "Ja, we zijn er klaar voor om binnenkort te beginnen", hint: "A" },
    { label: "Nog niet, we zijn ons intern nog aan het voorbereiden", hint: "B" },
  ],
};

export function ProjectIntakeForm() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [showChallenges, setShowChallenges] = useState(false);
  const [showVision, setShowVision] = useState(false);

  const currentField = formSteps[step].field as keyof ProjectRequestData | "projectDetails" | "contactDetails";

  const form = useForm<ProjectRequestData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      maturity: "",
      companySize: "",
      engineeringTeam: "",
      projectFocus: "",
      challenges: "",
      vision: "",
      budgetReadiness: "",
      timelineReadiness: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      company: "",
    },
    mode: 'onChange',
  });
  
  const projectFocus = form.watch("projectFocus");
  const challenges = form.watch("challenges");

  useEffect(() => {
    logEvent("began_project_form");
  }, []);

  useEffect(() => {
    if (projectFocus) {
      const timer = setTimeout(() => {
        setShowChallenges(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowChallenges(false);
    }
  }, [projectFocus]);

  useEffect(() => {
    if (challenges) {
      const timer = setTimeout(() => {
        setShowVision(true);
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShowVision(false);
    }
  }, [challenges]);


  const onSubmit = (data: ProjectRequestData) => {
    startTransition(() => {
      console.log("Form data submitted:", data);
      logEvent("submitted_project_request", {
        companySize: data.companySize,
        engineeringTeam: data.engineeringTeam,
      });
      setFormSubmitted(true);
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProjectRequestData)[] = [];
    if (currentField === 'projectDetails') {
      fieldsToValidate = ['projectFocus', 'challenges', 'vision'];
    } else if (currentField === 'contactDetails') {
      fieldsToValidate = ['firstName', 'lastName', 'phone', 'email', 'company'];
    } else {
      fieldsToValidate = [currentField as keyof ProjectRequestData];
    }
        
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      if (step < totalSteps - 1) {
        setStep(s => s + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 0));
  };
  
  if (formSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto border-0 md:border md:shadow-lg">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Bedankt!</CardTitle>
          <CardDescription>
            Uw projectaanvraag is ingediend. We nemen spoedig contact met u op.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Terug naar de startpagina
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const renderContactDetailsStep = () => {
    const { label, description } = formSteps[step];
    return (
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-4">
            <span className="text-primary font-semibold">{step + 1} →</span>
            <h2 className="text-2xl font-semibold">{label}</h2>
          </div>
          {description && <p className="text-muted-foreground mt-2">{description}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField control={form.control} name="firstName" render={({ field }) => (
            <FormItem><FormLabel>Voornaam *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem><FormLabel>Achternaam *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefoonnummer *</FormLabel>
              <FormControl>
                <PhoneInput
                  international
                  defaultCountry="NL"
                  className="[&_input]:h-10 [&_input]:w-full [&_input]:rounded-md [&_input]:border [&_input]:border-input [&_input]:bg-background [&_input]:px-3 [&_input]:py-2 [&_input]:text-base [&_input]:ring-offset-background file:[&_input]:border-0 file:[&_input]:bg-transparent file:[&_input]:text-sm file:[&_input]:font-medium placeholder:[&_input]:text-muted-foreground focus-visible:[&_input]:outline-none focus-visible:[&_input]:ring-2 focus-visible:[&_input]:ring-ring focus-visible:[&_input]:ring-offset-2 disabled:[&_input]:cursor-not-allowed disabled:[&_input]:opacity-50 md:[&_input]:text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>E-mail *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Bedrijf *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
      </div>
    )
  };
  
  const renderProjectDetailsStep = () => {
    return (
      <div className="space-y-8">
        {/* Project Focus */}
        <FormField
          control={form.control}
          name="projectFocus"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <span className="text-primary font-semibold">{step + 1} →</span>
                <FormLabel className="text-2xl font-semibold">Waarmee heeft u hulp nodig?*</FormLabel>
              </div>
              <p className="text-muted-foreground mt-2">Vertel ons in één zin wat u wilt bouwen of verbeteren met AI.</p>
              <FormControl>
                <Textarea placeholder="bv. Een klantenservice-chatbot bouwen" {...field} className="text-lg mt-4 min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Challenges */}
        {showChallenges && (
          <div className="border-t border-border pt-8">
            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">Kunt u de specifieke uitdagingen waarmee u wordt geconfronteerd nader toelichten?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="bv. Hoog ondersteuningsvolume, trage responstijden..." {...field} className="text-lg mt-4 min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {/* Vision */}
        {showVision && (
          <div className="border-t border-border pt-8">
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl font-semibold">Hoe ziet u de interactie en het gebruik van AI-agenten hiermee voor zich?</FormLabel>
                   <FormControl>
                    <Textarea placeholder="bv. Agenten moeten veelvoorkomende vragen afhandelen en complexe problemen escaleren." {...field} className="text-lg mt-4 min-h-[100px]" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    );
  };

  const renderField = () => {
    const { field, label, description } = formSteps[step];
    
    if (field === 'projectDetails') {
      return renderProjectDetailsStep();
    }
    
    if (field === 'contactDetails') {
      return renderContactDetailsStep();
    }

    if (field === 'maturity') {
      return (
        <FormField
          control={form.control}
          name="maturity"
          render={({ field: formField }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <span className="text-primary font-semibold">{step + 1} →</span>
                <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
              </div>
              {description && <p className="text-muted-foreground mt-2">{description}</p>}
              
              <FormControl>
                <div>
                  <div className="flex justify-between gap-1 my-4">
                    {Array.from({ length: 11 }, (_, i) => i).map(value => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          formField.onChange(String(value));
                          setTimeout(() => nextStep(), 200);
                        }}
                        className={cn(
                          "h-10 w-10 flex items-center justify-center border rounded-md transition-colors text-sm",
                          formField.value === String(value)
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Net begonnen</span>
                    <span>Gebruikt al AI-tools</span>
                    <span>Aangepaste AI gebouwd</span>
                  </div>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }
    
    if (['companySize', 'engineeringTeam', 'budgetReadiness', 'timelineReadiness'].includes(field)) {
      const fieldName = field as 'companySize' | 'engineeringTeam' | 'budgetReadiness' | 'timelineReadiness';
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem>
              <div className="flex items-center gap-4">
                <span className="text-primary font-semibold">{step + 1} →</span>
                <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
              </div>
              {description && <p className="text-muted-foreground mt-2">{description}</p>}
              
              <FormControl>
                <div className="space-y-3 pt-4 max-w-sm">
                  {options[fieldName].map(option => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => {
                        formField.onChange(option.label);
                        setTimeout(() => nextStep(), 200);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between text-left p-3 border rounded-md transition-colors",
                        formField.value === option.label
                          ? "bg-primary/10 border-primary ring-2 ring-primary"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {option.hint && (
                          <div className="flex items-center justify-center h-6 w-6 border rounded-sm text-xs text-muted-foreground bg-background">
                            {option.hint}
                          </div>
                        )}
                        <span className="font-medium">{option.label}</span>
                      </div>
                      {formField.value === option.label && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return null;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-0 md:border md:shadow-lg">
      <CardHeader>
        <Progress value={(step / totalSteps) * 100} className="w-full" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <CardContent className="min-h-[350px] flex items-center">
            <div className="w-full">
              {renderField()}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            {step > 0 ? (
              <Button type="button" variant="ghost" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Vorige
              </Button>
            ) : <div />}
            
            {(currentField === 'projectDetails' || currentField === 'maturity') && step < totalSteps -1 ? (
              <Button type="button" onClick={nextStep}>
                Volgende <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}

            {step === totalSteps - 1 ? (
              <Button type="button" onClick={nextStep} size="lg" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Bezig met indienen...
                  </>
                ) : "Project indienen"}
              </Button>
            ) : null}

            {/* This is a hidden submit button to allow form submission on enter */}
            <button type="submit" className="hidden" disabled={isPending}></button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
