'use client';

// A simple client-side utility for managing GDPR consent and Google Consent Mode v2.

const CONSENT_STORAGE_KEY = 'tovy-cookie-consent';

type Consent = {
  granted: boolean;
  timestamp: number;
} | null;

/**
 * Retrieves the user's consent decision from local storage.
 * @returns {Consent | null} The consent object or null if no decision has been made.
 */
export function getConsent(): Consent {
  if (typeof window === 'undefined') {
    return null;
  }
  const storedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);
  return storedConsent ? JSON.parse(storedConsent) : null;
}

/**
 * Updates the Google Consent Mode settings based on the user's choice and stores it.
 * @param {boolean} granted - Whether the user has granted consent.
 */
export function updateConsent(granted: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  // Define the consent state to be updated.
  // Including all 4 mandatory parameters for Google Consent Mode v2.
  const consentState = {
    analytics_storage: granted ? 'granted' : 'denied',
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: granted ? 'granted' : 'denied',
  };

  // Update Google Consent Mode via the gtag function.
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', consentState);
    
    // Tracking the decision for compliance reporting
    window.gtag('event', 'cookie_consent_decision', {
      event_category: 'compliance',
      event_label: 'Cookie Banner Interaction',
      decision: granted ? 'accept' : 'decline'
    });
  }

  // Store the user's decision in local storage.
  const consentDecision: Consent = {
    granted,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentDecision));
}

// Add a declaration for the gtag function to avoid TypeScript errors.
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
