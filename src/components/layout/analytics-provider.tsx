"use client";

import { useEffect } from "react";
import { sendGA4Event } from "@/lib/tracking";
import { getConsent } from "@/lib/consent";

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

  return null;
}
