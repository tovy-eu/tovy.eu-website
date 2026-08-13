"use client";

import { useEffect, useState } from "react";
import { sendGA4Event, initErrorTracking, initCTATracking, initGA, captureAttribution } from "@/lib/tracking";
import { getConsent } from "@/lib/consent";
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

  // Load the tag on every page (Consent Mode v2 gates storage, not the script itself)
  // and record first-touch traffic source before it's lost to navigation.
  useEffect(() => {
    captureAttribution();
    initGA();
  }, []);

  // Fire page_view on every route change; denied consent -> cookieless ping
  useEffect(() => {
    sendGA4Event("page_view");
  }, [pathname]);

  // Track JS errors and CTA clicks (only with consent). Scroll depth + outbound
  // link clicks are handled by GA4 Enhanced Measurement, not custom events.
  useEffect(() => {
    if (!consentGranted) return;

    // Initialize Google Analytics (GA4) out-of-the-box
    initGA();

    // Initialize error tracking (always on)
    initErrorTracking();

    // Initialize CTA click tracking
    initCTATracking();
  }, [consentGranted]);

  return null;
}
