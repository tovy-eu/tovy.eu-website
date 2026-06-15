"use client";

import { useEffect, useState } from "react";
import { sendGA4Event, initScrollTracking, initOutboundLinkTracking, initErrorTracking, initCTATracking } from "@/lib/tracking";
import { getConsent } from "@/lib/consent";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from 'web-vitals';
import { usePathname } from "next/navigation";

export function AnalyticsProviderHead() {
  return null;
}

export function AnalyticsProviderBody() {
  const pathname = usePathname();
  const [consentGranted, setConsentGranted] = useState(false);

  // Listen for consent changes
  useEffect(() => {
    const checkConsent = () => {
      const consent = getConsent();
      setConsentGranted(consent?.granted ?? false);
    };

    checkConsent();

    // Listen to consent-changed event dispatched by cookie banner
    window.addEventListener("consent-changed", checkConsent);
    return () => window.removeEventListener("consent-changed", checkConsent);
  }, []);

  // Fire page_view on route changes (when consent is granted)
  useEffect(() => {
    if (consentGranted) {
      sendGA4Event("page_view");
    }
  }, [pathname, consentGranted]);

  // Track Core Web Vitals, Errors, Scroll Depth, and Outbound Links (only with consent)
  useEffect(() => {
    if (!consentGranted) return;

    // Initialize error tracking (always on)
    initErrorTracking();

    // Initialize scroll depth tracking
    initScrollTracking();

    // Initialize outbound link tracking
    initOutboundLinkTracking();

    // Initialize CTA click tracking
    initCTATracking();

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
