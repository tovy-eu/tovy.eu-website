
'use client';

import { useState, useTransition } from 'react';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Loader2 } from "lucide-react";

const emailSchema = z.string().email({ message: "Please enter a valid email address." });

export function SubscriptionForm() {
  const [email, setEmail] = useState('');
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: "Invalid Email",
        description: result.error.errors[0].message,
        variant: "destructive",
      });
      return;
    }
    
    const validatedEmail = result.data;

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
        <form onSubmit={handleSubmit} className="mt-6 flex w-full max-w-md items-center space-x-2">
          <Input 
            type="email" 
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
        </form>
      </div>
    </div>
  );
}
