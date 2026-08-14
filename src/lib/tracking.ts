"use client";

import { v4 as uuidv4 } from "uuid";
import { ENTRY_REFERRER_KEY, resolvePageReferrer } from "./referrer";

const VISITOR_ID_KEY = "tovy_visitor_id";
const SESSION_ID_KEY = "tovy_session_id";
const SESSION_START_TIME_KEY = "tovy_session_start_time";
const PAGE_CATEGORY_KEY = "tovy_page_category";

export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return "server-side-user";
  }

  let visitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (!visitorId) {
    visitorId = uuidv4();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }

  return visitorId;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return Date.now().toString();

  let sessionId = sessionStorage.getItem(SESSION_ID_KEY);
  if (!sessionId) {
    // GA4 requires session_id to be a number/timestamp
    sessionId = Date.now().toString();
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    sessionStorage.setItem(SESSION_START_TIME_KEY, Date.now().toString());
  }
  return sessionId;
}

export function getTraceId(): string {
  return uuidv4();
}

// Page referrer for GA (maps to the `dr` param that drives source/medium attribution).
// Uses the stashed entry referrer so the language-redirect hop doesn't turn every visit
// into a self-referral. See resolvePageReferrer / ENTRY_REFERRER_KEY.
function getPageReferrer(): string {
  if (typeof window === "undefined") return "";
  return resolvePageReferrer(
    sessionStorage.getItem(ENTRY_REFERRER_KEY),
    document.referrer,
    window.location.hostname,
  );
}

// ponytail: remove sensitive query params only. email regex in path is fragile and unlikely here.
function sanitizeUrl(url: string): string {
  try {
    const u = new URL(url);
    ["email", "phone", "password", "token", "key", "secret", "api_key"].forEach(p => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return url;
  }
}

// First-touch traffic attribution (UTM + referrer), captured on the landing page and
// persisted for the session so it survives the multi-step intake form.
const ATTRIBUTION_KEY = "tovy_attribution";

export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (sessionStorage.getItem(ATTRIBUTION_KEY)) return; // first touch wins

  const params = new URLSearchParams(window.location.search);
  const attribution: Record<string, string> = {
    referrer: getPageReferrer(),
    landing_page: sanitizeUrl(window.location.href),
    captured_at: new Date().toISOString(),
  };
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"]) {
    const value = params.get(key);
    if (value) attribution[key] = value;
  }
  sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(attribution));
}

export function getAttribution(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY) || "{}");
  } catch {
    return {};
  }
}

// Scroll depth and outbound-link clicks are covered by GA4 Enhanced Measurement
// (auto `scroll` at 90% + `click` with outbound=true), so we don't fire custom
// duplicates. If Enhanced Measurement is ever turned off, re-add them here.

// Additional: Track JavaScript errors
export function initErrorTracking(): void {
  if (typeof window === "undefined") return;

  window.addEventListener("error", (event) => {
    sendGA4Event("page_error", {
      error_message: event.message?.slice(0, 200) || "Unknown error",
      error_source: event.filename?.slice(0, 200) || "",
      error_lineno: event.lineno,
      error_colno: event.colno,
    });
  });

  // Also catch unhandled promise rejections
  window.addEventListener("unhandledrejection", (event) => {
    sendGA4Event("unhandled_promise_rejection", {
      error_message: (event.reason?.message || String(event.reason))?.slice(0, 200) || "Unknown error",
    });
  });
}

// Additional: Track form interactions and submissions
export function trackFormStart(formName: string): void {
  sendGA4Event("form_start", {
    form_name: formName,
  });
}

// Enrichment params attached to the form_submission conversion. Typed so a typo'd
// key (e.g. utm_sauce) is a compile error rather than a silent GA4 param.
type FormSubmissionExtra = {
  lead_score?: number;
  routing_path?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

export function trackFormSubmission(formName: string, formData?: Record<string, unknown>, extra?: FormSubmissionExtra): void {
  const eventData: GA4EventMap["form_submission"] = {
    form_name: formName,
    ...extra,
  };

  // Track which fields were filled (without sending actual values for PII protection)
  if (formData) {
    const filledFields = Object.keys(formData).filter((key) => {
      const value = formData[key];
      return value !== null && value !== undefined && value !== "";
    });
    eventData.form_fields_filled = filledFields.length;
  }

  sendGA4Event("form_submission", eventData);
}

export function trackFormError(formName: string, errorMessage: string): void {
  sendGA4Event("form_error", {
    form_name: formName,
    error_message: errorMessage?.slice(0, 100),
  });
}

// Additional: Page categorization for content type analysis
export function setPageCategory(category: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PAGE_CATEGORY_KEY, category);
}

