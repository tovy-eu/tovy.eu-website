
'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, writeBatch } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Database } from 'lucide-react';

const testSubscriptions = [
  { email: 'test.user.one@example.com' },
  { email: 'jane.doe@example.com' },
  { email: 'another.subscriber@example.com' },
];

export function SeedSubscriptions() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsLoading(true);
    try {
      // Get a new write batch
      const batch = writeBatch(db);
      const subscriptionsRef = collection(db, 'subscriptions');

      testSubscriptions.forEach(sub => {
        // In a real seed, you'd create a new doc ref for each.
        // For simplicity here, we'll let Firestore auto-generate IDs.
        // This means we can't easily check for existence first in a simple script.
        // This seeder is designed to be run once on an empty collection.
        batch.set(collection(db, 'subscriptions').doc(), {
          email: sub.email,
          timestamp: new Date(),
        });
      });

      // Commit the batch
      await batch.commit();

      toast({
        title: 'Success!',
        description: `Successfully created ${testSubscriptions.length} test subscriptions.`,
      });
    } catch (error) {
      console.error('Error seeding subscriptions:', error);
      toast({
        title: 'An Error Occurred',
        description: 'Could not seed the database. Check the console for more details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground p-6">
      <h3 className="text-lg font-semibold">Developer Tool: Seed Database</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Click the button to create the 'subscriptions' collection and add 3 test documents. This is for one-time setup.
      </p>
      <div className="mt-4">
        <Button onClick={handleSeed} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Seed Subscriptions
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
