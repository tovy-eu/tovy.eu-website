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
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Check, Home, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/get-dictionary";
import { trackEvent, getVisitorId, getTraceId } from "@/lib/analytics";
import { Magnetic } from "@/components/ui/magnetic";

interface ProjectIntakeFormProps {
  dict: Dictionary;
}

const STORAGE_KEY = "tovy_project_form_progress";

type RoutingPath = 'A' | 'B' | 'C';

export function ProjectIntakeForm({ dict }: ProjectIntakeFormProps) {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<ProjectRequestData | null>(null);
  const [routingPath, setRoutingPath] = useState<RoutingPath>('B');
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';

  const formSteps = [
    { field: "workEmail", label: dict.projectForm.steps.workEmail.label, description: dict.projectForm.steps.workEmail.description },
    { field: "companySize", label: dict.projectForm.steps.companySize.label, description: dict.projectForm.steps.companySize.description },
    { field: "objectives", label: dict.projectForm.steps.objectives.label, description: dict.projectForm.steps.objectives.description },
    { field: "infrastructure", label: dict.projectForm.steps.infrastructure.label, description: dict.projectForm.steps.infrastructure.description },
    { field: "bottlenecks", label: dict.projectForm.steps.bottlenecks.label, description: dict.projectForm.steps.bottlenecks.description },
    { field: "timeline", label: dict.projectForm.steps.timeline.label, description: dict.projectForm.steps.timeline.description },
    { field: "budget", label: dict.projectForm.steps.budget.label, description: dict.projectForm.steps.budget.description },
    { field: "contactDetails", label: dict.projectForm.steps.contact.label, description: dict.projectForm.steps.contact.description },
  ];

  const totalSteps = formSteps.length;

  const multiOptions = {
    objectives: Object.entries(dict.projectForm.steps.objectives.options).map(([key, label]) => ({ key, label: label as string })),
    infrastructure: Object.entries(dict.projectForm.steps.infrastructure.options).map(([key, label]) => ({ key, label: label as string })),
    bottlenecks: Object.entries(dict.projectForm.steps.bottlenecks.options).map(([key, label]) => ({ key, label: label as string })),
  };

  const singleOptions = {
    companySize: dict.projectForm.steps.companySize.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    timeline: dict.projectForm.steps.timeline.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    budget: dict.projectForm.steps.budget.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
  };

  const currentField = formSteps[step].field as keyof ProjectRequestData | "contactDetails";

  const form = useForm<ProjectRequestData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      workEmail: "",
      companySize: "",
      objectives: [],
      objectivesOther: "",
      infrastructure: [],
      bottlenecks: [],
      bottlenecksOther: "",
      timeline: "",
      budget: "",
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      consent: false,
    },
    mode: 'onChange',
  });
  
  const allValues = form.watch();

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

  useEffect(() => {
    if (!formSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data: allValues }));
    }
  }, [step, allValues, formSubmitted]);

  useEffect(() => {
    if (formSubmitted && submittedValues && (routingPath === 'A' || routingPath === 'B')) {
      const name = `${submittedValues.firstName} ${submittedValues.lastName}`.trim();
      const email = submittedValues.workEmail;
      const calendlyUrl = `https://calendly.com/tovy-info?background_color=080c1b&text_color=ffffff&primary_color=365af6&hide_gdpr_banner=1&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

      const initCalendly = () => {
        if ((window as any).Calendly) {
          (window as any).Calendly.initInlineWidget({
            url: calendlyUrl,
            parentElement: document.querySelector('.calendly-inline-widget'),
          });
          return true;
        }
        return false;
      };

      const interval = setInterval(() => {
        if (initCalendly()) clearInterval(interval);
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [formSubmitted, submittedValues, routingPath]);

  const calculateScore = (data: ProjectRequestData): { score: number, path: RoutingPath } => {
    let score = 0;
    
    const publicEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "zoho.com", "mail.com", "protonmail.com", "gmx.com"];
    const domain = data.workEmail.split('@')[1]?.toLowerCase();
    score += publicEmailDomains.includes(domain) ? -10 : 5;

    const companySizeIndex = singleOptions.companySize.findIndex(o => o.label === data.companySize);
    const sizeScores = [0, 4, 7, 10, 3];
    if (companySizeIndex !== -1) score += sizeScores[companySizeIndex];

    const timelineIndex = singleOptions.timeline.findIndex(o => o.label === data.timeline);
    const timelineScores = [5, 3, 1, -5];
    if (timelineIndex !== -1) score += timelineScores[timelineIndex];

    const budgetIndex = singleOptions.budget.findIndex(o => o.label === data.budget);
    const budgetScores = [-10, 5, 10, 15, 2];
    if (budgetIndex !== -1) score += budgetScores[budgetIndex];

    const isLargeCompany = companySizeIndex === 2 || companySizeIndex === 3;
    const isLargeBudget = budgetIndex === 2 || budgetIndex === 3;
    if (isLargeCompany && isLargeBudget) return { score, path: 'A' };

    const hasLegacy = data.infrastructure.some(i => i.toLowerCase().includes('legacy'));
    if (hasLegacy && isLargeCompany) return { score, path: 'A' };

    if (score >= 18) return { score, path: 'A' };
    if (score >= 5) return { score, path: 'B' };
    return { score, path: 'C' };
  };

  const onSubmit = (data: ProjectRequestData) => {
    startTransition(async () => {
      try {
        const { score, path } = calculateScore(data);
        
        await addDoc(collection(db, "project_requests"), {
          ...data,
          timestamp: new Date(),
          lead_score: score,
          routing_path: path,
          visitor_id: getVisitorId(),
          trace_id: getTraceId(),
        });
        
        trackEvent({
          name: 'project_request_success',
          event_category: 'conversion',
          event_label: `Path ${path} Submission`,
        });

        localStorage.removeItem(STORAGE_KEY);
        setRoutingPath(path);
        setSubmittedValues(data);
        setFormSubmitted(true);
      } catch (error: any) {
        toast({
          title: dict?.common.submissionFailed || "Submission Failed",
          description: error.message || "There was an error submitting your request.",
          variant: "destructive",
        });
      }
    });
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof ProjectRequestData)[] = [];
    if (currentField === 'contactDetails') {
      fieldsToValidate = ['firstName', 'lastName', 'company', 'phone', 'consent'];
    } else {
      fieldsToValidate = [currentField as keyof ProjectRequestData];
    }
        
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      trackEvent({
        name: 'project_request_step_complete',
        event_category: 'conversion',
        step_number: step + 1,
        step_name: formSteps[step].field,
      });

      if (step < totalSteps - 1) {
        setStep(s => s + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="w-full">
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

      {formSubmitted ? (
        <Card className="w-full max-w-3xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-4 md:p-8 animate-scale-in">
          <CardHeader className="text-center pb-6">
            <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4 animate-check-bounce" />
            <CardTitle className="text-xl md:text-2xl">
              {(routingPath === 'A' || routingPath === 'B') ? dict.projectForm.success.title : dict.projectForm.success.titlePathC}
            </CardTitle>
            <CardDescription className="max-w-md mx-auto">
              {(routingPath === 'A' || routingPath === 'B') ? dict.projectForm.success.description : dict.projectForm.success.descriptionPathC}
            </CardDescription>
          </CardHeader>
          
          {(routingPath === 'A' || routingPath === 'B') && (
            <div className="w-full rounded-2xl overflow-hidden bg-black/20 border border-white/5 mb-6 min-h-[700px]">
              <div className="calendly-inline-widget" style={{ minWidth: '320px', height: '700px' }} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            {routingPath === 'C' && (
              <Button asChild className="font-bold">
                <Link href={`/${lang}/kx/`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  {dict.projectForm.success.exploreHub}
                </Link>
              </Button>
            )}
            <Button asChild variant="ghost" className="hover:bg-white/10 text-muted-foreground text-xs">
              <Link href={`/${lang}/`}><Home className="mr-2 h-3 w-3" />{dict.projectForm.success.backHome}</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <CardHeader className="p-4 pb-2">
            <Progress value={(step / totalSteps) * 100} className="w-full h-1.5" />
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
              <CardContent className="p-4 md:p-10 min-h-[400px] flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="w-full"
                  >
                    {formSteps.map((s, index) => {
                      if (step !== index) return null;
                      
                      const { field, label, description } = s;

                      if (field === 'workEmail') {
                        return (
                          <FormField key={field} control={form.control} name="workEmail" render={({ field: f }) => (
                            <FormItem>
                              <div className="flex items-center gap-3">
                                <span className="text-primary font-bold">{index + 1} →</span>
                                <FormLabel className="text-lg md:text-2xl font-bold leading-tight">{label}</FormLabel>
                              </div>
                              <p className="text-muted-foreground mt-2 text-sm">{description}</p>
                              <FormControl>
                                <Input {...f} placeholder={dict.common.emailPlaceholder} className="mt-6 bg-white/5 border-white/10 h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        );
                      }

                      if (['companySize', 'timeline', 'budget'].includes(field)) {
                        const opts = singleOptions[field as keyof typeof singleOptions];
                        return (
                          <FormField key={field} control={form.control} name={field as any} render={({ field: f }) => (
                            <FormItem>
                              <div className="flex items-center gap-3">
                                <span className="text-primary font-bold">{index + 1} →</span>
                                <FormLabel className="text-lg md:text-2xl font-bold leading-tight">{label}</FormLabel>
                              </div>
                              <p className="text-muted-foreground mt-2 text-sm">{description}</p>
                              <div className="grid gap-2 mt-6 max-w-sm">
                                {opts.map(o => (
                                  <button
                                    key={o.label}
                                    type="button"
                                    onClick={() => { f.onChange(o.label); setTimeout(() => nextStep(), 200); }}
                                    className={cn(
                                      "flex items-center justify-between p-4 rounded-xl border border-white/5 text-left transition-all",
                                      f.value === o.label ? "bg-primary/20 border-primary/50" : "bg-white/5 hover:bg-white/10"
                                    )}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className="text-[10px] font-bold text-white/40 bg-black/20 px-2 py-0.5 rounded">{o.hint}</span>
                                      <span className="font-semibold text-sm">{o.label}</span>
                                    </div>
                                    {f.value === o.label && <Check className="h-4 w-4 text-primary" />}
                                  </button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )} />
                        );
                      }

                      if (['objectives', 'infrastructure', 'bottlenecks'].includes(field)) {
                        const opts = multiOptions[field as keyof typeof multiOptions];
                        return (
                          <div key={field}>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-primary font-bold">{index + 1} →</span>
                              <h3 className="text-lg md:text-2xl font-bold leading-tight">{label}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">{description}</p>
                            <div className="grid gap-3">
                              {opts.map(o => (
                                <FormField
                                  key={o.key}
                                  control={form.control}
                                  name={field as any}
                                  render={({ field: f }) => (
                                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                      <FormControl>
                                        <Checkbox
                                          checked={f.value?.includes(o.label)}
                                          onCheckedChange={(checked) => {
                                            const current = f.value || [];
                                            return checked
                                              ? f.onChange([...current, o.label])
                                              : f.onChange(current.filter((v: string) => v !== o.label));
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-medium text-sm cursor-pointer">{o.label}</FormLabel>
                                    </FormItem>
                                  )}
                                />
                              ))}
                              {field === 'objectives' && (
                                <FormField control={form.control} name="objectivesOther" render={({ field: f }) => (
                                  <Input {...f} placeholder="Other goal..." className="bg-white/5 border-white/10 mt-2" />
                                )} />
                              )}
                              {field === 'bottlenecks' && (
                                <FormField control={form.control} name="bottlenecksOther" render={({ field: f }) => (
                                  <Input {...f} placeholder="Other pain point..." className="bg-white/5 border-white/10 mt-2" />
                                )} />
                              )}
                            </div>
                            <FormMessage className="mt-2" />
                          </div>
                        );
                      }

                      if (field === 'contactDetails') {
                        return (
                          <div key={field} className="space-y-6">
                            <div className="flex items-center gap-3">
                              <span className="text-primary font-bold">{index + 1} →</span>
                              <h3 className="text-lg md:text-2xl font-bold leading-tight">{label}</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField control={form.control} name="firstName" render={({ field: f }) => (
                                <FormItem><FormLabel>{dict.projectForm.steps.contact.firstName}</FormLabel><Input {...f} className="bg-white/5 border-white/10" /></FormItem>
                              )} />
                              <FormField control={form.control} name="lastName" render={({ field: f }) => (
                                <FormItem><FormLabel>{dict.projectForm.steps.contact.lastName}</FormLabel><Input {...f} className="bg-white/5 border-white/10" /></FormItem>
                              )} />
                            </div>
                            <FormField control={form.control} name="company" render={({ field: f }) => (
                              <FormItem><FormLabel>{dict.projectForm.steps.contact.company}</FormLabel><Input {...f} className="bg-white/5 border-white/10" /></FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field: f }) => (
                              <FormItem>
                                <FormLabel>{dict.projectForm.steps.contact.phone}</FormLabel>
                                <PhoneInput international defaultCountry="NL" className="[&_input]:bg-white/5 [&_input]:border-white/10" {...f} />
                              </FormItem>
                            )} />
                            <FormField control={form.control} name="consent" render={({ field: f }) => (
                              <FormItem className="flex items-center space-x-2 space-y-0">
                                <Checkbox checked={f.value} onCheckedChange={f.onChange} />
                                <FormLabel className="text-xs cursor-pointer">{dict.projectForm.steps.contact.consent}</FormLabel>
                              </FormItem>
                            )} />
                          </div>
                        );
                      }
                      
                      return null;
                    })}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex justify-between p-6 border-t border-white/10">
                <Button type="button" variant="ghost" onClick={prevStep} disabled={step === 0} className="hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {dict.projectForm.buttons.previous}
                </Button>
                <div className="flex gap-2">
                  {step < totalSteps - 1 ? (
                    <Button type="button" onClick={nextStep}>{dict.projectForm.buttons.next} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  ) : (
                    <Magnetic strength={0.2}>
                      <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        {dict.projectForm.buttons.submit}
                      </Button>
                    </Magnetic>
                  )}
                </div>
              </CardFooter>
            </form>
          </Form>
        </Card>
      )}
    </div>
  );
}
