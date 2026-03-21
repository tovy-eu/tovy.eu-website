'use client';

import { useReportWebVitals } from 'next/web-vitals';
import { trackEvent } from '@/lib/analytics';

/**
 * A client-side component that captures Next.js performance metrics
 * and sends them to Google Analytics as custom events.
 */
export function WebVitals() {
  useReportWebVitals((metric) => {
    trackEvent({
      name: 'web_vitals',
      event_category: 'performance',
      event_label: metric.name,
      // CLS is often a small decimal; multiplying by 1000 provides a clearer integer value in reports
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      non_interaction: true,
    });
  });

  return null;
}
