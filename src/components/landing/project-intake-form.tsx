"use no memo";
"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { useToast } from "@/hooks/use-toast";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiText } from "@/components/ui/multi-text";
import { Loader2, ArrowRight, ArrowLeft, CheckCircle, Check, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/lib/get-dictionary";
import { Magnetic } from "@/components/ui/magnetic";
import { sendGA4Event, getVisitorId, getTraceId, trackFormSubmission, trackFormError, trackFormStart } from "@/lib/tracking";
import { Spotlight } from "@/components/ui/spotlight";

interface ProjectIntakeFormProps {
  dict: Dictionary;
}

const getEmailTranslations = (dict: Dictionary, lang: string, emailType: 'welcome' | 'abandonment') => {
  const l = (lang === 'nl' || lang === 'de' || lang === 'es') ? lang : 'en';

  try {
    // Access the email translations from dictionary - these are guaranteed to exist
    const emails = dict.pages?.projectRequest?.form?.emails as Record<string, Record<string, Record<string, unknown>>>;
    const translations = emails?.[emailType]?.[l];

    if (!translations) {
      console.warn(`Translation missing for ${emailType}.${l}, falling back to English`);
      return emails?.[emailType]?.en as Record<string, unknown>;
    }

    return translations;
  } catch (error) {
    console.error('Error loading email translations:', error);
    // This should never happen - translations are in dictionaries
    return {};
  }
};

const getWelcomeEmailHtml = (data: ProjectRequestData, docId: string, lang: string, dict: Dictionary): string => {
  const l = (lang === 'nl' || lang === 'de' || lang === 'es') ? lang : 'en';
  const t = getEmailTranslations(dict, lang, 'welcome');
  
  const formattedName = `${data.firstName} ${data.lastName}`;
  const formattedOrg = `${data.company} (${data.companySize || 'N/A'})`;
  const formattedPhone = data.phone || t.phoneNotProvided;
  const isDataTeam = data.hasDataTeam === 'yes' ? t.hasDataTeamYes : t.hasDataTeamNo;
  const centralDb = data.hasCentralDatabase === 'yes' ? t.centralDbConfigured : t.centralDbNone;
  const cloudPlatform = data.hasCloudPlatform === 'yes' ? t.cloudPlatformConfigured : t.cloudPlatformNone;
  const activeTools = data.solutionsInUse && data.solutionsInUse.length > 0 ? data.solutionsInUse.join(', ') : t.noneSpecified;
  const bottlenecks = data.problemDescription || t.noneDeclared;
  const idealState = data.idealState || t.noneDeclared;
  const currentYear = new Date().getFullYear();

  return `<!DOCTYPE html>
<html lang="${l}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark only">
  <meta name="supported-color-schemes" content="dark only">
  <title>${t.title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      background-color: #030712;
      color: #f8fafc;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #030712 !important;
        color: #f8fafc !important;
      }
    }
  </style>
  <!-- Gmail Inbox Go-To Action Schema -->
  <script type="application/ld+json">
  {
    "@context": "http://schema.org",
    "@type": "EmailMessage",
    "potentialAction": {
      "@type": "ViewAction",
      "name": "${t.btnText}",
      "target": "https://calendar.google.com/calendar/appointments/schedules/AcZssZ3GvYWPuGvxv0-8qtgsYeJKkgMUjmUqu-2D2FZrKqU6z75hXbUv6_FjFmbPdPBHcyew-fiAUXQ2?gv=true"
    },
    "description": "${t.subTitle}"
  }
  </script>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="background-color: #030712; background-image: radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.25), rgba(3, 7, 18, 0)); padding: 60px 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background-color: rgba(3, 7, 18, 0.85); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 32px; padding: 48px 40px; text-align: left; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);">
      
      <!-- Logo Header using production absolute URL -->
      <div style="margin-bottom: 40px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 24px;">
        <img src="https://tovy.eu/images/tovy-logo-email.png" alt="TOVY" height="32" style="border: 0; display: block;" />
      </div>

      <!-- Personal Intro -->
      <p style="font-size: 16px; line-height: 1.6; color: #cbd5e1; margin-bottom: 20px;">
        ${l === 'nl' ? 'Beste' : l === 'es' ? 'Hola' : 'Hi'} ${data.firstName},
      </p>

      <p style="font-size: 18px; line-height: 1.6; color: #ffffff; font-weight: 700; margin-bottom: 24px; text-shadow: 0 0 20px rgba(41, 91, 255, 0.35);">
        ${t.subTitle}
      </p>
      
      <p style="font-size: 15px; line-height: 1.6; color: #94a3b8; margin-bottom: 28px;">
        ${t.bodyText}
      </p>
      
      <!-- Summary Card Component -->
      <div style="background-color: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 20px; padding: 24px; margin-bottom: 32px; box-shadow: 0 0 20px rgba(41, 91, 255, 0.05);">
        <h4 style="margin: 0 0 16px 0; font-size: 12px; font-weight: bold; color: #5773ff; text-transform: uppercase; letter-spacing: 0.05em;">${t.specsTitle}</h4>
        
        <!-- Section 1: Lead Profile -->
        <h5 style="margin: 16px 0 8px 0; font-size: 11px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">${t.profileTitle}</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 40%;">${t.nameLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${formattedName}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.orgLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${formattedOrg}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.emailLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${data.email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.phoneLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${formattedPhone}</td>
          </tr>
        </table>

        <!-- Section 2: Project Scope -->
        <h5 style="margin: 16px 0 8px 0; font-size: 11px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">${t.scopeTitle}</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 40%;">${t.budgetLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${data.budget}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.timelineLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${data.timeline}</td>
          </tr>
        </table>

        <!-- Section 3: Data Infrastructure -->
        <h5 style="margin: 16px 0 8px 0; font-size: 11px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">${t.infraTitle}</h5>
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 12px;">
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500; width: 40%;">${t.dataTeamLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${isDataTeam}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.centralDbLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${centralDb}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.cloudPlatformLabel}</td>
            <td style="padding: 6px 0; color: #f8fafc; font-weight: 600;">${cloudPlatform}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; color: #64748b; font-weight: 500;">${t.activeToolsLabel}</td>
            <td style="padding: 6px 0; color: #cbd5e1; font-weight: 500; font-style: italic;">
              ${activeTools}
            </td>
          </tr>
        </table>

        <!-- Section 4: Project Context -->
        <h5 style="margin: 16px 0 8px 0; font-size: 11px; font-weight: bold; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding-bottom: 4px;">${t.challengesTitle}</h5>
        <div style="font-size: 13px; color: #cbd5e1; line-height: 1.5; padding: 4px 0;">
          <p style="margin: 0 0 8px 0;"><strong style="color: #64748b; font-weight: 500;">${t.bottlenecksLabel}</strong><br><span style="color: #f8fafc;">${bottlenecks}</span></p>
          <p style="margin: 0;"><strong style="color: #64748b; font-weight: 500;">${t.idealStateLabel}</strong><br><span style="color: #f8fafc;">${idealState}</span></p>
        </div>
      </div>

      <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1; margin-bottom: 28px;">
        ${t.schedulerText}
      </p>
      
      <!-- Hero CTA Button with glowing style matching Tovy branding -->
      <div style="text-align: center; margin: 36px 0 32px 0;">
        <a href="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3GvYWPuGvxv0-8qtgsYeJKkgMUjmUqu-2D2FZrKqU6z75hXbUv6_FjFmbPdPBHcyew-fiAUXQ2?gv=true" 
           style="background: linear-gradient(90deg, #295bff, #936290); color: #ffffff; text-decoration: none; padding: 16px 36px; font-weight: 700; font-size: 14px; border-radius: 50px; display: inline-block; box-shadow: 0 0 30px rgba(41, 91, 255, 0.45); text-transform: uppercase; letter-spacing: 0.08em; border: 1px solid rgba(255, 255, 255, 0.1);">
          ${t.btnText}
        </a>
      </div>

      <!-- Sign-off Block -->
      <div style="margin-bottom: 40px; font-size: 15px; line-height: 1.6; color: #cbd5e1;">
        <p style="margin-bottom: 5px;">${t.bestRegards}</p>
        <p style="margin: 0; font-weight: 700; color: #ffffff;">Giel Nijkamp</p>
        <p style="margin: 0; font-size: 13px; color: #64748b;">${t.founderTitle}</p>
      </div>

      <!-- Footer with a thread-buster and unique reference to prevent Gmail collapsing threads -->
      <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; text-align: center;">
        <p style="font-size: 11px; color: #64748b; margin: 0 0 8px 0;">${String(t.copyright).replace('{year}', String(currentYear))}</p>
        <p style="font-size: 9px; color: #334155; margin: 0; font-family: monospace;">Ref: ${docId}</p>
      </div>

    </div>
  </div>
</body>
</html>`;
}

interface ProjectIntakeFormProps {
  dict: Dictionary;
}

// v2: step indices changed when the email step moved to the end of the form
const STORAGE_KEY = "tovy_project_form_progress_v2";

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

    // Qualification questions come first; email and contact details close the
    // form so the lowest-friction questions carry the highest-trust moment.
    const formSteps = useMemo(() => [
    { field: "companySize", label: dict.pages.projectRequest.form.steps.companySize.label, description: dict.pages.projectRequest.form.steps.companySize.description },
    { field: "problemStatement", label: dict.pages.projectRequest.form.steps.problemStatement.label, description: dict.pages.projectRequest.form.steps.problemStatement.description },
    { field: "dataInfrastructure", label: dict.pages.projectRequest.form.steps.dataInfrastructure.label, description: dict.pages.projectRequest.form.steps.dataInfrastructure.description },
    { field: "timeline", label: dict.pages.projectRequest.form.steps.timeline.label, description: dict.pages.projectRequest.form.steps.timeline.description },
    { field: "budget", label: dict.pages.projectRequest.form.steps.budget.label, description: dict.pages.projectRequest.form.steps.budget.description },
    { field: "email", label: dict.pages.projectRequest.form.steps.workEmail.label, description: dict.pages.projectRequest.form.steps.workEmail.description },
    { field: "contactDetails", label: dict.pages.projectRequest.form.steps.contact.label, description: dict.pages.projectRequest.form.steps.contact.description },
  ], [dict]);

  const totalSteps = formSteps.length;

  const singleOptions = useMemo(() => ({
    companySize: dict.pages.projectRequest.form.steps.companySize.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    timeline: dict.pages.projectRequest.form.steps.timeline.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    budget: dict.pages.projectRequest.form.steps.budget.options.map((opt: string, i: number) => ({ label: opt, hint: String.fromCharCode(65 + i), index: i })),
    hasProblem: Object.entries(dict.pages.projectRequest.form.steps.problemStatement.options).map(([key, label], i) => ({ key, label: label as string, hint: String.fromCharCode(65 + i) })),
    dataInfrastructure: Object.entries(dict.pages.projectRequest.form.steps.dataInfrastructure.options).map(([key, label], i) => ({ key, label: label as string, hint: String.fromCharCode(65 + i) })),
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

  const allValues = useWatch({ control: form.control });
  const hasProblemWatch = useWatch({ control: form.control, name: "hasProblem" });
  const companySizeWatch = useWatch({ control: form.control, name: "companySize" });
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
    const params = new URLSearchParams(window.location.search);
    const urlDocId = params.get('id') || params.get('docId');
    if (urlDocId) {
      const loadProgressFromFirestore = async () => {
        try {
          const docRef = doc(db, "project_requests", urlDocId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const docData = docSnap.data();
            if (docData.status === "incomplete" || docData.status === "abandoned") {
              const timeoutId = setTimeout(() => {
                form.reset(docData as ProjectRequestData);
                setFormDocId(urlDocId);
                if (typeof docData.step === 'number') {
                  setStep(docData.step);
                }
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                  step: docData.step ?? 0,
                  data: docData,
                  docId: urlDocId
                }));
              }, 0);
              return () => clearTimeout(timeoutId);
            }
          }
        } catch (error) {
          console.error("Failed to load progress from Firestore", error);
        }
      };
      loadProgressFromFirestore();
    } else {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        try {
          const { step: savedStep, data: savedData, docId: savedDocId } = JSON.parse(savedProgress);

          // Defer state updates to avoid synchronous state update warning during hydration
          const timeoutId = setTimeout(() => {
            setStep(savedStep);
            form.reset(savedData);
            if (savedDocId) {
              setFormDocId(savedDocId);
            }
          }, 0);

          return () => clearTimeout(timeoutId);
        } catch (e) {
          console.error("Failed to load form progress", e);
        }
      }
    }
  }, [form]);

  useEffect(() => {
    if (!formSubmitted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data: allValues, docId: formDocId }));
    }
  }, [step, allValues, formSubmitted, formDocId]);

  // Track when form is first opened
  useEffect(() => {
    if (step === 0) {
      trackFormStart('Project Request');
    }
  }, [step]);

  useEffect(() => {
    const isSoleEntrepreneur = companySizeWatch === singleOptions.companySize[0]?.label;
    if (isSoleEntrepreneur) {
      setValue("hasDataTeam", "no");
    }
  }, [companySizeWatch, setValue, singleOptions.companySize]);

  useEffect(() => {
    if (formSubmitted && submittedValues) {
      console.log("Form submitted with path:", routingPath);
    }
  }, [formSubmitted, submittedValues, routingPath]);

  const calculateScore = (data: ProjectRequestData): { score: number, path: RoutingPath } => {
    let score = 0;

    const publicEmailDomains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com", "zoho.com", "mail.com", "protonmail.com", "gmx.com"];
    const domain = data.email.split('@')[1]?.toLowerCase();
    score += publicEmailDomains.includes(domain) ? -10 : 5;

    const companySizeIndex = singleOptions.companySize.findIndex((o: { label: string }) => o.label === data.companySize);
    const sizeScores = [0, 4, 7, 10, 3];
    if (companySizeIndex !== -1) score += sizeScores[companySizeIndex];

    const timelineIndex = singleOptions.timeline.findIndex((o: { label: string }) => o.label === data.timeline);
    const timelineScores = [5, 3, 1, -5];
    if (timelineIndex !== -1) score += timelineScores[timelineIndex];

    const budgetIndex = singleOptions.budget.findIndex((o: { label: string }) => o.label === data.budget);
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
        const payload = {
          ...data,
          to: data.email,
          userEmail: data.email,
          step: step + 1,
          lang,
        };
        if (formDocId) {
          docRef = doc(db, "project_requests", formDocId);
          await setDoc(docRef, { ...payload, status: "incomplete", last_updated: new Date() }, { merge: true });
        } else {
          const doc = await addDoc(collection(db, "project_requests"), {
            ...payload,
            timestamp: new Date(),
            last_updated: new Date(),
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

        let docId = formDocId;
        if (!docId) {
          const docRef = doc(collection(db, "project_requests"));
          docId = docRef.id;
          setFormDocId(docId);
        }

        const l = (lang === 'nl' || lang === 'de' || lang === 'es') ? lang : 'en';

        const baseData = {
          ...data,
          timestamp: new Date(),
          lead_score: score,
          routing_path: path,
          visitor_id: visitorId,
          trace_id: traceId,
          to: data.email,
          userEmail: data.email,
          lang,
          message: {
            subject: String(getEmailTranslations(dict, l, 'welcome').subject || ''),
            html: getWelcomeEmailHtml(data, docId, l, dict),
          },
          delivery: {
            state: "PENDING"
          }
        };

        // Complete the intake request document in a single transaction
        await setDoc(doc(db, "project_requests", docId), { ...baseData, status: "complete" }, { merge: true });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          'event': 'form_submission',
          'form_name': 'Project Request'
        });


        // Track form submission in GA4
        trackFormSubmission('Project Request', data);

        localStorage.removeItem(STORAGE_KEY);
        setRoutingPath(path);
        setSubmittedValues(data);
        setFormSubmitted(true);
      } catch (error: unknown) {
        console.error("Project request submission failed", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        toast({
          title: dict?.global?.common?.submissionFailed || "Submission Failed",
          description: errorMessage || "There was an error submitting your request.",
          variant: "destructive",
        });
        // Track form error in GA4
        trackFormError('Project Request', errorMessage || "Unknown error");
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

    const isValid = await form.trigger(fieldsToValidate as (keyof ProjectRequestData)[]);

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
    <div className="w-full h-full md:h-auto" onKeyDown={handleKeyDown}>
      {/* Style override to hide header and manage body overflow on mobile project-request page */}
      <style jsx global>{`
        @media (max-width: 768px) {
          header { display: none !important; }
          body { overflow: hidden !important; position: fixed; width: 100%; height: 100%; }
        }
      `}</style>

      {formSubmitted ? (
        <div className="w-full h-full overflow-y-auto md:overflow-y-visible">
          <Card className="w-full max-w-3xl mx-auto bg-card/40 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col items-center justify-center p-4 md:p-8 animate-scale-in rounded-none md:rounded-[2.5rem] md:min-h-0">
            <Spotlight color="rgba(43, 94, 255, 0.1)" />
            <CardHeader className="text-center pb-6">
              <CheckCircle className="mx-auto h-12 w-12 text-primary mb-4 animate-check-bounce" />
              <CardTitle className="text-xl md:text-2xl font-bold tracking-tight">
                {(routingPath === 'A' || routingPath === 'B') ? dict.pages.projectRequest.form.success.title : dict.pages.projectRequest.form.success.titlePathC}
              </CardTitle>
              <CardDescription className="max-w-md mx-auto text-white/65 leading-relaxed font-medium">
                {(routingPath === 'A' || routingPath === 'B') ? dict.pages.projectRequest.form.success.description : dict.pages.projectRequest.form.success.descriptionPathC}
              </CardDescription>
            </CardHeader>

            {(routingPath === 'A' || routingPath === 'B' || routingPath === 'C') && (
              <div className="w-full rounded-3xl overflow-hidden bg-white border border-white/5 mb-8 shadow-inner">
                <iframe
                  src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3GvYWPuGvxv0-8qtgsYeJKkgMUjmUqu-2D2FZrKqU6z75hXbUv6_FjFmbPdPBHcyew-fiAUXQ2?gv=true"
                  style={{ border: 0 }}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Google Calendar Appointment Scheduling"
                ></iframe>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild variant="ghost" className="hover:bg-white/10 text-white/65 text-[10px] font-bold uppercase tracking-[0.3em] rounded-full px-8">
                <Link href={`/${lang}/`}><Home className="mr-2 h-3 w-3" />{dict.pages.projectRequest.form.success.backHome}</Link>
              </Button>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6 md:gap-12 max-w-5xl mx-auto items-stretch md:items-start px-4 md:px-6 h-[100dvh] md:h-auto py-2 md:py-2">
          {/* Technical Progress Index */}
          <div className="hidden md:flex flex-col gap-6 relative">
            {/* Vertical connector line */}
            <div className="absolute left-3 top-10 bottom-0 w-[1px] bg-white/5 z-0" />

            <div className="font-mono text-[9px] tracking-[0.2em] text-white/65 mb-2 pl-1">{"// "}steps</div>
            {formSteps.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => i < step && setStep(i)}
                disabled={i >= step}
                className={cn(
                  "group flex items-center gap-4 text-left transition-all duration-500 relative z-10",
                  step === i ? "text-primary" : i < step ? "text-white/60 hover:text-white" : "text-white/65"
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
                <span className="font-bold text-[10px] tracking-[0.1em]">
                  {dict.pages.projectRequest.form.sidebarSteps?.[s.field as keyof typeof dict.pages.projectRequest.form.sidebarSteps] || s.field.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </button>
            ))}
          </div>

          <Card className="w-full bg-card/60 md:backdrop-blur-2xl border-x-0 border-t-0 md:border border-white/10 shadow-2xl overflow-hidden flex flex-col rounded-none md:rounded-[2.5rem] transform-gpu h-full md:h-auto max-h-[100dvh] md:max-h-none">
            <Spotlight color="rgba(43, 94, 255, 0.08)" />
            <div
                className="hidden"
                style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}
            >
              <iframe
                src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3GvYWPuGvxv0-8qtgsYeJKkgMUjmUqu-2D2FZrKqU6z75hXbUv6_FjFmbPdPBHcyew-fiAUXQ2?gv=true"
                width="100%"
                height="600"
                title="SEO Placeholder"
              ></iframe>
            </div>
            <CardHeader className="p-0">
              <div className="h-1.5 w-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${((step + 1) / (totalSteps + 1)) * 100}%` }}
                  className="h-full bg-gradient-to-r from-primary to-blue-400 shadow-[0_0_15px_rgba(43,94,255,0.4)]"
                />
              </div>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                <CardContent className="p-3 md:p-6 lg:p-10 flex-grow flex flex-col overflow-hidden pt-4 md:pt-6 lg:pt-8">
                <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                      className="w-full flex flex-col justify-start mb-auto md:my-auto"
                    >
                      {step === -1 && (
                        <div className="text-center py-6 md:py-8">
                          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4 md:mb-6">{dict.pages.projectRequest.form.intro.title}</h2>
                          <p className="text-white/65 text-base md:text-lg leading-relaxed font-medium">{dict.pages.projectRequest.form.intro.description}</p>
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
                                  <div className="font-mono text-[10px] tracking-[0.2em] text-primary/60 font-bold">{"// "}{dict.pages.projectRequest.form.sidebarSteps[field as keyof typeof dict.pages.projectRequest.form.sidebarSteps]}</div>
                                  <FormLabel className="text-2xl md:text-3xl font-bold leading-tight text-white block">{label}</FormLabel>
                                  <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium">{description}</p>
                                </div>
                                <FormControl>
                                  <Input
                                    id={f.name}
                                    {...f}
                                    placeholder={dict.global.common.emailPlaceholder}
                                    className="bg-white/[0.03] border-white/10 h-10 md:h-14 text-sm md:text-lg px-5 md:px-8 rounded-2xl md:rounded-3xl focus-visible:ring-primary/40 focus-visible:border-primary/50 transition-all duration-300"
                                  />
                                </FormControl>
                                <FormDescription className="text-[10px] md:text-[11px] tracking-wide font-medium text-white/65 italic">
                                  {dict.pages.projectRequest.form.steps.workEmail.note}
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )} />
                          );
                        }

                        if (['companySize', 'timeline', 'budget'].includes(field)) {
                          const opts = singleOptions[field as keyof typeof singleOptions];
                          const isCompanySize = field === 'companySize';

                          return (
                            <FormField key={field} control={form.control} name={field as keyof ProjectRequestData} render={({ field: f }) => (
                              <FormItem className="space-y-3 md:space-y-6">
                                <div className="space-y-1.5 md:space-y-3">
                                  <div className="font-mono text-[10px] tracking-[0.2em] text-primary/60 font-bold">{"// "}{dict.pages.projectRequest.form.sidebarSteps[field as keyof typeof dict.pages.projectRequest.form.sidebarSteps]}</div>
                                  <FormLabel className="text-2xl md:text-3xl font-bold leading-tight text-white block">{label}</FormLabel>
                                  <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium">{description}</p>
                                </div>
                                <div role="radiogroup" aria-label={label} className={cn(
                                  "grid gap-2 mt-2",
                                  isCompanySize ? "grid-cols-1" : "grid-cols-1"
                                )}>
                                  {opts.map((o: { label: string; hint: string }) => (
                                    <button
                                      key={o.label}
                                      type="button"
                                      role="radio"
                                      aria-checked={f.value === o.label}
                                      onClick={() => { f.onChange(o.label); setTimeout(() => nextStep(), 300); }}
                                      className={cn(
                                        "group flex items-center justify-between transition-all duration-500 border",
                                        isCompanySize ? "py-2 md:py-2.5 px-3 md:px-4 rounded-xl md:rounded-3xl" : "py-2 md:py-2.5 px-3 md:px-4 rounded-2xl md:rounded-3xl",
                                        f.value === o.label
                                          ? "bg-primary/10 border-primary/40 shadow-[0_0_25px_rgba(43,94,255,0.08)]"
                                          : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                      )}
                                    >
                                      <div className="flex items-center gap-1.5 md:gap-2.5">
                                        <span className={cn(
                                          "font-mono text-[9px] md:text-[11px] font-bold px-1.5 md:px-3 py-0.5 md:py-1 rounded-md transition-colors duration-500",
                                          f.value === o.label ? "bg-primary/20 text-primary" : "bg-black/20 text-white/65"
                                        )}>{o.hint}</span>
                                        <span className={cn(
                                          "font-bold text-[9px] md:text-[10px] transition-colors duration-500",
                                          f.value === o.label ? "text-white" : "text-white/60"
                                        )}>{o.label}</span>
                                      </div>
                                      {f.value === o.label && (
                                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                          <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-primary" />
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
                                <div className="font-mono text-[10px] tracking-[0.2em] text-primary/60 font-bold">{"// "}{dict.pages.projectRequest.form.sidebarSteps[field as keyof typeof dict.pages.projectRequest.form.sidebarSteps]}</div>
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white">{label}</h3>
                                <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium">{description}</p>
                              </div>

                              <FormField control={form.control} name="hasProblem" render={({ field: f }) => (
                                  <FormItem className="space-y-2 md:space-y-4">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.problemStatement.hasProblemLabel}</FormLabel>
                                      <div role="radiogroup" aria-label={dict.pages.projectRequest.form.steps.problemStatement.hasProblemLabel} className="grid grid-cols-2 gap-2.5">
                                          {singleOptions.hasProblem.map(o => (
                                              <button
                                                  key={o.key}
                                                  type="button"
                                                  role="radio"
                                                  aria-checked={f.value === o.key}
                                                  onClick={() => { f.onChange(o.key); }}
                                                  className={cn(
                                                  "group flex items-center justify-between p-2 md:p-3 rounded-2xl md:rounded-3xl border transition-all duration-500",
                                                  f.value === o.key
                                                    ? "bg-primary/10 border-primary/40 shadow-[0_0_20px_rgba(43,94,255,0.08)]"
                                                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                                                  )}
                                              >
                                                  <div className="flex items-center gap-1.5 md:gap-2.5">
                                                  <span className={cn(
                                                    "font-mono text-[9px] md:text-[11px] font-bold px-1.5 md:px-3 py-0.5 md:py-1 rounded-md transition-colors duration-500",
                                                    f.value === o.key ? "bg-primary/20 text-primary" : "bg-black/20 text-white/65"
                                                  )}>{o.hint}</span>
                                                  <span className={cn(
                                                    "font-bold text-[9px] md:text-[10px] transition-colors duration-500",
                                                    f.value === o.key ? "text-white" : "text-white/60"
                                                  )}>{o.label}</span>
                                                  </div>
                                                  {f.value === o.key && <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />}
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
                                  className="space-y-3 md:space-y-4"
                                >
                                  <FormField control={form.control} name="problemDescription" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.problemStatement.problemDescriptionLabel}</FormLabel>
                                      <Textarea
                                        id={f.name}
                                        {...f}
                                        placeholder="..."
                                        className="bg-white/[0.03] border-white/10 min-h-[60px] md:min-h-[100px] rounded-xl md:rounded-3xl focus-visible:ring-primary/40 p-3 md:p-5 text-sm md:text-lg"
                                      />
                                      <FormMessage />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="idealState" render={({ field: f }) => (
                                      <FormItem className="space-y-1.5">
                                          <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.problemStatement.idealStateLabel}</FormLabel>
                                          <Textarea
                                            id={f.name}
                                            {...f}
                                            placeholder="..."
                                            className="bg-white/[0.03] border-white/10 min-h-[60px] md:min-h-[100px] rounded-xl md:rounded-3xl focus-visible:ring-primary/40 p-3 md:p-5 text-sm md:text-lg"
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
                                  <div className="space-y-2 md:space-y-3">
                                      <div className="font-mono text-[10px] tracking-[0.2em] text-primary/60 font-bold">{"// "}infrastructure_audit</div>
                                      <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white">{label}</h3>
                                      <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium">{description}</p>
                                  </div>

                                  <div className="space-y-4 md:space-y-6 pt-1 md:pt-2">
                                      <div className="space-y-2.5 md:space-y-4">
                                          {!isSoleEntrepreneur && (
                                              <FormField control={form.control} name="hasDataTeam" render={({ field: f }) => (
                                                  <FormItem className="space-y-1.5">
                                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.dataInfrastructure.hasDataTeamLabel}</FormLabel>
                                                      <div role="radiogroup" aria-label={dict.pages.projectRequest.form.steps.dataInfrastructure.hasDataTeamLabel} className="grid grid-cols-2 gap-2.5">
                                                          {singleOptions.dataInfrastructure.map(o => (
                                                              <button
                                                                  key={o.key}
                                                                  type="button"
                                                                  role="radio"
                                                                  aria-checked={f.value === o.key}
                                                                  onClick={() => f.onChange(o.key)}
                                                                  className={cn(
                                                                      "flex items-center justify-center py-2 md:py-2.5 rounded-xl md:rounded-2xl border transition-all duration-300 text-[9px] md:text-[10px] font-black",
                                                                      f.value === o.key
                                                                        ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                                                                        : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white/65"
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
                                              <FormItem className="space-y-1.5">
                                                  <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.dataInfrastructure.hasCentralDatabaseLabel}</FormLabel>
                                                  <div role="radiogroup" aria-label={dict.pages.projectRequest.form.steps.dataInfrastructure.hasCentralDatabaseLabel} className="grid grid-cols-2 gap-2.5">
                                                      {singleOptions.dataInfrastructure.map(o => (
                                                          <button
                                                              key={o.key}
                                                              type="button"
                                                              role="radio"
                                                              aria-checked={f.value === o.key}
                                                              onClick={() => f.onChange(o.key)}
                                                              className={cn(
                                                                  "flex items-center justify-center py-2 md:py-2.5 rounded-xl md:rounded-2xl border transition-all duration-300 text-[9px] md:text-[10px] font-black",
                                                                  f.value === o.key
                                                                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                                                                    : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white/65"
                                                              )}
                                                          >
                                                              {o.label}
                                                          </button>
                                                      ))}
                                                  </div>
                                              </FormItem>
                                          )} />

                                          <FormField control={form.control} name="hasCloudPlatform" render={({ field: f }) => (
                                              <FormItem className="space-y-1.5">
                                                  <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.dataInfrastructure.hasCloudPlatformLabel}</FormLabel>
                                                  <div role="radiogroup" aria-label={dict.pages.projectRequest.form.steps.dataInfrastructure.hasCloudPlatformLabel} className="grid grid-cols-2 gap-2.5">
                                                      {singleOptions.dataInfrastructure.map(o => (
                                                          <button
                                                              key={o.key}
                                                              type="button"
                                                              role="radio"
                                                              aria-checked={f.value === o.key}
                                                              onClick={() => f.onChange(o.key)}
                                                              className={cn(
                                                                  "flex items-center justify-center py-2 md:py-2.5 rounded-xl md:rounded-2xl border transition-all duration-300 text-[9px] md:text-[10px] font-black",
                                                                  f.value === o.key
                                                                    ? "bg-primary/20 border-primary/40 text-primary shadow-lg shadow-primary/10"
                                                                    : "bg-white/[0.02] border-white/5 text-white/50 hover:text-white/65"
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
                                            <FormItem className="space-y-2">
                                                <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.dataInfrastructure.solutionsInUseLabel}</FormLabel>
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
                            <div key={field} className="space-y-5 md:space-y-8">
                              <div className="space-y-2 md:space-y-3">
                                <div className="font-mono text-[10px] tracking-[0.2em] text-primary/60 font-bold">{"// "}final_verification</div>
                                <h3 className="text-2xl md:text-3xl font-bold leading-tight text-white">{label}</h3>
                                <p className="text-white/60 text-sm md:text-lg leading-relaxed font-medium">{description}</p>
                              </div>

                              <div className="space-y-3 md:space-y-5 pt-1 md:pt-2">
                                <div className="flex flex-col gap-3 md:gap-4">
                                  <FormField control={form.control} name="firstName" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.contact.firstName}</FormLabel>
                                      <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-11 md:h-14 rounded-xl md:rounded-3xl px-5 md:px-8 focus-visible:ring-primary/40 text-base md:text-lg" />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="lastName" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.contact.lastName}</FormLabel>
                                      <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-11 md:h-14 rounded-xl md:rounded-3xl px-5 md:px-8 focus-visible:ring-primary/40 text-base md:text-lg" />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="company" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.contact.company}</FormLabel>
                                      <Input id={f.name} {...f} className="bg-white/[0.03] border-white/10 h-11 md:h-14 rounded-xl md:rounded-3xl px-5 md:px-8 focus-visible:ring-primary/40 text-base md:text-lg" />
                                    </FormItem>
                                  )} />
                                  <FormField control={form.control} name="phone" render={({ field: f }) => (
                                    <FormItem className="space-y-1.5">
                                      <FormLabel className="text-xs md:text-sm font-bold text-white/65 block">{dict.pages.projectRequest.form.steps.contact.phone}</FormLabel>
                                      <PhoneInput
                                        international
                                        defaultCountry="NL"
                                        className="[&_input]:bg-white/[0.03] [&_input]:border-white/10 [&_input]:h-11 md:[&_input]:h-14 [&_input]:rounded-xl md:[&_input]:rounded-3xl [&_input]:px-5 md:[&_input]:px-8 [&_input]:focus-visible:ring-primary/40 [&_input]:text-base md:[&_input]:text-lg"
                                        {...f}
                                      />
                                    </FormItem>
                                  )} />
                                </div>
                                <FormField control={form.control} name="consent" render={({ field: f }) => (
                                  <FormItem className="flex items-center gap-4 space-y-0 bg-white/[0.02] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5">
                                    <FormControl>
                                      <Checkbox checked={f.value} onCheckedChange={f.onChange} />
                                    </FormControl>
                                    <FormLabel className="text-xs md:text-sm font-medium text-white/65 cursor-pointer leading-tight">
                                      {dict.pages.projectRequest.form.steps.contact.consentPreLink}{' '}
                                      <Link href={`/${lang}/privacy-policy/`} className="text-primary hover:underline" target="_blank">
                                        {dict.pages.projectRequest.form.steps.contact.consentLinkText}
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
                <CardFooter className="flex justify-between p-6 md:p-10 border-t border-white/5 bg-black/10 shrink-0">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={step === -1}
                    className="hover:bg-white/5 text-white/65 font-bold text-[10px] md:text-[10px] uppercase tracking-widest rounded-full px-6 md:px-8"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {dict.pages.projectRequest.form.buttons.previous}
                  </Button>
                  <div className="flex gap-4">
                  {step === -1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        className="bg-primary hover:bg-blue-500 text-white font-bold text-[10px] md:text-[10px] uppercase tracking-widest rounded-full px-8 md:px-10 h-12 md:h-12 shadow-[0_0_20px_rgba(43,94,255,0.3)] transition-all duration-300"
                      >
                        {dict.pages.projectRequest.form.buttons.start} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : step < totalSteps - 1 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={isNextButtonDisabled}
                        className="bg-primary hover:bg-blue-500 text-white font-bold text-[10px] md:text-[10px] uppercase tracking-widest rounded-full px-8 md:px-10 h-12 md:h-12 shadow-[0_0_20px_rgba(43,94,255,0.3)] transition-all duration-300 disabled:opacity-20 disabled:shadow-none"
                      >
                        {dict.pages.projectRequest.form.buttons.next} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    ) : (
                      <Magnetic strength={0.1}>
                        <Button
                          type="submit"
                          disabled={isSubmitButtonDisabled}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[10px] md:text-[10px] uppercase tracking-widest rounded-full px-10 md:px-12 h-12 md:h-12 shadow-[0_0_30px_rgba(43,94,255,0.4)] transition-all duration-500 border-none relative overflow-hidden"
                        >
                          <div className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
                          <span className="relative flex items-center">
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {dict.pages.projectRequest.form.buttons.submit}
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
