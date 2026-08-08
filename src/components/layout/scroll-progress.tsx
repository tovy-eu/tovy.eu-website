'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';


export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  
  const isLandingPage = pathname ? pathname.split('/').filter(Boolean).length === 1 : false;
  const showProgress = isLandingPage;

  useEffect(() => {
    if (!showProgress) return;

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
  }, [showProgress, pathname]);

  if (!showProgress) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[60] pointer-events-none py-4">
      <div className="container mx-auto relative h-14 md:h-16 max-w-7xl">
        {/* Luminous Border Trace SVG */}
        <svg 
          className="absolute inset-0 w-full h-full overflow-visible"
          style={{ 
            opacity: progress > 0 ? 1 : 0,
            transition: 'opacity 0.5s ease'
          }}
        >
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            rx="999px"
            fill="none"
            stroke="url(#progress-gradient)"
            strokeWidth="2"
            pathLength="100"
            strokeDasharray="100"
            strokeDashoffset={100 - progress}
            className="transition-all duration-200 ease-out"
            style={{
              filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.3))'
            }}
          />
          <defs>
            <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent-gradient-stop))" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
