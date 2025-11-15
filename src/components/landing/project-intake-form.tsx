

"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
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
import { Checkbox } from "../ui/checkbox";

const formSteps = [
  { field: "maturity", label: "How advanced is your Data Maturity?*", description: "This helps us understand your current data capabilities." },
  { field: "companySize", label: "What is your company size?*", description: "This helps us understand the scale of your organization and potential project scope." },
  { field: "engineeringTeam", label: "Do you have an in-house engineering team?*", description: "This helps us know if we'll be partnering with your developers." },
  { field: "projectDetails", label: "Tell us about your automation gap or project*"},
  { field: "budgetReadiness", label: "What's your budget outlook?*", description: "Our projects typically start from $2.500, covering MVPs, pilots, or initial production builds." },
  { field: "timelineReadiness", label: "How soon do you want to start?*", description: "We can deliver a working version in about two weeks. We prioritize companies ready to move quickly." },
  { field: "contactDetails", label: "How can we reach you?*", description: "Please provide your contact and company information." },
];

const totalSteps = formSteps.length;

const options: Record<string, { label: string, hint?: string }[]> = {
  companySize: [
    { label: "1-10 employees", hint: "A" },
    { label: "11-50 employees", hint: "B" },
    { label: "51-200 employees", hint: "C" },
    { label: "201+ employees", hint: "D" },
  ],
  engineeringTeam: [
    { label: "Yes", hint: "Y" },
    { label: "No", hint: "N" },
  ],
  budgetReadiness: [
    { label: "Yes, that fits", hint: "Y" },
    { label: "No, not right now", hint: "N" },
  ],
  timelineReadiness: [
    { label: "Yes, we're ready to start soon", hint: "Y" },
    { label: "Not yet, we're still preparing internally", hint: "N" },
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
    // A good place for an analytics event
  }, []);

  useEffect(() => {
    if (projectFocus) {
      const timer = setTimeout(() => {
        setShowChallenges(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowChallenges(false);
    }
  }, [projectFocus]);

  useEffect(() => {
    if (challenges) {
      const timer = setTimeout(() => {
        setShowVision(true);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setShowVision(false);
    }
  }, [challenges]);


  const onSubmit = (data: ProjectRequestData) => {
    startTransition(() => {
      console.log("Form data submitted:", data);
      // A good place for an analytics event
      setFormSubmitted(true);
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProjectRequestData)[] = [];
    if (currentField === 'projectDetails') {
      fieldsToValidate = ['projectFocus', 'challenges', 'vision'];
    } else if (currentField === 'contactDetails') {
      fieldsToValidate = ['firstName', 'lastName', 'phone', 'email', 'company', 'consent'];
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (['TEXTAREA', 'INPUT'].includes((event.target as HTMLElement).tagName)) {
        return;
      }
      
      const key = event.key.toUpperCase();
      const currentStepField = formSteps[step].field;

      const handleOptionSelect = (fieldName: keyof ProjectRequestData, value: string) => {
        form.setValue(fieldName, value);
        setTimeout(() => nextStep(), 200);
      };

      if (currentStepField === 'maturity' && !isNaN(parseInt(key, 10)) && event.key.length === 1) {
        event.preventDefault();
        const numValue = parseInt(key, 10);
        if (numValue >= 0 && numValue <= 10) {
            handleOptionSelect('maturity', String(numValue));
        }
      }

      if (currentStepField === 'companySize' && ['A', 'B', 'C', 'D'].includes(key)) {
        event.preventDefault();
        const selectedOption = options.companySize.find(o => o.hint === key);
        if (selectedOption) {
          handleOptionSelect('companySize', selectedOption.label);
        }
      }
      
      const yesNoFields: (keyof ProjectRequestData)[] = ['engineeringTeam', 'budgetReadiness', 'timelineReadiness'];
      if (yesNoFields.includes(currentStepField as any) && ['Y', 'N'].includes(key)) {
        event.preventDefault();
        const fieldOptions = options[currentStepField as 'engineeringTeam' | 'budgetReadiness' | 'timelineReadiness'];
        const selectedOption = fieldOptions.find(o => o.hint === key);
        if (selectedOption) {
          handleOptionSelect(currentStepField as keyof ProjectRequestData, selectedOption.label);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [step, form, nextStep]);
  
  if (formSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm opacity-90">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Thank You!</CardTitle>
          <CardDescription>
            Your project request has been submitted. We will contact you shortly.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Homepage
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
            <FormItem><FormLabel>First Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="lastName" render={({ field }) => (
            <FormItem><FormLabel>Last Name *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number *</FormLabel>
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
          <FormItem><FormLabel>Email *</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="company" render={({ field }) => (
          <FormItem><FormLabel>Company *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField
          control={form.control}
          name="consent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  I agree to the{" "}
                  <Link href="/privacy-policy" target="_blank" className="underline hover:text-primary">
                    Privacy Policy
                  </Link>
                  .
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
      </div>
    );
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
                <FormLabel className="text-2xl font-semibold">Tell us about your automation gap or project*</FormLabel>
              </div>
              <p className="text-muted-foreground mt-2">In one sentence, what are you hoping to build or improve?</p>
              <FormControl>
                <Textarea placeholder="e.g., An AI chatbot to handle customer support inquiries..." {...field} className="text-lg mt-4 min-h-[100px]" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Challenges */}
        <div className={cn("border-t border-border pt-8 transition-opacity duration-500", showChallenges ? "opacity-100" : "opacity-0")}>
          <FormField
            control={form.control}
            name="challenges"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">What are the main challenges you're facing right now?</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g., Our support team is overwhelmed and response times are slow." {...field} className="text-lg mt-4 min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Vision */}
        <div className={cn("border-t border-border pt-8 transition-opacity duration-500", showVision ? "opacity-100" : "opacity-0")}>
          <FormField
            control={form.control}
            name="vision"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xl font-semibold">What's your vision for how this solution will work?</FormLabel>
                 <FormControl>
                  <Textarea placeholder="e.g., We want an AI that can answer common questions and knows when to escalate to a human agent." {...field} className="text-lg mt-4 min-h-[100px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
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
                          "h-10 w-10 flex items-center justify-center border rounded-md transition-all text-sm",
                          formField.value === String(value)
                            ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background"
                            : "bg-muted hover:bg-muted/80"
                        )}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>Just starting</span>
                    <span>Using AI tools</span>
                    <span>Built custom AI</span>
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
                        "w-full flex items-center justify-between text-left p-3 border rounded-md transition-all",
                        formField.value === option.label
                          ? "bg-primary/10 border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
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
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm opacity-90">
      <CardHeader>
        <Progress value={(step / totalSteps) * 100} className="w-full h-2" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <CardContent className="min-h-[600px] flex items-center">
            <div className="w-full">
              {renderField()}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4 min-h-[52px]">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            
            <div className="flex justify-end flex-grow">
              {(currentField === 'projectDetails' || currentField === 'contactDetails') && step < totalSteps - 1 ? (
                <Button type="button" onClick={nextStep}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : null}

              {step === totalSteps - 1 ? (
                <Button type="button" onClick={nextStep} size="lg" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : "Submit Project"}
                </Button>
              ) : null}
            </div>

            {/* This is a hidden submit button to allow form submission on enter */}
            <button type="submit" className="hidden" disabled={isPending}></button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
