"use client";

import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "tovy_visitor_id";
const SESSION_ID_KEY = "tovy_session_id";
const SESSION_START_TIME_KEY = "tovy_session_start_time";
const USER_ID_KEY = "tovy_user_id";
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

// Must Fix #3: Page referrer
function getPageReferrer(): string {
  if (typeof window === "undefined") return "";
  return document.referrer || "";
}

// Nice to Have #8: Include user_id if user is authenticated
export function setUserId(userId: string | null): void {
  if (typeof window === "undefined") return;
  if (userId) {
    localStorage.setItem(USER_ID_KEY, userId);
  } else {
    localStorage.removeItem(USER_ID_KEY);
  }
}

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(USER_ID_KEY);
}

// Additional: PII Protection - sanitize URLs before sending
function sanitizeUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    // Remove sensitive query parameters that might contain PII
    const sensitiveParams = ["email", "phone", "password", "token", "key", "secret", "api_key"];
    sensitiveParams.forEach((param) => {
      urlObj.searchParams.delete(param);
    });
    // Also redact common patterns (email-like in path)
    const pathname = urlObj.pathname.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[email]");
    return `${urlObj.protocol}//${urlObj.hostname}${pathname}${urlObj.search}`;
  } catch {
    return url;
  }
}

// Additional: Track scroll depth
export function initScrollTracking(): void {
  if (typeof window === "undefined") return;

  let maxScrollPercent = 0;
  let scrollEventSent = false;

  const handleScroll = () => {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const scrollPercent = scrollHeight > 0 ? Math.round((scrolled / scrollHeight) * 100) : 0;

    // Update max scroll
    if (scrollPercent > maxScrollPercent) {
      maxScrollPercent = scrollPercent;
    }

    // Send event when user reaches 90% scroll
    if (scrollPercent >= 90 && !scrollEventSent) {
      sendGA4Event("scroll_depth", {
        scroll_percent: 90,
        page_location: window.location.href,
      });
      scrollEventSent = true;
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
}

// Additional: Track outbound links
export function initOutboundLinkTracking(): void {
  if (typeof window === "undefined") return;

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest("a") as HTMLAnchorElement | null;

    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    // Check if it's an external link
    const isExternal =
      href.startsWith("http") &&
      !href.includes(window.location.hostname);

    if (isExternal) {
      sendGA4Event("click_outbound_link", {
        link_url: href,
        link_text: link.textContent?.slice(0, 100) || "",
      });
    }
  });
}

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

export function trackFormSubmission(formName: string, formData?: Record<string, unknown>): void {
  const eventData: Record<string, unknown> = {
    form_name: formName,
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

let gaInitialized = false;

/**
 * Initializes Google Analytics (GA4) dynamically.
 * This loads the standard gtag.js from Google's CDN and configures it.
 */
export function initGA(): void {
  if (typeof window === "undefined" || gaInitialized) return;

  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

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

  // Configure standard parameters
  window.gtag("js", new Date());
  window.gtag("config", gaMeasurementId, {
    send_page_view: false, // Page views are fired manually on route change in AnalyticsProvider
    user_id: getUserId() || undefined,
  });

  gaInitialized = true;
  console.log(`[Analytics] Standard GA4 initialized with Measurement ID: ${gaMeasurementId}`);
}

/**
 * Sends an event to standard Google Analytics (GA4) via gtag.
 * If GA is not initialized yet, it initializes it dynamically.
 */
export async function sendGA4Event(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Check consent before sending
  const consentRaw = localStorage.getItem("tovy-cookie-consent");
  const consent = consentRaw ? JSON.parse(consentRaw) : null;

  if (!consent || !consent.granted) {
    console.log(`[Analytics Blocked] Event ${eventName} not sent due to lack of consent.`);
    return;
  }

  // Ensure GA is initialized
  initGA();

  // Ensure gtag is defined on window
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      // eslint-disable-next-line prefer-rest-params
      (window.dataLayer as unknown[]).push(arguments);
    };
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();
  const pageCategory = getPageCategory();
  const userId = getUserId();

  const eventPayload: Record<string, unknown> = {
    visitor_id: visitorId,
    session_id: sessionId,
    page_location: sanitizeUrl(window.location.href),
    page_title: document.title,
    page_referrer: getPageReferrer(),
    ...params,
  };

  if (pageCategory) {
    eventPayload.page_category = pageCategory;
  }
  if (userId) {
    eventPayload.user_id = userId;
  }

  try {
    console.log(`[Analytics] Sending GA4 event ${eventName} via gtag...`, eventPayload);
    window.gtag("event", eventName, eventPayload);
  } catch (e) {
    console.error("[Analytics] Failed to send GA4 event via gtag", e);
  }
}