export function getPageCategory(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(PAGE_CATEGORY_KEY);
}

// Additional: CTA click tracking
export function initCTATracking(): void {
  if (typeof window === "undefined") return;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;

    // Check if it's a button or link with CTA indicators
    const button = target.closest(
      "[data-cta], button[type='submit'], a[data-cta], .cta-button"
    ) as HTMLElement | null;

    if (!button) return;

    // Get CTA identifier
    const ctaName =
      button.getAttribute("data-cta") ||
      button.getAttribute("data-cta-name") ||
      button.textContent?.slice(0, 50) ||
      button.getAttribute("aria-label") ||
      "unknown-cta";

    const ctaType = button.tagName.toLowerCase();
    const pageCategory = getPageCategory();

    sendGA4Event("click_cta", {
      cta_name: ctaName,
      cta_type: ctaType,
      cta_text: button.textContent?.slice(0, 100) || "",
      page_category: pageCategory || "uncategorized",
      page_location: sanitizeUrl(window.location.href),
    });
  });
}

// EEA (EU27 + IS/LI/NO) plus UK and Switzerland: regions where consent must default to
// denied. Everywhere else defaults to granted. ISO 3166-1 alpha-2 codes per Consent Mode.
const EEA_CONSENT_REGIONS = [
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU",
  "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES",
  "SE", "IS", "LI", "NO", "GB", "CH",
];

let gaInitialized = false;

/**
 * Initializes Google Analytics (GA4) dynamically.
 * This loads the standard gtag.js from Google's CDN and configures it.
 */
export function initGA(): void {
  if (typeof window === "undefined" || gaInitialized) return;

  const rawGaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const gaMeasurementId = rawGaId ? rawGaId.replace(/['"]/g, "") : "";

  if (!gaMeasurementId) {
    console.warn("[Analytics] GA Measurement ID is missing in environment variables.");
    return;
  }

  // Set up dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function() {
    // eslint-disable-next-line prefer-rest-params
    (window.dataLayer as unknown[]).push(arguments);
  };

  // Consent Mode v2, region-scoped. GDPR/ePrivacy only bind EEA/UK/CH visitors, so we
  // default those regions to denied (opt-in) and the rest of the world to granted. The tag
  // loads everywhere; EEA users send cookieless pings until they opt in via the banner.
  window.gtag("consent", "default", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  window.gtag("consent", "default", {
    region: EEA_CONSENT_REGIONS,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500,
  });

  // Returning visitors: restore their prior decision immediately (the banner won't re-show).
  // priorDeclined must re-deny explicitly now that non-EEA regions default to granted.
  const priorConsentRaw = localStorage.getItem("tovy-cookie-consent");
  const priorConsent = priorConsentRaw ? JSON.parse(priorConsentRaw) : null;
  const priorGranted = priorConsent?.granted === true;
  const priorDeclined = priorConsent?.granted === false;

  // Configure standard parameters
  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId, {
    send_page_view: false, // Page views are fired manually on route change in AnalyticsProvider
    // GA4 User-ID: stitch sessions into one user. Only attach once consent is granted
    // (getVisitorId writes to localStorage), so denied-state stays cookieless.
    ...(priorGranted ? { user_id: getVisitorId() } : {}),
  });

  if (priorGranted) {
    // Inline (not grantConsent()) to avoid re-entering initGA before gaInitialized is set.
    window.gtag("consent", "update", {
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
      analytics_storage: "granted",
    });
  } else if (priorDeclined) {
    // Honor a prior decline even where the region default is granted (non-EEA).
    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: "denied",
    });
  }

  const firstScript = document.getElementsByTagName("script")[0];
  const scriptEl = document.createElement("script");
  scriptEl.async = true;
  scriptEl.src = `https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`;
  
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(scriptEl, firstScript);
  } else {
    document.head.appendChild(scriptEl);
  }

  gaInitialized = true;
  console.log(`[Analytics] Standard GA4 initialized with Measurement ID: ${gaMeasurementId}`);
}

/**
 * Consent Mode v2: flip storage signals to granted after the user opts in.
 * Call this from the cookie banner's Accept handler.
 */
