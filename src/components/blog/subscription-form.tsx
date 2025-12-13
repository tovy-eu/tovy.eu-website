
'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import Link from 'next/link';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

const subscriptionSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  consent: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy." }),
  }),
});

export function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = subscriptionSchema.safeParse({ email, consent });
    if (!result.success) {
      const errorMessage = result.error.errors[0].message;
      toast({
        title: "Submission Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return;
    }
    
    const { email: validatedEmail } = result.data;

    startTransition(async () => {
      try {
        const subscriptionsRef = collection(db, "subscriptions");
        const q = query(subscriptionsRef, where("email", "==", validatedEmail));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          toast({
            title: "Already Subscribed",
            description: "This email address is already on our list. Thank you!",
          });
          setEmail('');
          setConsent(false);
          return;
        }

        await addDoc(subscriptionsRef, {
          email: validatedEmail,
          timestamp: new Date(),
        });
        
        toast({
          title: "Success!",
          description: "Thank you for subscribing to our newsletter.",
        });
        setEmail('');
        setConsent(false);

      } catch (error) {
        console.error("Subscription error:", error);
        toast({
          title: "An Error Occurred",
          description: "Could not subscribe at this time. Please try again later.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="rounded-lg p-[1px] bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] mx-4 md:mx-0">
      <div className="p-8 rounded-lg bg-card/80 backdrop-blur-sm">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
          Stay up-to-date
        </h3>
        <p className="mt-2 text-muted-foreground">
          Receive newsletters on what is happening at Tovy.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 w-full max-w-md">
          <div className="flex w-full items-center space-x-2">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email" 
              placeholder="you@company.com" 
              className="rounded-md" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
            <Button type="submit" className="rounded-md whitespace-nowrap" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...
                </>
              ) : (
                <>
                  Subscribe <Send className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
           <div className="flex items-center space-x-2">
            <Checkbox id="subscription-consent" checked={consent} onCheckedChange={(checked) => setConsent(checked as boolean)} disabled={isPending} />
            <Label htmlFor="subscription-consent" className="text-sm text-muted-foreground">
              I agree to the{" "}
              <Link href="/privacy-policy" target="_blank" className="underline hover:text-primary">
                Privacy Policy
              </Link>
              .
            </Label>
          </div>
        </form>
      </div>
    </div>
  );
}
