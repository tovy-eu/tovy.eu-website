"use client";

import { useEffect } from "react";
import { sendGA4Event } from "@/lib/tracking";
import { getConsent } from "@/lib/consent";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';

export function AnalyticsProviderHead() {
  return null; // GTM is completely removed
}

import { usePathname } from "next/navigation";

export function AnalyticsProviderBody() {
  const pathname = usePathname();

  // Fire page_view on initial load AND route changes
  useEffect(() => {
    const consent = getConsent();
    if (consent && consent.granted) {
        sendGA4Event("page_view");
    }
  }, [pathname]);

  // Track Core Web Vitals
  useEffect(() => {
    const consent = getConsent();
    if (!consent?.granted) return;

    // Cumulative Layout Shift
    onCLS(metric => {
      sendGA4Event('web_vital', {
        metric_name: 'CLS',
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    // Largest Contentful Paint
    onLCP(metric => {
      sendGA4Event('web_vital', {
        metric_name: 'LCP',
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    // First Contentful Paint
    onFCP(metric => {
      sendGA4Event('web_vital', {
        metric_name: 'FCP',
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    // Time to First Byte
    onTTFB(metric => {
      sendGA4Event('web_vital', {
        metric_name: 'TTFB',
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });

    // Interaction to Next Paint (modern replacement for FID)
    onINP(metric => {
      sendGA4Event('web_vital', {
        metric_name: 'INP',
        metric_value: metric.value,
        metric_rating: metric.rating,
      });
    });
  }, []);

  return null;
}
