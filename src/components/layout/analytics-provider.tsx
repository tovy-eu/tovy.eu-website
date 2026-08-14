"use client";

import { useEffect } from "react";
import { sendGA4Event, initErrorTracking, initCTATracking, initGA, captureAttribution } from "@/lib/tracking";
import { usePathname } from "next/navigation";

export function AnalyticsProviderHead() {
  return null;
}

export function AnalyticsProviderBody() {
  const pathname = usePathname();

  // Load the tag on every page (Consent Mode v2 gates storage, not the script itself),
  // record first-touch source, and bind event listeners once on mount. CTA/error events
  // fire regardless of consent -> denied traffic sends cookieless pings that feed GA4
  // behavioral modeling, same as page_view. Storage stays consent-gated in sendGA4Event.
  useEffect(() => {
    captureAttribution();
    initGA();
    initErrorTracking();
    initCTATracking();
  }, []);

  // Fire page_view on every route change; denied consent -> cookieless ping
  useEffect(() => {
    sendGA4Event("page_view");
  }, [pathname]);

  return null;
}
