'use client';

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

  const consentDecision: Consent = {
    granted,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consentDecision));
}
