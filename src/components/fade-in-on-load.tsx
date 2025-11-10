"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type FadeInOnLoadProps = {
  children: ReactNode;
  className?: string;
  delay?: string;
  duration?: string;
};

export function FadeInOnLoad({ 
  children, 
  className,
  delay = 'delay-300',
  duration = 'duration-700'
}: FadeInOnLoadProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // We use a short timeout to ensure the component is mounted and rendered
    // before we trigger the transition. This helps avoid race conditions.
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        'transition-all ease-in-out',
        duration,
        delay,
        isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </div>
  );
}