export function grantConsent(): void {
  if (typeof window === "undefined") return;
  initGA(); // ensure the tag is loaded
  window.gtag?.("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
  setUserId(getVisitorId()); // baseline anonymous User-ID; upgraded to email hash on form submit
}

/**
 * Consent Mode v2: flip storage signals to denied after the user declines. Required now that
 * non-EEA visitors default to granted — without this, a declining ROW visitor would keep
 * being tracked. EEA visitors already default to denied, so this is a no-op for them.
 */
export function denyConsent(): void {
  if (typeof window === "undefined") return;
  initGA(); // ensure gtag exists
  window.gtag?.("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
  clearUserId();
}

/**
 * GA4 User-ID. Associates a stable, non-PII identifier with the user so their
 * sessions (and devices, once we know who they are) stitch into a single user.
 * Only call when analytics consent is granted.
 */
export function setUserId(id: string): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("set", { user_id: id });
}

/** Clear the User-ID on consent revoke / logout. GA4 requires null here, never "". */
export function clearUserId(): void {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("set", { user_id: null });
}

/**
 * Upgrade the anonymous UUID to an email-derived, cross-device User-ID at the point
 * we learn who the lead is (intake-form submit). SHA-256 hex keeps it non-PII per the
 * Google Analytics ToS (no raw email leaves the browser).
 */
export async function setUserIdFromEmail(email: string): Promise<void> {
  if (typeof window === "undefined" || !email) return;
  const bytes = new TextEncoder().encode(email.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, "0")).join("");
  setUserId(hex);
}

/**
 * Registry of every custom GA4 event this app sends, mapped to its parameter shape.
 * Single source of truth for event names + params: `sendGA4Event` is typed against it,
 * so a typo'd event name or a missing/misnamed param is a compile error instead of a
 * silent `(not set)` in GA4. Keep in sync with the custom definitions registered in
 * GA4 Admin (see docs/analytics-todos.md).
 */
export interface GA4EventMap {
  page_view: Record<string, never>;
  click_cta: { cta_name: string; cta_type: string; cta_text: string; page_category: string; page_location: string };
  cta_clicked: { location: string; text: string };
  page_error: { error_message: string; error_source: string; error_lineno: number; error_colno: number };
  unhandled_promise_rejection: { error_message: string };
  form_start: { form_name: string };
  form_submission: { form_name: string; form_fields_filled?: number; [key: string]: unknown };
  form_error: { form_name: string; error_message: string };
  intake_step_completed: { action: string; category: string; label: string; step_number: number; visitor_id: string };
  generate_lead: { form_name: string; lead_score: number; routing_path: string };
  language_switch: { language: string };
}

/**
 * Sends a custom event to GA4 via gtag. Event name and params are type-checked against
 * GA4EventMap; params are optional only for events that take none (e.g. page_view).
 * If GA is not initialized yet, it initializes it dynamically.
 */
export async function sendGA4Event<K extends keyof GA4EventMap>(
  eventName: K,
  ...rest: GA4EventMap[K] extends Record<string, never>
    ? [params?: GA4EventMap[K]]
    : [params: GA4EventMap[K]]
): Promise<void> {
  if (typeof window === "undefined") return;
  const params = (rest[0] ?? {}) as Record<string, unknown>;

  // Ensure GA is initialized (loads on every page; Consent Mode gates storage)
  initGA();

  // Ensure gtag is defined on window
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    };
  }

  const consentRaw = localStorage.getItem("tovy-cookie-consent");
  const granted = consentRaw ? JSON.parse(consentRaw)?.granted === true : false;

  const eventPayload: Record<string, unknown> = {
    page_location: sanitizeUrl(window.location.href),
    page_title: document.title,
    page_referrer: getPageReferrer(),
    ...params,
  };

  // Only attach persistent identifiers (which write to storage) once consent is granted,
  // so denied-state events stay cookieless.
  if (granted) {
    eventPayload.visitor_id = getVisitorId();
    eventPayload.session_id = getSessionId();
  }

  const pageCategory = getPageCategory();
  if (pageCategory) {
    eventPayload.page_category = pageCategory;
  }

  try {
    console.log(`[Analytics] Sending GA4 event ${eventName} via gtag...`, eventPayload);
    window.gtag("event", eventName, eventPayload);
  } catch (e) {
    console.error("[Analytics] Failed to send GA4 event via gtag", e);
  }
}
