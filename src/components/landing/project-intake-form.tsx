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
import { sendGA4Event, getVisitorId, getTraceId } from "@/lib/tracking";
import { Spotlight } from "@/components/ui/spotlight";

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

    const companySizeIndex = singleOptions.companySize.findIndex((o: any) => o.label === data.companySize);
    const sizeScores = [0, 4, 7, 10, 3];
    if (companySizeIndex !== -1) score += sizeScores[companySizeIndex];

    const timelineIndex = singleOptions.timeline.findIndex((o: any) => o.label === data.timeline);
    const timelineScores = [5, 3, 1, -5];
    if (timelineIndex !== -1) score += timelineScores[timelineIndex];

    const budgetIndex = singleOptions.budget.findIndex((o: any) => o.label === data.budget);
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
        
    const isValid = await form.trigger(fieldsToValidate as any);

    if (isValid) {
        await saveProgress();
        if (step < totalSteps - 1) {
            setStep(s => {
                const newStep = s + 1;
                sendGA4Event("intake_step_completed", {
                    
                    action: "next_click",
                    category: "engagement",
                    label: "Project Intake Form",
                    step_number: newStep + 1,
                    visitor_id: getVisitorId()
                });
                return newStep;
            });
        } else {
            form.handleSubmit(onSubmit)();
        }
    }
};

  const prevStep = () => setStep(s => Math.max(s - 1, -1));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.target as HTMLElement).tagName.toLowerCase() !== 'textarea') {
      e.preventDefault();
      nextStep();
    }
  };

  return (
    <div className="w-full" onKeyDown={handleKeyDown}>
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />

      {formSubmitted ? (
        <Card className="w-full max-w-3xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-4 md:p-8 animate-scale-in">
          <Spotlight color="rgba(43, 94, 255, 0.1)" />
          <CardHeader className="text-center pb-6">
            <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4 animate-check-bounce" />
            <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
              {(routingPath === 'A' || routingPath === 'B') ? dict.projectForm.success.title : dict.projectForm.success.titlePathC}
            </CardTitle>
            <CardDescription className="max-w-md mx-auto text-white/50 leading-relaxed font-medium">
              {(routingPath === 'A' || routingPath === 'B') ? dict.projectForm.success.description : dict.projectForm.success.descriptionPathC}
            </CardDescription>
          </CardHeader>
          
          {(routingPath === 'A' || routingPath === 'B' || routingPath === 'C') && (
            <div className="w-full rounded-3xl overflow-hidden bg-black/40 border border-white/5 mb-8 shadow-inner min-h-[700px]">
              <div className="calendly-inline-widget visible-widget" style={{ minWidth: '320px', height: '700px' }} />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Button asChild variant="ghost" className="hover:bg-white/10 text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full px-8">
              <Link href={`/${lang}/`}><Home className="mr-2 h-3 w-3" />{dict.projectForm.success.backHome}</Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-8 md:gap-16 max-w-6xl mx-auto items-center">
          {/* Technical Progress Index */}
          <div className="hidden md:flex flex-col gap-6 relative">
            {/* Vertical connector line */}
            <div className="absolute left-3 top-10 bottom-0 w-[1px] bg-white/5 z-0" />
            
            <div className="font-mono text-[9px] uppercase tracking-[0.4em] text-white/10 mb-2 pl-1">// SEQUENCE_INDEX</div>
            {formSteps.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                className={cn(
                  "group flex items-center gap-4 text-left transition-all duration-500 relative z-10",
                  step === i ? "text-primary" : i < step ? "text-white/40 hover:text-white" : "text-white/10"
                )}
              >
                <span className={cn(
                  "font-mono text-[10px] w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-500 shrink-0",
                  step === i 
                    ? "bg-primary/10 border-primary/40 shadow-[0_0_15px_rgba(43,94,255,0.2)] text-primary" 
                    : i < step 
                      ? "bg-white/5 border-white/10 text-primary/60" 
                      : "bg-background border-white/5"
                )}>
                  {i < step ? <Check className="h-3 w-3" /> : (i + 1).toString().padStart(2, '0')}
                </span>
                <span className="font-bold text-[8px] uppercase tracking-[0.2em]">{s.field.replace(/([A-Z])/g, ' $1')}</span>
              </button>
            ))}
          </div>

          <Card className="w-full bg-card/60 backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col rounded-3xl md:rounded-[2.5rem] transform-gpu">
            <Spotlight color="rgba(43, 94, 255, 0.08)" />
            <div 
                className="calendly-inline-widget seo-widget" 
                style={{ position: 'absolute', top: '-9999px', left: '-9999px', minWidth: '320px', height: '700px' }} 
            />
            <CardHeader className="p-0">
              <div className="h-1 w-full bg-white/5">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_rgba(43,94,255,0.4)]"
                />
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
                <CardContent className="p-6 md:p-12 h-[550px] md:h-[600px] flex items-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="w-full"
                    >
                      {step === -1 && (
                        <div className="text-center py-4 md:py-8">
                          <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mb-4 md:mb-6">{dict.projectForm.intro.title}</h2>
                          <p className="text-white/40 text-sm md:text-lg leading-relaxed max-w-lg mx-auto font-medium">{dict.projectForm.intro.description}</p>
                        </div>
                      )}
                      {formSteps.map((s, index) => {
                        if (step !== index) return null;
                        
                        const { field, label, description } = s;

                        if (field === 'email') {
                          return (
                            <FormField key={field} control={form.control} name="email" render={({ field: f }) => (
                              <FormItem className="space-y-4 md:space-y-6">
                                <div className="space-y-2 md:space-y-3">
                                  <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-primary/60">// FIELD_INPUT_01</div>
                                  <FormLabel className="text-lg md:text-2xl font-bold leading-tight text-white block">{label}</FormLabel>
                                  <p className="text-white/40 text-xs md:text-base leading-relaxed font-medium">{description}</p>
                                </div>
                                <FormControl>
                                  <Input 
                                    id={f.name} 
                                    {...f} 
                                    placeholder={dict.common.emailPlaceholder} 
                                    className="bg-white/[0.03] border-white/10 h-12 md:h-14 text-sm md:text-lg px-5 md:px-6 rounded-xl md:rounded-2xl focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all duration-300" 
                                  />
                                </FormControl>
                                <FormDescription className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/20">
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
                              <FormItem className="space-y-4 md:space-y-6">
                                <div className="space-y-2 md:space-y-3">
                                  <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-primary/60">// SELECTION_SET_{index + 1}</div>
                                  <FormLabel className="text-lg md:text-2xl font-bold leading-tight text-white block">{label}</FormLabel>
                                  <p className="text-white/40 text-xs md:text-base leading-relaxed font-medium">{description}</p>
                                </div>
                                <div className="grid gap-2 mt-4">
                                  {opts.map((o: any) => (
                                    <button
                                      key={o.label}
                                      type="button"
                                      onClick={() => { f.onChange(o.label); setTimeout(() => nextStep(), 300); }}
                                      className={cn(
                                        "group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-500",
                                        f.value === o.label 
                                          ? "bg-primary/10 border-primary/40 shadow-[0_0_25px_rgba(43,94,255,0.08)]" 
                                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                      )}
                                    >
                                      <div className="flex items-center gap-3 md:gap-4">
                                        <span className={cn(
                                          "font-mono text-[8px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded-md transition-colors duration-500",
                                          f.value === o.label ? "bg-primary/20 text-primary" : "bg-black/20 text-white/30"
                                        )}>{o.hint}</span>
                                        <span className={cn(
                                          "font-bold text-xs md:text-base transition-colors duration-500",
                                          f.value === o.label ? "text-white" : "text-white/60"
                                        )}>{o.label}</span>
                                      </div>
                                      {f.value === o.label && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                          <CheckCircle className="h-4 w-4 text-primary" />
                                        </motion.div>
                                      )}
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
                            <div key={field} className="space-y-4 md:space-y-6">
                              <div className="space-y-2 md:space-y-3">
                                <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-primary/60">// PROBLEM_DEFINITION</div>
                                <h3 className="text-lg md:text-2xl font-bold leading-tight text-white">{label}</h3>
                                <p className="text-white/40 text-xs md:text-sm leading-relaxed font-medium">{description}</p>
                              </div>
                              
                              <FormField control={form.control} name="hasProblem" render={({ field: f }) => (
                                  <FormItem className="space-y-2 md:space-y-3">
                                      <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.problemStatement.hasProblemLabel}</FormLabel>
                                      <div className="grid grid-cols-2 gap-2">
                                          {singleOptions.hasProblem.map(o => (
                                              <button
                                                  key={o.key}
                                                  type="button"
                                                  onClick={() => { f.onChange(o.key); }}
                                                  className={cn(
                                                  "group flex items-center justify-between p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-500",
                                                  f.value === o.key 
                                                    ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(43,94,255,0.08)]" 
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                                  )}
                                              >
                                                  <div className="flex items-center gap-2 md:gap-4">
                                                  <span className={cn(
                                                    "font-mono text-[8px] md:text-[9px] font-bold px-1.5 md:px-2 py-0.5 rounded-md transition-colors duration-500",
                                                    f.value === o.key ? "bg-primary/20 text-primary" : "bg-black/20 text-white/30"
                                                  )}>{o.hint}</span>
                                                  <span className={cn(
                                                    "font-bold text-xs md:text-sm transition-colors duration-500",
                                                    f.value === o.key ? "text-white" : "text-white/60"
                                                  )}>{o.label}</span>
                                                  </div>
                                                  {f.value === o.key && <Check className="h-4 w-4 text-primary" />}
                                              </button>
                                          ))}
                                      </div>
                                      <FormMessage />
                                  </FormItem>
                              )} />

                              {hasProblemWatch === 'yes' && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }} 
                                  animate={{ opacity: 1, height: 'auto' }}
                                  className="space-y-3"
                                >
                                  <FormField control={form.control} name="problemDescription" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.problemStatement.problemDescriptionLabel}</FormLabel>
                                      <Textarea 
                                        id={f.name} 
                                        {...f} 
                                        placeholder="..." 
                                        className="bg-white/[0.03] border-white/10 min-h-[70px] md:min-h-[80px] rounded-lg md:rounded-xl focus-visible:ring-primary/40 p-3 md:p-4 text-xs md:text-sm" 
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="idealState" render={({ field: f }) => (
                                      <FormItem className="space-y-1.5">
                                          <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.problemStatement.idealStateLabel}</FormLabel>
                                          <Textarea 
                                            id={f.name} 
                                            {...f} 
                                            placeholder="..." 
                                            className="bg-white/[0.03] border-white/10 min-h-[70px] md:min-h-[80px] rounded-lg md:rounded-xl focus-visible:ring-primary/40 p-3 md:p-4 text-xs md:text-sm" 
                                          />
                                          <FormMessage />
                                      </FormItem>
                                  )} />
                                </motion.div>
                              )}
                            </div>
                          );
                        }

                        if (field === 'dataInfrastructure') {
                          const isSoleEntrepreneur = companySizeWatch === singleOptions.companySize[0]?.label;
                          return (
                              <div key={field} className="space-y-4 md:space-y-6 w-full">
                                  <div className="space-y-1 md:space-y-2">
                                      <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-primary/60">// INFRASTRUCTURE_AUDIT</div>
                                      <h3 className="text-lg md:text-2xl font-bold leading-tight text-white">{label}</h3>
                                      <p className="text-white/40 text-xs md:text-sm leading-relaxed font-medium">{description}</p>
                                  </div>
                                  
                                  <div className="space-y-4 md:space-y-6 pt-1 md:pt-2">
                                      {/* Horizontal Audit Rows */}
                                      <div className="space-y-2 md:space-y-3 bg-white/[0.02] p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/5">
                                          {!isSoleEntrepreneur && (
                                              <FormField control={form.control} name="hasDataTeam" render={({ field: f }) => (
                                                  <FormItem className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                                      <FormLabel className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-white/50 pr-2">{dict.projectForm.steps.dataInfrastructure.hasDataTeamLabel}</FormLabel>
                                                      <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5 w-[100px] md:w-[140px]">
                                                          {singleOptions.dataInfrastructure.map(o => (
                                                              <button
                                                                  key={o.key}
                                                                  type="button"
                                                                  onClick={() => f.onChange(o.key)}
                                                                  className={cn(
                                                                      "flex-1 py-1 md:py-1.5 rounded-md transition-all duration-300 text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                                                                      f.value === o.key 
                                                                        ? "bg-primary text-white shadow-lg" 
                                                                        : "text-white/20 hover:text-white/40"
                                                                  )}
                                                              >
                                                                  {o.label}
                                                              </button>
                                                          ))}
                                                      </div>
                                                  </FormItem>
                                              )} />
                                          )}

                                          <FormField control={form.control} name="hasCentralDatabase" render={({ field: f }) => (
                                              <FormItem className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3 border-b border-white/5 last:border-0 last:pb-0">
                                                  <FormLabel className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-white/50 pr-2">{dict.projectForm.steps.dataInfrastructure.hasCentralDatabaseLabel}</FormLabel>
                                                  <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5 w-[100px] md:w-[140px]">
                                                      {singleOptions.dataInfrastructure.map(o => (
                                                          <button
                                                              key={o.key}
                                                              type="button"
                                                              onClick={() => f.onChange(o.key)}
                                                              className={cn(
                                                                  "flex-1 py-1 md:py-1.5 rounded-md transition-all duration-300 text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                                                                  f.value === o.key 
                                                                    ? "bg-primary text-white shadow-lg" 
                                                                    : "text-white/20 hover:text-white/40"
                                                              )}
                                                          >
                                                              {o.label}
                                                          </button>
                                                      ))}
                                                  </div>
                                              </FormItem>
                                          )} />

                                          <FormField control={form.control} name="hasCloudPlatform" render={({ field: f }) => (
                                              <FormItem className="flex flex-row items-center justify-between space-y-0 last:pb-0">
                                                  <FormLabel className="text-[8px] md:text-[10px] uppercase tracking-[0.1em] md:tracking-[0.2em] font-bold text-white/50 pr-2">{dict.projectForm.steps.dataInfrastructure.hasCloudPlatformLabel}</FormLabel>
                                                  <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5 w-[100px] md:w-[140px]">
                                                      {singleOptions.dataInfrastructure.map(o => (
                                                          <button
                                                              key={o.key}
                                                              type="button"
                                                              onClick={() => f.onChange(o.key)}
                                                              className={cn(
                                                                  "flex-1 py-1 md:py-1.5 rounded-md transition-all duration-300 text-[8px] md:text-[9px] font-black uppercase tracking-widest",
                                                                  f.value === o.key 
                                                                    ? "bg-primary text-white shadow-lg" 
                                                                    : "text-white/20 hover:text-white/40"
                                                              )}
                                                          >
                                                              {o.label}
                                                          </button>
                                                      ))}
                                                  </div>
                                              </FormItem>
                                          )} />
                                      </div>
                                      
                                      <div className="pt-1">
                                        <FormField control={form.control} name="solutionsInUse" render={({ field: { onChange, value } }) => (
                                            <FormItem className="space-y-3">
                                                <FormLabel className="text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-black text-white/40">{dict.projectForm.steps.dataInfrastructure.solutionsInUseLabel}</FormLabel>
                                                <MultiText value={value || []} onChange={onChange} placeholder="..." />
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                      </div>
                                  </div>
                              </div>
                          );
                      }

                        if (field === 'contactDetails') {
                          return (
                            <div key={field} className="space-y-6 md:space-y-8">
                              <div className="space-y-2 md:space-y-3">
                                <div className="font-mono text-[8px] md:text-[9px] uppercase tracking-[0.4em] text-primary/60">// FINAL_VERIFICATION</div>
                                <h3 className="text-lg md:text-2xl font-bold leading-tight text-white">{label}</h3>
                                <p className="text-white/40 text-xs md:text-base leading-relaxed font-medium">{description}</p>
                              </div>
                              
                              <div className="space-y-4 md:space-y-5 pt-1 md:pt-2">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <FormField control={form.control} name="firstName" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.contact.firstName}</FormLabel>
                                      <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-10 md:h-12 rounded-lg md:rounded-xl px-4 md:px-5 focus-visible:ring-primary/40 text-xs md:text-sm" />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="lastName" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.contact.lastName}</FormLabel>
                                      <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-10 md:h-12 rounded-lg md:rounded-xl px-4 md:px-5 focus-visible:ring-primary/40 text-xs md:text-sm" />
                                    </FormItem>
                                  )} />
                                </div>
                                <FormField control={form.control} name="company" render={({ field: f }) => (
                                  <FormItem className="space-y-1.5">
                                    <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.contact.company}</FormLabel>
                                    <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-10 md:h-12 rounded-lg md:rounded-xl px-4 md:px-5 focus-visible:ring-primary/40 text-xs md:text-sm" />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field: f }) => (
                                  <FormItem className="space-y-1.5">
                                    <FormLabel className="text-[8px] md:text-[9px] uppercase tracking-[0.2em] font-bold text-white/30">{dict.projectForm.steps.contact.phone}</FormLabel>
                                    <PhoneInput 
                                      international 
                                      defaultCountry="NL" 
                                      className="[&_input]:bg-white/[0.03] [&_input]:border-white/10 [&_input]:h-10 md:[&_input]:h-12 [&_input]:rounded-lg md:[&_input]:rounded-xl [&_input]:px-4 md:[&_input]:px-5 [&_input]:focus-visible:ring-primary/40 [&_input]:text-xs md:[&_input]:text-sm" 
                                      {...f} 
                                    />
                                  </FormItem>
                                )} />
                                <FormField control={form.control} name="consent" render={({ field: f }) => (
                                  <FormItem className="flex items-center gap-3 space-y-0 bg-white/[0.02] p-4 md:p-5 rounded-lg md:rounded-xl border border-white/5">
                                    <FormControl>
                                      <Checkbox checked={f.value} onCheckedChange={f.onChange} />
                                    </FormControl>
                                    <FormLabel className="text-[9px] md:text-[10px] font-medium text-white/50 cursor-pointer leading-tight">
                                      {dict.projectForm.steps.contact.consentPreLink}{' '}
                                      <Link href={`/${lang}/privacy-policy/`} className="text-primary hover:underline" target="_blank">
                                        {dict.projectForm.steps.contact.consentLinkText}
                                      </Link>
                                    </FormLabel>
                                  </FormItem>
                                )} />
                              </div>
                            </div>
                          );
                        }

                        return null;
                      })}
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
                <CardFooter className="flex justify-between p-6 md:p-10 border-t border-white/5 bg-black/10">
                  <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={prevStep} 
                    disabled={step === -1} 
                    className="hover:bg-white/5 text-white/40 font-bold text-[8px] md:text-[10px] uppercase tracking-widest rounded-full px-6 md:px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {dict.projectForm.buttons.previous}
                  </Button>
                  <div className="flex gap-4">
                  {step === -1 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep}
                        className="bg-primary hover:bg-blue-500 text-white font-bold text-[8px] md:text-[10px] uppercase tracking-widest rounded-full px-8 md:px-10 h-10 md:h-12 shadow-[0_0_20px_rgba(43,94,255,0.3)] transition-all duration-300"
                      >
                        {dict.projectForm.buttons.start} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : step < totalSteps - 1 ? (
                      <Button 
                        type="button" 
                        onClick={nextStep} 
                        disabled={isNextButtonDisabled}
                        className="bg-primary hover:bg-blue-500 text-white font-bold text-[8px] md:text-[10px] uppercase tracking-widest rounded-full px-8 md:px-10 h-10 md:h-12 shadow-[0_0_20px_rgba(43,94,255,0.3)] transition-all duration-300 disabled:opacity-20 disabled:shadow-none"
                      >
                        {dict.projectForm.buttons.next} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Magnetic strength={0.1}>
                        <Button 
                          type="submit" 
                          disabled={isSubmitButtonDisabled}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[8px] md:text-[10px] uppercase tracking-widest rounded-full px-10 md:px-12 h-10 md:h-12 shadow-[0_0_30px_rgba(43,94,255,0.4)] transition-all duration-500 border-none relative overflow-hidden"
                        >
                          <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                          <span className="relative flex items-center">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {dict.projectForm.buttons.submit}
                          </span>
                        </Button>
                      </Magnetic>
                    )}
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </div>
  );
}
