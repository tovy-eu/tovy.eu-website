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
  const [isPending, startTransition] = useTransition();

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

  useEffect(() => {
    logEvent("began_project_form");
  }, []);
  
  const onSubmit = (data: ProjectRequestData) => {
    startTransition(() => {
      // Since this is a static site, we can't use server actions.
      // You would typically send this data to a third-party service or a backend API.
      // For this example, we'll just log it and show a success message.
      console.log("Form data submitted:", data);
      logEvent("submitted_project_request");
      setFormSubmitted(true);
    });
  };

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
        <Progress value={(step / totalSteps) * 100} className="w-full mt-4" />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="min-h-[400px]">
            {step === 1 && (
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="maturity"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's the maturity of your project?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options.maturity.map(option => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companySize"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's your company size?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options.companySize.map(option => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 2 && (
               <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="engineeringTeam"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's the size of your engineering team?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options.engineeringTeam.map(option => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="projectFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What is your project's main focus?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Building an AI-powered chatbot for customer support" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="challenges"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What are your main challenges?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., Reducing response times, improving accuracy..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's your vision for the project?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., To provide instant, 24/7 support to our users" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 4 && (
              <div className="space-y-8">
                <FormField
                  control={form.control}
                  name="budgetReadiness"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's your budget readiness?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options.budgetReadiness.map(option => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="timelineReadiness"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>What's your timeline readiness?</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {options.timelineReadiness.map(option => (
                            <FormItem key={option} className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value={option} />
                              </FormControl>
                              <FormLabel className="font-normal">{option}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
            {step === 5 && (
               <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 ? (
              <Button type="button" variant="ghost" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
            ) : <div />}
            {step < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
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
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
