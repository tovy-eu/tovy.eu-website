
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A reading progress indicator specifically for KX resources.
 * Positioned at the bottom of the header to help users gauge their progress.
 * It detects KX resource pages by checking the URL structure.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  
  // Detect if we are on a KX resource page (e.g., /en/kx/some-slug)
  // Segments: ['en', 'kx', 'slug'] -> length 3
  const isKxPage = pathname ? pathname.split('/').filter(Boolean).length >= 3 && pathname.includes('/kx/') : false;

  useEffect(() => {
    // Only track scroll progress if we are on a KX page
    if (!isKxPage) return;

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      
      const windowHeight = scrollHeight - clientHeight;
      const scrollPercentage = windowHeight > 0 ? (scrollTop / windowHeight) * 100 : 0;
      
      setProgress(scrollPercentage);
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress(); // Initial check on mount/path change

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, [isKxPage, pathname]);

  if (!isKxPage) return null;

  return (
    <div className="fixed top-20 md:top-24 left-0 w-full h-[2px] z-[60] pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-primary to-[hsl(var(--accent-gradient-stop))] transition-all duration-150 ease-out shadow-[0_0_10px_rgba(43,94,255,0.4)]"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="KX reading progress"
      />
    </div>
  );
}
