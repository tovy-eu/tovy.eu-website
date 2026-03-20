"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Check, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";
import type { Dictionary } from "@/lib/get-dictionary";

interface ProjectIntakeFormProps {
  dict: Dictionary;
}

const STORAGE_KEY = "tovy_project_form_progress";

export function ProjectIntakeForm({ dict }: ProjectIntakeFormProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  const [showChallenges, setShowChallenges] = useState(false);
  const [showVision, setShowVision] = useState(false);

  const formSteps = [
    { field: "maturity", label: dict.projectForm.steps.maturity.label, description: dict.projectForm.steps.maturity.description },
    { field: "companySize", label: dict.projectForm.steps.companySize.label, description: dict.projectForm.steps.companySize.description },
    { field: "engineeringTeam", label: dict.projectForm.steps.engineeringTeam.label, description: dict.projectForm.steps.engineeringTeam.description },
    { field: "projectDetails", label: dict.projectForm.steps.details.label },
    { field: "budgetReadiness", label: dict.projectForm.steps.budget.label, description: dict.projectForm.steps.budget.description },
    { field: "timelineReadiness", label: dict.projectForm.steps.timeline.label, description: dict.projectForm.steps.timeline.description },
    { field: "contactDetails", label: dict.projectForm.steps.contact.label, description: dict.projectForm.steps.contact.description },
  ];

  const totalSteps = formSteps.length;

  const options: Record<string, { label: string, hint?: string }[]> = {
    companySize: dict.projectForm.steps.companySize.options.map((opt: string, i: number) => ({
      label: opt,
      hint: String.fromCharCode(65 + i)
    })),
    engineeringTeam: [
      { label: dict.projectForm.steps.engineeringTeam.options.yes, hint: "Y" },
      { label: dict.projectForm.steps.engineeringTeam.options.no, hint: "N" },
    ],
    budgetReadiness: [
      { label: dict.projectForm.steps.budget.options.yes, hint: "Y" },
      { label: dict.projectForm.steps.budget.options.no, hint: "N" },
    ],
    timelineReadiness: [
      { label: dict.projectForm.steps.timeline.options.yes, hint: "Y" },
      { label: dict.projectForm.steps.timeline.options.no, hint: "N" },
    ],
  };

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
      consent: false,
    },
    mode: 'onChange',
  });
  
  const projectFocus = form.watch("projectFocus");
  const challenges = form.watch("challenges");
  const allValues = form.watch();

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const { step: savedStep, data: savedData } = JSON.parse(savedProgress);
        setStep(savedStep);
        form.reset(savedData);
      } catch (e) {
        console.error("Failed to load form progress", e);
      }
    }
  }, [form]);

  // Save progress to localStorage whenever step or data changes
  useEffect(() => {
    if (!formSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data: allValues }));
    }
  }, [step, allValues, formSubmitted]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty && !formSubmitted) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [form.formState.isDirty, formSubmitted]);

  useEffect(() => {
    if (projectFocus) {
      const timer = setTimeout(() => {
        setShowChallenges(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowChallenges(false);
    }
  }, [projectFocus]);

  useEffect(() => {
    if (challenges) {
      const timer = setTimeout(() => {
        setShowVision(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowVision(false);
    }
  }, [challenges]);


  const onSubmit = (data: ProjectRequestData) => {
    startTransition(async () => {
      try {
        await addDoc(collection(db, "project_requests"), {
          ...data,
          timestamp: new Date(),
        });
        
        // Final conversion event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'project_request_success', {
            event_category: 'conversion',
            event_label: 'Project Form Submitted'
          });
        }

        // Clear saved progress on success
        localStorage.removeItem(STORAGE_KEY);
        setFormSubmitted(true);
      } catch (error) {
        console.error("Failed to submit project request:", error);
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your request. Please try again later.",
          variant: "destructive",
        });
      }
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
      // Analytics tracking
      if (typeof window !== 'undefined' && window.gtag) {
        // Trigger analytics event when moving past the first step
        if (step === 0) {
          window.gtag('event', 'project_request_started', {
            event_category: 'conversion',
            event_label: 'Data Maturity Selection',
            value: form.getValues('maturity')
          });
        }

        // Trigger step completion event for all steps
        window.gtag('event', 'project_request_step_complete', {
          event_category: 'conversion',
          step_number: step + 1,
          step_name: formSteps[step].field,
        });
      }

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
      <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-0 shadow-none flex flex-col items-center justify-center p-8">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-12 w-12 md:h-16 md:w-16 bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent mb-4" />
          <CardTitle className="text-xl md:text-2xl">{dict.projectForm.success.title}</CardTitle>
          <CardDescription>
            {dict.projectForm.success.description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-center mt-4">
          <Button asChild variant="outline" className="border-0 bg-white/5 hover:bg-white/10">
            <Link href={`/${lang}/`}>
              <Home className="mr-2 h-4 w-4" />
              {dict.projectForm.success.backHome}
            </Link>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const renderStep = (stepIndex: number) => {
    const { field, label, description } = formSteps[stepIndex];
    const isVisible = step === stepIndex;
    const commonProps = {
      className: cn(!isVisible && "hidden")
    };
  
    if (field === 'maturity') {
      return (
        <div {...commonProps}>
          <FormField
            control={form.control}
            name="maturity"
            render={({ field: formField }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-semibold text-sm md:text-base">{stepIndex + 1} →</span>
                  <FormLabel className="text-lg md:text-2xl font-semibold leading-tight">{label}</FormLabel>
                </div>
                {description && <p className="text-muted-foreground mt-1 text-xs md:text-sm">{description}</p>}
                
                <FormControl>
                  <div className="mt-4 md:mt-6">
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:flex md:justify-between gap-1.5 md:gap-1">
                      {Array.from({ length: 11 }, (_, i) => i).map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            formField.onChange(String(value));
                            setTimeout(() => nextStep(), 200);
                          }}
                          className={cn(
                            "h-10 w-full md:h-10 md:w-10 flex items-center justify-center rounded-md transition-all text-sm border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                            formField.value === String(value)
                              ? "bg-primary text-primary-foreground shadow-lg scale-105"
                              : "bg-white/5 hover:bg-white/10"
                          )}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] md:text-xs text-muted-foreground mt-3 px-1">
                      <span>{dict.projectForm.steps.maturity.low}</span>
                      <span className="hidden sm:inline">{dict.projectForm.steps.maturity.mid}</span>
                      <span>{dict.projectForm.steps.maturity.high}</span>
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }
  
    if (['companySize', 'engineeringTeam', 'budgetReadiness', 'timelineReadiness'].includes(field)) {
      const fieldName = field as 'companySize' | 'engineeringTeam' | 'budgetReadiness' | 'timelineReadiness';
      return (
        <div {...commonProps}>
          <FormField
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-semibold text-sm md:text-base">{stepIndex + 1} →</span>
                  <FormLabel className="text-lg md:text-2xl font-semibold leading-tight">{label}</FormLabel>
                </div>
                {description && <p className="text-muted-foreground mt-1 text-xs md:text-sm">{description}</p>}
                
                <FormControl>
                  <div className="space-y-2 pt-4 max-w-sm">
                    {options[fieldName].map(option => (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => {
                          formField.onChange(option.label);
                          setTimeout(() => nextStep(), 200);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between text-left p-3 rounded-md transition-all border-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background min-h-[48px]",
                          formField.value === option.label
                            ? "bg-primary/20 shadow-inner"
                            : "bg-white/5 hover:bg-white/10"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {option.hint && (
                            <div className="flex items-center justify-center h-5 w-5 rounded-sm text-[9px] font-bold text-muted-foreground bg-black/20">
                              {option.hint}
                            </div>
                          )}
                          <span className="font-medium text-xs md:text-sm">{option.label}</span>
                        </div>
                        {formField.value === option.label && <Check className="h-4 w-4 text-primary" />}
                      </button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      );
    }
  
    if (field === 'projectDetails') {
      return (
        <div {...commonProps} className={cn("space-y-4 md:space-y-6", !isVisible && "hidden")}>
          <FormField
            control={form.control}
            name="projectFocus"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-semibold text-sm md:text-base">{stepIndex + 1} →</span>
                  <FormLabel className="text-lg md:text-xl font-semibold leading-tight">{dict.projectForm.steps.details.label}</FormLabel>
                </div>
                <p className="text-muted-foreground mt-1 text-xs md:text-sm">{dict.projectForm.steps.details.focusLabel}</p>
                <FormControl>
                  <Textarea 
                    placeholder={dict.projectForm.steps.details.focusPlaceholder} 
                    {...field} 
                    className="text-sm md:text-base mt-2 min-h-[60px] md:min-h-[80px] bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className={cn("transition-all duration-500", showChallenges ? "opacity-100 h-auto" : "opacity-0 invisible h-0 overflow-hidden")}>
            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-semibold">{dict.projectForm.steps.details.challengesLabel}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={dict.projectForm.steps.details.challengesPlaceholder} 
                      {...field} 
                      className="text-sm md:text-base mt-2 min-h-[60px] md:min-h-[80px] bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className={cn("transition-all duration-500", showVision ? "opacity-100 h-auto" : "opacity-0 invisible h-0 overflow-hidden")}>
            <FormField
              control={form.control}
              name="vision"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base font-semibold">{dict.projectForm.steps.details.visionLabel}</FormLabel>
                   <FormControl>
                    <Textarea 
                      placeholder={dict.projectForm.steps.details.visionPlaceholder} 
                      {...field} 
                      className="text-sm md:text-base mt-2 min-h-[60px] md:min-h-[80px] bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    }
  
    if (field === 'contactDetails') {
      return (
        <div {...commonProps} className={cn("space-y-4 md:space-y-5", !isVisible && "hidden")}>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-primary font-semibold text-sm md:text-base">{stepIndex + 1} →</span>
              <h2 className="text-lg md:text-xl font-semibold leading-tight">{label}</h2>
            </div>
            {description && <p className="text-muted-foreground mt-1 text-xs md:text-sm">{description}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <FormField control={form.control} name="firstName" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">{dict.projectForm.steps.contact.firstName}</FormLabel><FormControl><Input {...field} className="h-9 md:h-10 text-sm bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" /></FormControl><FormMessage /></FormItem>
            )} />
            <FormField control={form.control} name="lastName" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">{dict.projectForm.steps.contact.lastName}</FormLabel><FormControl><Input {...field} className="h-9 md:h-10 text-sm bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs">{dict.projectForm.steps.contact.phone}</FormLabel>
                  <FormControl>
                    <PhoneInput
                      international
                      defaultCountry="NL"
                      className="[&_input]:h-9 md:[&_input]:h-10 [&_input]:w-full [&_input]:rounded-md [&_input]:border-0 [&_input]:bg-white/5 [&_input]:px-3 [&_input]:py-2 [&_input]:text-sm focus-visible:[&_input]:outline-none focus-visible:[&_input]:ring-1 focus-visible:[&_input]:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="email" render={({ field }) => (
              <FormItem><FormLabel className="text-xs">{dict.projectForm.steps.contact.email}</FormLabel><FormControl><Input type="email" {...field} className="h-9 md:h-10 text-sm bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" /></FormControl><FormMessage /></FormItem>
            )} />
          </div>
          <FormField control={form.control} name="company" render={({ field }) => (
            <FormItem><FormLabel className="text-xs">{dict.projectForm.steps.contact.company}</FormLabel><FormControl><Input {...field} className="h-9 md:h-10 text-sm bg-white/5 border-0 shadow-none focus-visible:ring-1 focus-visible:ring-primary" /></FormControl><FormMessage /></FormItem>
            )} />
          <FormField
            control={form.control}
            name="consent"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="h-4 w-4"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-[10px] md:text-xs">
                    {dict.common.agreeTo}{" "}
                    <Link href={`/${lang}/privacy-policy/`} target="_blank" className="underline hover:text-primary">
                      {dict.common.privacyPolicy}
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
    }
  
    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-card/80 backdrop-blur-sm border-0 shadow-none overflow-hidden flex flex-col h-full max-h-[90vh] md:max-h-none">
      <CardHeader className="p-4 pb-2">
        <Progress value={(step / totalSteps) * 100} className="w-full h-1.5" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 flex items-center">
            <div className="w-full">
              {formSteps.map((_, index) => (
                <div key={`step-${index}`}>
                  {renderStep(index)}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between p-4 border-t border-white/5 shrink-0">
            <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0} className="hover:bg-white/5 text-xs h-9">
              <ArrowLeft className="mr-1 h-3 w-3" /> {dict.projectForm.buttons.previous}
            </Button>
            
            <div className="flex justify-end flex-grow">
              {(currentField === 'projectDetails' || currentField === 'contactDetails' || step < totalSteps - 1) && (
                <Button type="button" onClick={nextStep} disabled={isPending || step === totalSteps - 1} className="text-xs h-9">
                  {dict.projectForm.buttons.next} <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              )}

              {step === totalSteps - 1 && (
                <Button type="button" onClick={form.handleSubmit(onSubmit)} size="sm" disabled={isPending} className="text-xs px-6 h-9">
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" /> {dict.projectForm.buttons.submitting}
                    </>
                  ) : dict.projectForm.buttons.submit}
                </Button>
              )}
            </div>
            <button type="submit" className="hidden" disabled={isPending}></button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
