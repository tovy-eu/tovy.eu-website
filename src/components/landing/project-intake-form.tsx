"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiText } from "@/components/ui/multi-text";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Check, Home, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/get-dictionary";
import { Magnetic } from "@/components/ui/magnetic";
import { getVisitorId, getTraceId } from "@/lib/tracking";

interface ProjectIntakeFormProps {
  dict: Dictionary;
}

const STORAGE_KEY = "tovy_project_form_progress";

type RoutingPath = 'A' | 'B' | 'C';

export function ProjectIntakeForm({ dict }: ProjectIntakeFormProps) {
  const [step, setStep] = useState(-1); // Start at -1 for the intro step
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submittedValues, setSubmittedValues] = useState<ProjectRequestData | null>(null);
  const [routingPath, setRoutingPath] = useState<RoutingPath>('B');
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const lang = pathname?.split('/')[1] || 'en';
  const [formDocId, setFormDocId] = useState<string | null>(null);

    const formSteps = useMemo(() => [
    { field: "email", label: dict.projectForm.steps.workEmail.label, description: dict.projectForm.steps.workEmail.description },
    { field: "companySize", label: dict.projectForm.steps.companySize.label, description: dict.projectForm.steps.companySize.description },
    { field: "problemStatement", label: dict.projectForm.steps.problemStatement.label, description: dict.projectForm.steps.problemStatement.description },
    { field: "dataInfrastructure", label: dict.projectForm.steps.dataInfrastructure.label, description: dict.projectForm.steps.dataInfrastructure.description },
    { field: "timeline", label: dict.projectForm.steps.timeline.label, description: dict.projectForm.steps.timeline.description },
    { field: "budget", label: dict.projectForm.steps.budget.label, description: dict.projectForm.steps.budget.description },
    { field: "contactDetails", label: dict.projectForm.steps.contact.label, description: dict.projectForm.steps.contact.description },
  ], [dict]);

  const totalSteps = formSteps.length;

  const singleOptions = useMemo(() => ({
    companySize: dict.projectForm.steps.companySize.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    timeline: dict.projectForm.steps.timeline.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    budget: dict.projectForm.steps.budget.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    hasProblem: Object.entries(dict.projectForm.steps.problemStatement.options).map(([key, label], i) => ({ key, label: label as string, hint: String.fromCharCode(65 + i) })),
    dataInfrastructure: Object.entries(dict.projectForm.steps.dataInfrastructure.options).map(([key, label], i) => ({ key, label: label as string, hint: String.fromCharCode(65 + i) })),
  }), [dict]);

  const form = useForm<ProjectRequestData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      email: "",
      companySize: "",
      hasProblem: "",
      problemDescription: "",
      idealState: "",
      hasDataTeam: "",
      hasCentralDatabase: "",
      hasCloudPlatform: "",
      solutionsInUse: [],
      timeline: "",
      budget: "",
      firstName: "",
      lastName: "",
      company: "",
      phone: "",
      consent: false,
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });
  
  const allValues = form.watch();
  const hasProblemWatch = form.watch("hasProblem");
  const companySizeWatch = form.watch("companySize");
  const { setValue } = form;

  const isNextButtonDisabled = step > -1 && (() => {
    const field = formSteps[step].field;
    
    switch (field) {
        case 'email':
            return !allValues.email;
        case 'companySize':
        case 'timeline':
        case 'budget':
            return !allValues[field as keyof ProjectRequestData];
        case 'problemStatement':
            if (hasProblemWatch === 'yes') {
                return !allValues.problemDescription || !allValues.idealState;
            }
            return !allValues.hasProblem;
        case 'dataInfrastructure':
            if (companySizeWatch === singleOptions.companySize[0]?.label) {
                return !allValues.hasCentralDatabase || !allValues.hasCloudPlatform
            }
            return !allValues.hasDataTeam || !allValues.hasCentralDatabase || !allValues.hasCloudPlatform;
        case 'contactDetails':
            return !allValues.firstName || !allValues.lastName || !allValues.company || !allValues.consent;
        default:
            return false;
    }
  })();

  const isSubmitButtonDisabled = isPending || !allValues.firstName || !allValues.lastName || !allValues.company || !allValues.consent;

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const { step: savedStep, data: savedData, docId: savedDocId } = JSON.parse(savedProgress);
        setStep(savedStep);
        form.reset(savedData);
        if (savedDocId) {
          setFormDocId(savedDocId);
        }
      } catch (e) {
        console.error("Failed to load form progress", e);
      }
    }
  }, [form]);

  useEffect(() => {
    if (!formSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data: allValues, docId: formDocId }));
    }
  }, [step, allValues, formSubmitted, formDocId]);

  useEffect(() => {
    // If the form is submitted, initialize the visible widget with user data
    if (formSubmitted && submittedValues && (routingPath === 'A' || routingPath === 'B' || routingPath === 'C')) {
      const name = `${submittedValues.firstName} ${submittedValues.lastName}`.trim();
      const email = submittedValues.email;
      const calendlyUrl = `https://calendly.com/tovy-info?background_color=080c1b&text_color=ffffff&primary_color=365af6&hide_gdpr_banner=1&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;

      const initCalendly = () => {
        const parentElement = document.querySelector('.calendly-inline-widget.visible-widget');
        if ((window as any).Calendly && parentElement) {
          (window as any).Calendly.initInlineWidget({ url: calendlyUrl, parentElement });
          return true;
        }
        return false;
      };
      const interval = setInterval(() => { if (initCalendly()) clearInterval(interval) }, 100);
      return () => clearInterval(interval);
    } 
    // Otherwise, on initial load, initialize the hidden SEO widget for crawlers
    else if (!formSubmitted) {
        const genericCalendlyUrl = `https://calendly.com/tovy-info?background_color=080c1b&text_color=ffffff&primary_color=365af6&hide_gdpr_banner=1`;
        const initSeoCalendly = () => {
            const parentElement = document.querySelector('.calendly-inline-widget.seo-widget');
            if ((window as any).Calendly && parentElement) {
                (window as any).Calendly.initInlineWidget({ url: genericCalendlyUrl, parentElement });
                return true;
            }
            return false;
        };
        const interval = setInterval(() => { if (initSeoCalendly()) clearInterval(interval) }, 100);
        return () => clearInterval(interval);
    }
  }, [formSubmitted, submittedValues, routingPath]);

  useEffect(() => {
    const isSoleEntrepreneur = companySizeWatch === singleOptions.companySize[0]?.label;
    if (isSoleEntrepreneur) {
      setValue("hasDataTeam", "no");
    }
  }, [companySizeWatch, setValue, singleOptions.companySize]);

  const calculateScore = (data: ProjectRequestData): { score: number, path: RoutingPath } => {
    let score = 0;
    
    const publicEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "zoho.com", "mail.com", "protonmail.com", "gmx.com"];
    const domain = data.email.split('@')[1]?.toLowerCase();
    score += publicEmailDomains.includes(domain) ? -10 : 5;

    const companySizeIndex = singleOptions.companySize.findIndex(o => o.label === data.companySize);
    const sizeScores = [0, 4, 7, 10, 3];
    if (companySizeIndex !== -1) score += sizeScores[companySizeIndex];

    const timelineIndex = singleOptions.timeline.findIndex(o => o.label === data.timeline);
    const timelineScores = [5, 3, 1, -5];
    if (timelineIndex !== -1) score += timelineScores[timelineIndex];

    const budgetIndex = singleOptions.budget.findIndex(o => o.label === data.budget);
    const budgetScores = [5, -10];
    if (budgetIndex !== -1) score += budgetScores[budgetIndex];

    const isLargeCompany = companySizeIndex === 2 || companySizeIndex === 3;
    const isLargeBudget = budgetIndex === 0;
    if (isLargeCompany && isLargeBudget) return { score, path: 'A' };

    if (score >= 18) return { score, path: 'A' };
    if (score >= 5) return { score, path: 'B' };
    return { score, path: 'B' };
  };

  const saveProgress = async () => {
    const data = form.getValues();
    if (data.email) {
      try {
        let docRef;
        if (formDocId) {
          docRef = doc(db, "project_requests", formDocId);
          await setDoc(docRef, { ...data, last_updated: new Date() }, { merge: true });
        } else {
          const doc = await addDoc(collection(db, "project_requests"), {
            ...data,
            timestamp: new Date(),
            status: "incomplete",
          });
          setFormDocId(doc.id);
        }
      } catch (error) {
        console.error("Failed to save form progress", error);
      }
    }
  };
  
  const onSubmit = (data: ProjectRequestData) => {
    startTransition(async () => {
      try {
        const { score, path } = calculateScore(data);
        const visitorId = getVisitorId();
        const traceId = getTraceId();
        
        const docRef = doc(db, "project_requests", formDocId!);
        await setDoc(docRef, {
          ...data,
          timestamp: new Date(),
          lead_score: score,
          routing_path: path,
          visitor_id: visitorId,
          trace_id: traceId,
          status: "complete",
        }, { merge: true });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'form_submission',
          'form_name': 'Project Request'
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
    const pushToDataLayer = (eventName: string) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ 'event': eventName });
    };

    if (step === -1) {
        setStep(0);
        pushToDataLayer('form_step_1');
        return;
    }

    let fieldsToValidate: (keyof ProjectRequestData | 'problemDescription' | 'idealState' | 'hasProblem' | 'hasDataTeam' | 'hasCentralDatabase' | 'hasCloudPlatform' | 'solutionsInUse' | 'bottlenecks' )[] = [];

    const currentField = formSteps[step].field;

    if (currentField === 'contactDetails') {
        fieldsToValidate = ['firstName', 'lastName', 'company', 'phone', 'consent'];
    } else if (currentField === 'problemStatement') {
        fieldsToValidate = ['hasProblem'];
        if (form.getValues('hasProblem') === 'yes') {
            fieldsToValidate.push('problemDescription', 'idealState');
        }
    } else if (currentField === 'dataInfrastructure') {
        fieldsToValidate = ['hasDataTeam', 'hasCentralDatabase', 'hasCloudPlatform'];
    } else {
        fieldsToValidate = [currentField as keyof ProjectRequestData];
    }
        
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
        await saveProgress();
        if (step < totalSteps - 1) {
            setStep(s => {
                const newStep = s + 1;
                pushToDataLayer(`form_step_${newStep + 1}`);
                return newStep;
            });
        } else {
            form.handleSubmit(onSubmit)();
        }
    }
};

  const prevStep = () => setStep(s => Math.max(s - 1, -1));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target.tagName.toLowerCase() !== 'textarea') {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <div className="w-full" onKeyDown={handleKeyDown}>
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
          
          {(routingPath === 'A' || routingPath === 'B' || routingPath === 'C') && (
            <div className="w-full rounded-2xl overflow-hidden bg-black/20 border border-white/5 mb-6 min-h-[700px]">
              <div className="calendly-inline-widget visible-widget" style={{ minWidth: '320px', height: '700px' }} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild variant="ghost" className="hover:bg-white/10 text-muted-foreground text-xs">
              <Link href={`/${lang}/`}><Home className="mr-2 h-3 w-3" />{dict.projectForm.success.backHome}</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="w-full max-w-2xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col">
          <div 
              className="calendly-inline-widget seo-widget" 
              style={{ position: 'absolute', top: '-9999px', left: '-9999px', minWidth: '320px', height: '700px' }} 
          />
          <CardHeader className="p-4 pb-2">
            <Progress value={((step + 1) / (totalSteps + 1)) * 100} className="w-full h-1.5" />
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
                    {step === -1 && (
                      <div className="text-center">
                        <h2 className="text-2xl font-bold">{dict.projectForm.intro.title}</h2>
                        <p className="text-muted-foreground mt-2">{dict.projectForm.intro.description}</p>
                      </div>
                    )}
                    {formSteps.map((s, index) => {
                      if (step !== index) return null;
                      
                      const { field, label, description } = s;

                      if (field === 'email') {
                        return (
                          <FormField key={field} control={form.control} name="email" render={({ field: f }) => (
                            <FormItem>
                              <div className="flex items-center gap-3">
                                <span className="text-primary font-bold">{index + 1} →</span>
                                <FormLabel className="text-lg md:text-2xl font-bold leading-tight">{label}</FormLabel>
                              </div>
                              <p className="text-muted-foreground mt-2 text-sm">{description}</p>
                              <FormControl>
                                <Input {...f} placeholder={dict.common.emailPlaceholder} className="mt-6 bg-white/5 border-white/10 h-12" />
                              </FormControl>
                              <FormDescription>
                                {dict.projectForm.steps.workEmail.note}
                              </FormDescription>
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
                      
                      if (field === 'problemStatement') {
                        return (
                          <div key={field}>
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-primary font-bold">{index + 1} →</span>
                              <h3 className="text-lg md:text-2xl font-bold leading-tight">{label}</h3>
                            </div>
                            <p className="text-muted-foreground text-sm mb-6">{description}</p>
                            
                            <FormField control={form.control} name="hasProblem" render={({ field: f }) => (
                                <FormItem>
                                    <FormLabel>{dict.projectForm.steps.problemStatement.hasProblemLabel}</FormLabel>
                                    <div className="grid gap-2 mt-2 max-w-sm">
                                        {singleOptions.hasProblem.map(o => (
                                            <button
                                                key={o.key}
                                                type="button"
                                                onClick={() => { f.onChange(o.key); }}
                                                className={cn(
                                                "flex items-center justify-between p-4 rounded-xl border border-white/5 text-left transition-all",
                                                f.value === o.key ? "bg-primary/20 border-primary/50" : "bg-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-bold text-white/40 bg-black/20 px-2 py-0.5 rounded">{o.hint}</span>
                                                <span className="font-semibold text-sm">{o.label}</span>
                                                </div>
                                                {f.value === o.key && <Check className="h-4 w-4 text-primary" />}
                                            </button>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            {hasProblemWatch === 'yes' && (
                              <>
                                <FormField control={form.control} name="problemDescription" render={({ field: f }) => (
                                  <FormItem className="mt-6">
                                    <FormLabel>{dict.projectForm.steps.problemStatement.problemDescriptionLabel}</FormLabel>
                                    <Textarea {...f} placeholder="..." className="bg-white/5 border-white/10" />
                                    <FormMessage />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="idealState" render={({ field: f }) => (
                                    <FormItem className="mt-6">
                                        <FormLabel>{dict.projectForm.steps.problemStatement.idealStateLabel}</FormLabel>
                                        <Textarea {...f} placeholder="..." className="bg-white/5 border-white/10" />
                                        <FormMessage />
                                    </FormItem>
                                )} />
                              </>
                            )}
                          </div>
                        );
                      }

                      if (field === 'dataInfrastructure') {
                        const isSoleEntrepreneur = companySizeWatch === singleOptions.companySize[0]?.label;
                        return (
                            <div key={field}>
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="text-primary font-bold">{index + 1} →</span>
                                    <h3 className="text-lg md:text-2xl font-bold leading-tight">{label}</h3>
                                </div>
                                <p className="text-muted-foreground text-sm mb-6">{description}</p>
                                
                                <div className="space-y-6">
                                    {!isSoleEntrepreneur && (
                                        <FormField control={form.control} name="hasDataTeam" render={({ field: f }) => (
                                            <FormItem>
                                                <FormLabel>{dict.projectForm.steps.dataInfrastructure.hasDataTeamLabel}</FormLabel>
                                                <div className="grid gap-2 mt-2 max-w-sm">
                                                    {singleOptions.dataInfrastructure.map(o => (
                                                        <button
                                                            key={o.key}
                                                            type="button"
                                                            onClick={() => f.onChange(o.key)}
                                                            className={cn(
                                                                "flex items-center justify-between p-4 rounded-xl border border-white/5 text-left transition-all",
                                                                f.value === o.key ? "bg-primary/20 border-primary/50" : "bg-white/5 hover:bg-white/10"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-bold text-white/40 bg-black/20 px-2 py-0.5 rounded">{o.hint}</span>
                                                                <span className="font-semibold text-sm">{o.label}</span>
                                                            </div>
                                                            {f.value === o.key && <Check className="h-4 w-4 text-primary" />}
                                                        </button>
                                                    ))}
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                    )}

                                    <FormField control={form.control} name="hasCentralDatabase" render={({ field: f }) => (
                                        <FormItem>
                                            <FormLabel>{dict.projectForm.steps.dataInfrastructure.hasCentralDatabaseLabel}</FormLabel>
                                            <div className="grid gap-2 mt-2 max-w-sm">
                                                {singleOptions.dataInfrastructure.map(o => (
                                                    <button
                                                        key={o.key}
                                                        type="button"
                                                        onClick={() => f.onChange(o.key)}
                                                        className={cn(
                                                            "flex items-center justify-between p-4 rounded-xl border border-white/5 text-left transition-all",
                                                            f.value === o.key ? "bg-primary/20 border-primary/50" : "bg-white/5 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-white/40 bg-black/20 px-2 py-0.5 rounded">{o.hint}</span>
                                                            <span className="font-semibold text-sm">{o.label}</span>
                                                        </div>
                                                        {f.value === o.key && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />

                                    <FormField control={form.control} name="hasCloudPlatform" render={({ field: f }) => (
                                        <FormItem>
                                            <FormLabel>{dict.projectForm.steps.dataInfrastructure.hasCloudPlatformLabel}</FormLabel>
                                            <div className="grid gap-2 mt-2 max-w-sm">
                                                {singleOptions.dataInfrastructure.map(o => (
                                                    <button
                                                        key={o.key}
                                                        type="button"
                                                        onClick={() => f.onChange(o.key)}
                                                        className={cn(
                                                            "flex items-center justify-between p-4 rounded-xl border border-white/5 text-left transition-all",
                                                            f.value === o.key ? "bg-primary/20 border-primary/50" : "bg-white/5 hover:bg-white/10"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[10px] font-bold text-white/40 bg-black/20 px-2 py-0.5 rounded">{o.hint}</span>
                                                            <span className="font-semibold text-sm">{o.label}</span>
                                                        </div>
                                                        {f.value === o.key && <Check className="h-4 w-4 text-primary" />}
                                                    </button>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    
                                    <FormField control={form.control} name="solutionsInUse" render={({ field: { onChange, value } }) => (
                                        <FormItem>
                                            <FormLabel>{dict.projectForm.steps.dataInfrastructure.solutionsInUseLabel}</FormLabel>
                                            <MultiText value={value || []} onChange={onChange} placeholder="e.g., SAP, Salesforce..." />
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
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
                                <FormLabel className="text-xs cursor-pointer">
                                  {dict.projectForm.steps.contact.consentPreLink}{' '}
                                  <Link href={`/${lang}/privacy-policy`} className="underline" target="_blank">
                                    {dict.projectForm.steps.contact.consentLinkText}
                                  </Link>
                                </FormLabel>
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
                <Button type="button" variant="ghost" onClick={prevStep} disabled={step === -1} className="hover:bg-white/10">
                  <ArrowLeft className="mr-2 h-4 w-4" /> {dict.projectForm.buttons.previous}
                </Button>
                <div className="flex gap-2">
                {step === -1 ? (
                    <Button type="button" onClick={nextStep}>{dict.projectForm.buttons.start} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  ) : step < totalSteps - 1 ? (
                    <Button type="button" onClick={nextStep} disabled={isNextButtonDisabled}>{dict.projectForm.buttons.next} <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  ) : (
                    <Magnetic strength={0.2}>
                      <Button type="submit" disabled={isSubmitButtonDisabled}>
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
