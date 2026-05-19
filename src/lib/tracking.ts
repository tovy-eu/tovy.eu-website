"use client";

import { v4 as uuidv4 } from "uuid";

const VISITOR_ID_KEY = "tovy_visitor_id";
const SESSION_ID_KEY = "tovy_session_id";

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
  }
  return sessionId;
}

export function getTraceId(): string {
  return uuidv4();
}

/**
 * Sends an event directly to the Firebase Measurement Protocol proxy.
 * This bypasses GTM and ad-blockers entirely.
 */
export async function sendGA4Event(eventName: string, params: Record<string, any> = {}) {
  if (typeof window === "undefined") return;

  // Check consent before sending
  const consentRaw = localStorage.getItem("tovy-cookie-consent");
  const consent = consentRaw ? JSON.parse(consentRaw) : null;
  
  if (!consent || !consent.granted) {
      console.log(`[Analytics Blocked] Event ${eventName} not sent due to lack of consent.`);
      return;
  }

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  const payload = {
    client_id: visitorId,
    events: [
      {
        name: eventName,
        params: {
          session_id: sessionId,
          page_location: window.location.href,
          page_title: document.title,
          engagement_time_msec: 100, // Required for custom events to be processed as engaged
          ...params,
        }
      }
    ]
  };

  try {
    console.log(`[Analytics] Preparing to send ${eventName} to /metrics...`, payload);
    fetch("/metrics", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      keepalive: true,
    }).then(res => {
      console.log(`[Analytics] /metrics response status: ${res.status}`);
    }).catch((err) => {
      console.error(`[Analytics] Fetch failed for ${eventName}:`, err);
    });
  } catch (e) {
    console.error("[Analytics] Try/Catch failed to send GA4 event", e);
  }
}
