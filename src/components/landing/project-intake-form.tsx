"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { logEvent } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, Send, CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const formSteps = [
  { field: "maturity", label: "How mature is your use of AI?*", description: "This helps us see how far you've taken AI in your business." },
  { field: "companySize", label: "What's your company size?*", description: "This helps us understand the scale of your organization and potential project scope." },
  { field: "engineeringTeam", label: "Do you have an in-house engineering team?*", description: "This helps us understand if we'll collaborate with your team or handle development end-to-end." },
  { field: "projectDetails", label: "What do you need help with?*"},
  { field: "budgetReadiness", label: "Are you ready to invest in this project?*", description: "Our projects typically start from $10,000, which covers MVPs, pilots, or first production builds." },
  { field: "timelineReadiness", label: "We like to move fast – do you?*", description: "After kickoff, our team can deliver a first working version within two weeks. We have limited capacity each month, so we prioritize companies ready to take action." },
  { field: "contactDetails", label: "Contact details*", description: "Please share your name and company information." },
];

const totalSteps = formSteps.length;

const options: Record<string, { label: string, hint?: string }[]> = {
  companySize: [
    { label: "1-10 employees" },
    { label: "11-50 employees" },
    { label: "51-200 employees" },
    { label: "201+ employees" },
  ],
  engineeringTeam: [
    { label: "Yes", hint: "Y" },
    { label: "No", hint: "N" },
  ],
  budgetReadiness: [
    { label: "Yes, that fits", hint: "A" },
    { label: "No, not right now", hint: "B" },
  ],
  timelineReadiness: [
    { label: "Yes, we're ready to start soon", hint: "A" },
    { label: "Not yet, still preparing internally", hint: "B" },
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
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>
            Your project request has been submitted. We'll be in touch shortly.
          </CardDescription>
        </CardHeader>
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
            <FormItem><FormLabel>First name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem><FormLabel>Last name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="phone" render={({ field }) => (
          <FormItem><FormLabel>Phone number *</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="email" render={({ field }) => (
          <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
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
                <FormLabel className="text-2xl font-semibold">What do you need help with?*</FormLabel>
              </div>
              <p className="text-muted-foreground mt-2">In one sentence, tell us what you want to build or improve with AI.</p>
              <FormControl>
                <Textarea placeholder="e.g., Build a customer support chatbot" {...field} className="text-lg mt-4 min-h-[100px]" />
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
                  <FormLabel className="text-xl font-semibold">Could you elaborate on the specific challenges you're facing?</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., High support volume, slow response times..." {...field} className="text-lg mt-4 min-h-[100px]" />
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
                  <FormLabel className="text-xl font-semibold">How do you envision AI agents interacting with and utilizing this?</FormLabel>
                   <FormControl>
                    <Textarea placeholder="e.g., Agents should handle common queries and escalate complex issues." {...field} className="text-lg mt-4 min-h-[100px]" />
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
                <>
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
                    <span>Just getting started</span>
                    <span>Already using AI tools</span>
                    <span>Built custom AI</span>
                  </div>
                </>
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
        <Progress value={((step + 1) / totalSteps) * 100} className="w-full" />
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
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : <div />}
            
            {currentField === 'projectDetails' ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
            
            {step === totalSteps - 1 ? (
               isPending ? (
                <Button type="submit" disabled={true} size="lg">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </Button>
               ) : (
                <Button type="button" onClick={nextStep} size="lg">
                  OK
                </Button>
               )
            ) : null }

            {/* This is a hidden submit button to allow form submission on enter */}
            <button type="submit" className="hidden" disabled={isPending}></button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
