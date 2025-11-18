
'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function SubscriptionForm() {
  return (
    <div className="rounded-lg p-[1px] bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))]">
      <div className="p-8 rounded-lg bg-card/80 backdrop-blur-sm">
        <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] bg-clip-text text-transparent">
          Stay up-to-date
        </h3>
        <p className="mt-2 text-muted-foreground">
          Receive newsletters on what is happening at Tovy.
        </p>
        <form className="mt-6 flex w-full max-w-md items-center space-x-2">
          <Input type="email" placeholder="you@company.com" className="rounded-md" />
          <Button type="submit" className="rounded-md whitespace-nowrap">
            Subscribe <Send className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
