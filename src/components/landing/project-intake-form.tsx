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
import { Loader2, ArrowRight, ArrowLeft, Send, CheckCircle } from "lucide-react";

const formSteps = [
  { field: "maturity", label: "What's the maturity of your project?" },
  { field: "companySize", label: "What's your company size?" },
  { field: "engineeringTeam", label: "What's the size of your engineering team?" },
  { field: "projectFocus", label: "What is your project's main focus?" },
  { field: "challenges", label: "What are your main challenges?" },
  { field: "vision", label: "What's your vision for the project?" },
  { field: "budgetReadiness", label: "What's your budget readiness?" },
  { field: "timelineReadiness", label: "What's your timeline readiness?" },
  { field: "name", label: "What's your name?" },
  { field: "email", label: "And your email?" },
];

const totalSteps = formSteps.length;

const options: Record<string, string[]> = {
  maturity: ["Idea / Concept", "Prototype / MVP", "Live Product", "Scaling an Existing Product"],
  companySize: ["1-10 employees", "11-50 employees", "51-200 employees", "201+ employees"],
  engineeringTeam: ["No dedicated team", "1-3 engineers", "4-10 engineers", "10+ engineers"],
  budgetReadiness: ["Have a defined budget", "Exploring options", "No budget yet"],
  timelineReadiness: ["ASAP", "Within 3 months", "3-6 months", "Not sure yet"],
};

export function ProjectIntakeForm() {
  const [step, setStep] = useState(0);
  const { toast } = useToast();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const currentField = formSteps[step].field as keyof ProjectRequestData;

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
    mode: 'onChange',
  });
  
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
    const isValid = await form.trigger(currentField);
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

  const renderField = () => {
    const { field, label } = formSteps[step];
    
    if (options[field]) {
      return (
        <FormField
          control={form.control}
          name={field as keyof ProjectRequestData}
          render={({ field: formField }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
              <FormControl>
                <RadioGroup onValueChange={(value) => { formField.onChange(value); nextStep(); }} defaultValue={formField.value} className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {options[field].map(option => (
                    <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={option} className="h-6 w-6" />
                      </FormControl>
                      <FormLabel className="font-normal text-lg">{option}</FormLabel>
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

    if (['projectFocus', 'challenges', 'vision'].includes(field)) {
      return (
         <FormField
          control={form.control}
          name={field as 'projectFocus' | 'challenges' | 'vision'}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
              <FormControl>
                <Textarea placeholder="Your answer here..." {...formField} className="text-lg mt-4 min-h-[150px]" />
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
            <FormLabel className="text-2xl font-semibold">{label}</FormLabel>
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
            ) : (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
