
'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from '@/lib/analytics';
import { useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * A client-side component that captures Next.js performance metrics
 * and sends them to Google Analytics as custom events.
*/
export function WebVitals() {
  const reportedMetricNames = useRef<Set<string>>(new Set());
  const pathname = usePathname();

  // Reset reported metrics on route change (new page navigation)
  useEffect(() => {
    reportedMetricNames.current.clear();
  }, [pathname]);

  useReportWebVitals((metric) => {
    // Only report each metric name once per page load
    if (!reportedMetricNames.current.has(metric.name)) {
      trackEvent({
        name: 'web_vitals',
        event_category: 'performance',
        event_label: metric.name,
        // CLS is often a small decimal; multiplying by 1000 provides a clearer integer value in reports
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        metric_id: metric.id,
        non_interaction: true,
      });
      reportedMetricNames.current.add(metric.name);
    }
  });

  return null;
}
