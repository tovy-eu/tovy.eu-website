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

// Must Fix #1: Language and timezone (user_properties)
function getUserLanguage(): string {
  if (typeof window === "undefined") return "en";
  return document.documentElement.lang || navigator.language || "en";
}

function getTimezoneOffset(): number {
  return new Date().getTimezoneOffset();
}

// Must Fix #2: Dynamic engagement time
function getEngagementTimeMs(): number {
  if (typeof window === "undefined") return 100;

  const sessionStartStr = sessionStorage.getItem(SESSION_START_TIME_KEY);
  if (!sessionStartStr) return 100;

  const sessionStartTime = parseInt(sessionStartStr, 10);
  const elapsedMs = Math.max(100, Date.now() - sessionStartTime);
  return Math.min(elapsedMs, 3600000); // Cap at 1 hour to avoid outliers
}

// Must Fix #3: Page referrer
function getPageReferrer(): string {
  if (typeof window === "undefined") return "";
  return document.referrer || "";
}

// Must Fix #4: UTM parameters
function extractUtmParameters(): Record<string, string> {
  if (typeof window === "undefined") return {};

  const params: Record<string, string> = {};
  const searchParams = new URLSearchParams(window.location.search);

  const utmFields = ["source", "medium", "campaign", "content", "term"];
  utmFields.forEach(field => {
    const value = searchParams.get(`utm_${field}`);
    if (value) {
      params[`utm_${field}`] = value;
    }
  });

  return params;
}

// Should Fix #5: Screen resolution and viewport
function getScreenResolution(): string {
  if (typeof window === "undefined") return "0x0";
  return `${window.screen.width}x${window.screen.height}`;
}

function getViewportSize(): string {
  if (typeof window === "undefined") return "0x0";
  return `${Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)}x${Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)}`;
}

// Should Fix #7: User agent classification
function getDeviceCategory(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua)) {
    return "mobile";
  }
  if (/ipad|android(?!.*mobile)|tablet|kindle/i.test(ua)) {
    return "tablet";
  }
  return "desktop";
}

// Should Fix #7: User agent string for detailed device analysis
function getUserAgent(): string {
  if (typeof window === "undefined") return "";
  return navigator.userAgent || "";
}

// Nice to Have #8: User ID for authenticated users
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

// Additional: Debug mode (true in development)
function isDebugMode(): boolean {
  if (typeof window === "undefined") return false;
  return process.env.NODE_ENV !== "production";
}

// Additional: Session timeout check (30 minutes)
function checkSessionTimeout(): void {
  if (typeof window === "undefined") return;

  const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  const sessionStartStr = sessionStorage.getItem(SESSION_START_TIME_KEY);

  if (sessionStartStr) {
    const sessionStartTime = parseInt(sessionStartStr, 10);
    const elapsed = Date.now() - sessionStartTime;

    if (elapsed > SESSION_TIMEOUT_MS) {
      // Session expired, clear it
      sessionStorage.removeItem(SESSION_ID_KEY);
      sessionStorage.removeItem(SESSION_START_TIME_KEY);
    }
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

/**
 * Sends an event directly to the Firebase Measurement Protocol proxy.
 * This bypasses GTM and ad-blockers entirely.
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

  // Check if session has timed out (30 minutes)
  checkSessionTimeout();

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  // Must Fix #1: User properties (language, timezone)
  const userProperties: Record<string, { value: string | number }> = {
    language: { value: getUserLanguage() },
    timezone_offset_minutes: { value: getTimezoneOffset() },
  };

  // Should Fix #7: Device category
  userProperties.device_category = { value: getDeviceCategory() };

  // Additional: Page category for content type analysis
  const pageCategory = getPageCategory();
  if (pageCategory) {
    userProperties.page_category = { value: pageCategory };
  }

  // Build event parameters with all collected data
  const eventParams: Record<string, unknown> = {
    session_id: sessionId,
    // Additional: Sanitize URL to prevent PII leakage
    page_location: sanitizeUrl(window.location.href),
    page_title: document.title,
    // Must Fix #2: Dynamic engagement time
    engagement_time_msec: getEngagementTimeMs(),
    // Must Fix #3: Page referrer
    page_referrer: getPageReferrer(),
    // Should Fix #5: Screen and viewport
    screen_resolution: getScreenResolution(),
    viewport_size: getViewportSize(),
    // Should Fix #7: User agent for detailed device analysis
    user_agent: getUserAgent(),
    ...params,
  };

  // Additional: Add debug mode indicator
  if (isDebugMode()) {
    eventParams.debug_mode = true;
  }

  // Must Fix #4: UTM parameters
  const utmParams = extractUtmParameters();
  Object.assign(eventParams, utmParams);

  const payload: Record<string, unknown> = {
    client_id: visitorId,
    // Should Fix #6: Timestamp in microseconds
    timestamp_micros: Date.now() * 1000,
    // Must Fix #1: User properties object
    user_properties: userProperties,
    events: [
      {
        name: eventName,
        params: eventParams,
      },
    ],
  };

  // Nice to Have #8: Include user_id if user is authenticated
  const userId = getUserId();
  if (userId) {
    payload.user_id = userId;
  }

  try {
    console.log(`[Analytics] Preparing to send ${eventName} to /metrics...`, payload);
    fetch("/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    })
      .then((res) => {
        console.log(`[Analytics] /metrics response status: ${res.status}`);
      })
      .catch((err) => {
        console.error(`[Analytics] Fetch failed for ${eventName}:`, err);
      });
  } catch (e) {
    console.error("[Analytics] Try/Catch failed to send GA4 event", e);
  }
}
