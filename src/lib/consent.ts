'use client';

import { trackEvent } from './analytics';

const CONSENT_STORAGE_KEY = 'tovy-cookie-consent';

type Consent = {
  granted: boolean;
  timestamp: number;
} | null;

export function getConsent(): Consent {
  if (typeof window === 'undefined') {
    return null;
  }
  const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
  return storedConsent ? JSON.parse(storedConsent) : null;
}

export function updateConsent(granted: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  const consentValue = granted ? 'granted' : 'denied';

  const consentState = {
    analytics_storage: consentValue,
    ad_storage: consentValue,
    ad_user_data: consentValue,
    ad_personalization: consentValue,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consentState);
    
    trackEvent({
      name: 'cookie_consent_decision',
      event_category: 'compliance',
      event_label: 'Cookie Banner Interaction',
      decision: granted ? 'accept' : 'decline'
    });
  }

  const consentDecision: Consent = {
    granted,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentDecision));
}
