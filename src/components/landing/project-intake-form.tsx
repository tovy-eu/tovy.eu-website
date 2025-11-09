"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFormState } from "react-dom";
import { projectRequestSchema, type ProjectRequestData } from "@/lib/definitions";
import { submitProjectRequest } from "@/app/actions";
import { logEvent } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, Send, CheckCircle } from "lucide-react";

const totalSteps = 5;

const options = {
  maturity: ["Idea / Concept", "Prototype / MVP", "Live Product", "Scaling an Existing Product"],
  companySize: ["1-10 employees", "11-50 employees", "51-200 employees", "201+ employees"],
  engineeringTeam: ["No dedicated team", "1-3 engineers", "4-10 engineers", "10+ engineers"],
  budgetReadiness: ["Have a defined budget", "Exploring options", "No budget yet"],
  timelineReadiness: ["ASAP", "Within 3 months", "3-6 months", "Not sure yet"],
};

export function ProjectIntakeForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);

  const form = useForm<ProjectRequestData>({
    resolver: zodResolver(projectRequestSchema),
    defaultValues: {
      maturity: "",
      companySize: "",
      engineeringTeam: "",
      projectFocus: "",
      challenges: "",
      vision: "",
      name: "",
      email: "",
    },
  });

  const [state, formAction] = useFormState(submitProjectRequest, { message: "", success: false });

  useEffect(() => {
    logEvent("began_project_form");
  }, []);
  
  useEffect(() => {
    if (state.message) {
      if (state.success) {
        setFormSubmitted(true);
        logEvent("submitted_project_request");
      } else {
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: state.message,
        });
      }
    }
  }, [state, toast]);

  const nextStep = async () => {
    const fieldsToValidate: (keyof ProjectRequestData)[] = step === 1
        ? ["maturity", "companySize"]
        : step === 2
        ? ["engineeringTeam"]
        : step === 3
        ? ["projectFocus", "challenges", "vision"]
        : step === 4
        ? ["budgetReadiness", "timelineReadiness"]
        : step === 5
        ? ["name", "email"]
        : [];
    
    const isValid = fieldsToValidate.length > 0 ? await form.trigger(fieldsToValidate) : true;

    if (isValid) {
      if (step === 3) {
        logEvent('completed_form_step_3');
      }
      setStep(s => Math.min(s + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setStep(s => Math.max(s - 1, 1));
  };
  
  if (formSubmitted) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Let's build together</CardTitle>
        <CardDescription>Tell us about your project. It'll take just a few minutes.</CardDescription>
        <Progress value={(step / totalSteps) * 100} className="mt-4" />
      </CardHeader>
      <Form {...form}>
        <form action={formAction}>
          <CardContent className="min-h-[350px]">
            {step === 1 && (
              <div className="space-y-8">
                <FormField name="maturity" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Project Maturity</FormLabel>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                      {options.maturity.map(opt => <FormItem key={opt}><FormControl><RadioGroupItem value={opt} id={opt} className="peer sr-only" /><Label htmlFor={opt} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{opt}</Label></FormItem>)}
                    </RadioGroup><FormMessage />
                  </FormItem>
                )} />
                <FormField name="companySize" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Company Size</FormLabel>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                       {options.companySize.map(opt => <FormItem key={opt}><FormControl><RadioGroupItem value={opt} id={opt} className="peer sr-only" /><Label htmlFor={opt} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{opt}</Label></FormItem>)}
                    </RadioGroup><FormMessage />
                  </FormItem>
                )} />
              </div>
            )}
            {step === 2 && (
              <div className="space-y-8">
                 <FormField name="engineeringTeam" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Engineering Team</FormLabel>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 gap-4">
                       {options.engineeringTeam.map(opt => <FormItem key={opt}><FormControl><RadioGroupItem value={opt} id={opt} className="peer sr-only" /><Label htmlFor={opt} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{opt}</Label></FormItem>)}
                    </RadioGroup><FormMessage />
                  </FormItem>
                )} />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-6">
                <FormField control={form.control} name="projectFocus" render={({ field }) => (
                  <FormItem><FormLabel className="text-lg">What is your project's main focus?</FormLabel><FormControl><Textarea placeholder="e.g., Building an internal knowledge base, creating a customer-facing chatbot..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="challenges" render={({ field }) => (
                  <FormItem><FormLabel className="text-lg">What are your main challenges?</FormLabel><FormControl><Textarea placeholder="e.g., Unstructured data, slow response times, high support volume..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="vision" render={({ field }) => (
                  <FormItem><FormLabel className="text-lg">What is your vision for this project?</FormLabel><FormControl><Textarea placeholder="e.g., Automate 50% of support tickets, provide instant answers to employee questions..." {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-8">
                <FormField name="budgetReadiness" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Budget Readiness</FormLabel>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {options.budgetReadiness.map(opt => <FormItem key={opt}><FormControl><RadioGroupItem value={opt} id={opt} className="peer sr-only" /><Label htmlFor={opt} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{opt}</Label></FormItem>)}
                    </RadioGroup><FormMessage />
                  </FormItem>
                )} />
                <FormField name="timelineReadiness" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Timeline Readiness</FormLabel>
                    <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {options.timelineReadiness.map(opt => <FormItem key={opt}><FormControl><RadioGroupItem value={opt} id={opt} className="peer sr-only" /><Label htmlFor={opt} className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">{opt}</Label></FormItem>)}
                    </RadioGroup><FormMessage />
                  </FormItem>
                )} />
              </div>
            )}
            {step === 5 && (
              <div className="space-y-6">
                <p className="text-lg font-semibold">Almost there! Just a few final details.</p>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="Jane Doe" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Your Email</FormLabel><FormControl><Input placeholder="jane.doe@example.com" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (<Button type="button" variant="ghost" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4"/>Back</Button>) : <div/>}
            {step < totalSteps ? (<Button type="button" onClick={nextStep}>Next<ArrowRight className="ml-2 h-4 w-4"/></Button>) : (
              <SubmitButton />
            )}
          </CardFooter>
          {/* Hidden inputs to pass all data to server action */}
          {Object.entries(form.getValues()).map(([key, value]) => 
            value && typeof value === 'string' ? <input key={key} type="hidden" name={key} value={value} /> : null
          )}
        </form>
      </Form>
    </Card>
  );
}

function SubmitButton() {
  const [pending, startTransition] = useTransition();
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    startTransition(() => {
      // The form submission is handled by the form's action prop
      // We just need to trigger the form submission programmatically
      event.currentTarget.form?.requestSubmit();
    });
  };

  return (
    <Button type="submit" onClick={handleClick} disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
        </>
      ) : (
        <>
          Submit Project <Send className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
