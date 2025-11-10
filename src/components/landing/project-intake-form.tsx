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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import { Loader2, ArrowRight, ArrowLeft, Send, CheckCircle, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const formSteps = [
  { field: "maturity", label: "How mature is your use of AI?*" },
  { field: "companySize", label: "What's your company size?*", description: "This helps us understand the scale of your organization and potential project scope." },
  { field: "engineeringTeam", label: "Do you have an in-house engineering team?*", description: "This helps us understand if we'll collaborate with your team or handle development end-to-end." },
  { field: "projectDetails", label: "What do you need help with?*"},
  { field: "budgetReadiness", label: "What's your budget readiness?" },
  { field: "timelineReadiness", label: "What's your timeline readiness?" },
  { field: "name", label: "What's your name?" },
  { field: "email", label: "And your email?" },
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
    { label: "Have a defined budget" },
    { label: "Exploring options" },
    { label: "No budget yet" },
  ],
  timelineReadiness: [
    { label: "ASAP" },
    { label: "Within 3 months" },
    { label: "3-6 months" },
    { label: "Not sure yet" },
  ],
};

export function ProjectIntakeForm() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentField = formSteps[step].field as keyof ProjectRequestData | "projectDetails";

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
      name: "",
      email: "",
    },
    mode: 'onChange',
  });
  
  const projectFocus = form.watch("projectFocus");
  const challenges = form.watch("challenges");

  useEffect(() => {
    logEvent("began_project_form");
  }, []);

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
    const fieldsToValidate: (keyof ProjectRequestData)[] =
      currentField === 'projectDetails'
        ? ['projectFocus', 'challenges', 'vision']
        : [currentField as keyof ProjectRequestData];
        
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
        {projectFocus && (
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
        {challenges && (
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
              <p className="text-muted-foreground mt-2">This helps us see how far you've taken AI in your business.</p>
              
              <FormControl>
                <>
                  <div className="flex justify-center gap-1 my-4">
                    {Array.from({ length: 11 }, (_, i) => i).map(value => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => {
                          formField.onChange(String(value));
                          setTimeout(() => nextStep(), 200);
                        }}
                        className={cn(
                          "h-12 w-12 flex items-center justify-center border rounded-md transition-colors",
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

    if (field === 'companySize' || field === 'engineeringTeam') {
      const fieldName = field as 'companySize' | 'engineeringTeam';
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

    if (options[field]) {
      return (
        <FormField
          control={form.control}
          name={field as keyof ProjectRequestData}
          render={({ field: formField }) => (
            <FormItem className="space-y-4">
               <div className="flex items-center gap-4">
                <span className="text-primary font-semibold">{step + 1} →</span>
                <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
              </div>
              <FormControl>
                <RadioGroup onValueChange={(value) => { formField.onChange(value); setTimeout(() => nextStep(), 200); }} defaultValue={formField.value} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {options[field].map(option => (
                    <FormItem key={option.label} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={option.label} id={option.label} className="h-6 w-6" />
                      </FormControl>
                      <Label htmlFor={option.label} className="font-normal text-lg cursor-pointer">{option.label}</Label>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      );
    }

    return (
      <FormField
        control={form.control}
        name={field as 'name' | 'email'}
        render={({ field: formField }) => (
          <FormItem>
            <div className="flex items-center gap-4">
              <span className="text-primary font-semibold">{step + 1} →</span>
              <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
            </div>
            <FormControl>
              <Input placeholder="Your answer here..." {...formField} className="text-lg mt-4" type={field === 'email' ? 'email' : 'text'} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
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
            
            {currentField === 'projectDetails' || ['name', 'email'].includes(currentField) ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : null}
            
            {step === totalSteps - 1 ? (
              <Button type="submit" disabled={isPending} size="lg">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    Submit Project <Send className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            ) : null }
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
