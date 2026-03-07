'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (window._hsq) {
      // Notify HubSpot of the route change
      window._hsq.push(['setPath', pathname]);
      window._hsq.push(['trackPageView']);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * HubSpot tracker component that handles SPA navigation.
 * Wrapped in Suspense because useSearchParams requires it during static rendering.
 */
export function HubSpotNavigationTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
