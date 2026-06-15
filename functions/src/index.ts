import { onRequest, Request } from "firebase-functions/v2/https";
import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { logger } from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { Response } from "express";

initializeApp();

const MEASUREMENT_ID = defineString("GA4_MEASUREMENT_ID");
const MAKE_WEBHOOK_URL = defineString("MAKE_WEBHOOK_URL");


const sanitizeAndCleanIp = (ip: string): string => {
  let cleaned = ip.trim();

  // Strip IPv4 port (e.g., 1.2.3.4:8080 -> 1.2.3.4)
  if (cleaned.includes(".") && cleaned.includes(":")) {
    const lastColon = cleaned.lastIndexOf(":");
    cleaned = cleaned.substring(0, lastColon);
  }

  // Strip IPv6 brackets and port (e.g., [2001:db8::1]:8080 -> 2001:db8::1)
  if (cleaned.startsWith("[") && cleaned.includes("]")) {
    const closingBracket = cleaned.indexOf("]");
    cleaned = cleaned.substring(1, closingBracket);
  }

  return cleaned;
};

const isValidIp = (ip: string): boolean => {
  // Basic IPv4 validation: check for obvious non-IPs (localhost, internal)
  if (!ip || ip.includes("127.") || ip === "::1") return false;
  if (ip === "localhost") return false;
  // Basic format check for IPv4
  if (ip.includes(".")) {
    const parts = ip.split(".");
    return parts.length === 4 && parts.every(p => {
      const num = parseInt(p);
      return !isNaN(num) && num >= 0 && num <= 255;
    });
  }
  // IPv6 - at least has colons
  return ip.includes(":");
};

export const getClientIp = (request: Request): string | null => {
  // Try multiple headers in priority order

  // 1. fastly-client-ip is specific to Firebase Hosting and highly reliable
  const fastlyIp = request.headers["fastly-client-ip"] as string;
  if (fastlyIp) {
    const cleaned = sanitizeAndCleanIp(fastlyIp);
    if (isValidIp(cleaned)) return cleaned;
  }

  // 2. x-forwarded-for is most reliable general standard proxy header
  const xForwardedFor = request.headers["x-forwarded-for"] as string;
  if (xForwardedFor) {
    const ips = xForwardedFor.split(",").map(ip => ip.trim());
    const firstIp = ips[0]; // First IP is original client
    if (firstIp) {
      const cleaned = sanitizeAndCleanIp(firstIp);
      if (isValidIp(cleaned)) return cleaned;
    }
  }

  // 3. Cloudflare header
  const cfIp = request.headers["cf-connecting-ip"] as string;
  if (cfIp) {
    const cleaned = sanitizeAndCleanIp(cfIp);
    if (isValidIp(cleaned)) return cleaned;
  }

  // 4. x-appengine-user-ip
  const aeIp = request.headers["x-appengine-user-ip"] as string;
  if (aeIp) {
    const cleaned = sanitizeAndCleanIp(aeIp);
    if (isValidIp(cleaned)) return cleaned;
  }

  // 5. Firebase request.ip - fallback, may be internal
  if (request.ip) {
    const cleaned = sanitizeAndCleanIp(request.ip);
    if (isValidIp(cleaned)) return cleaned;
  }

  return null;
};

export const metricsHandler = async (request: Request, response: Response) => {
  const userAgent = (request.headers["user-agent"] as string) || "";
  const clientIp = getClientIp(request);

  logger.info(`Metrics function triggered. Client IP: ${clientIp}, User Agent: ${userAgent}`);

  const apiSecret = process.env.GA4_API_SECRET;

  if (!apiSecret) {
    logger.error("GA4_API_SECRET environment variable not set.");
    response.status(500).send("Internal Server Error: Secret not configured.");
    return;
  }

  if (request.method !== "POST") {
    response.status(204).send();
    return;
  }

  const originalQuery = request.url.split("?")[1];

  let ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID.value()}&api_secret=${apiSecret}`;

  if (originalQuery) {
    ga4Url += `&${originalQuery}`;
  }

  try {
    const bodyBuffer = (request as Request & { rawBody?: Buffer }).rawBody;
    const bodyObj = (request as Request).body;
    let finalBody: string | Buffer | undefined = bodyBuffer;

    // Parse the body as JSON and inject ip_override and user_agent into the top level
    const contentType = request.headers["content-type"] || "";
    if (contentType.includes("application/json")) {
      let jsonBody: any = null;

      // Case 1: body is already parsed as an object (very common in Express/Firebase middleware)
      if (bodyObj && typeof bodyObj === "object") {
        jsonBody = { ...bodyObj };
      } 
      // Case 2: body is still a Buffer in rawBody
      else if (bodyBuffer && bodyBuffer.length > 0) {
        try {
          const bodyStr = bodyBuffer.toString("utf8");
          jsonBody = JSON.parse(bodyStr);
        } catch (parseError) {
          logger.warn("Failed to parse request rawBody as JSON.", parseError);
        }
      }

      // If we successfully retrieved/parsed the JSON body, inject the fields
      if (jsonBody) {
        if (clientIp) {
          jsonBody.ip_override = clientIp;
        }
        if (userAgent) {
          jsonBody.user_agent = userAgent;
        }

        finalBody = JSON.stringify(jsonBody);
        logger.info(`Successfully injected ip_override (${clientIp}) and user_agent into JSON payload`);
      }
    }

    const proxyResponse = await fetch(ga4Url, {
      method: "POST",
      headers: {
        "Content-Type": contentType || "application/json",
      },
      body: finalBody,
    });

    proxyResponse.headers.forEach((value: string, name: string) => {
      response.setHeader(name, value);
    });

    const responseBody = await proxyResponse.text();
    response.status(proxyResponse.status).send(responseBody);
  } catch (error) {
    logger.error("Error proxying request to Google Analytics", error);
    response.status(500).send("Error proxying request.");
  }
};

export const metrics = onRequest(
  { secrets: ["GA4_API_SECRET"], memory: "512MiB", region: "europe-west4", invoker: "public" },
  metricsHandler
);

// Only these fields are ever forwarded to the downstream Make.com automation.
// Anything else a client manages to write to the document is dropped here so it
// cannot be injected into CRM/email flows.
const WEBHOOK_ALLOWED_FIELDS = [
  "email", "companySize", "hasProblem", "problemDescription", "idealState",
  "hasDataTeam", "hasCentralDatabase", "hasCloudPlatform", "solutionsInUse",
  "timeline", "budget", "firstName", "lastName", "company", "phone", "consent",
  "lead_score", "routing_path", "visitor_id", "trace_id", "status",
] as const;

const MAX_WEBHOOK_STRING_LENGTH = 5000;

const sanitizeWebhookValue = (value: unknown): unknown => {
  if (typeof value === "string") return value.slice(0, MAX_WEBHOOK_STRING_LENGTH);
  if (Array.isArray(value)) return value.slice(0, 50).map(sanitizeWebhookValue);
  return value;
};

const buildWebhookPayload = (docId: string, data: Record<string, unknown>) => {
  const payload: Record<string, unknown> = {
    id: docId,
    triggered_at: new Date().toISOString(),
  };
  for (const key of WEBHOOK_ALLOWED_FIELDS) {
    if (key in data) payload[key] = sanitizeWebhookValue(data[key]);
  }
  return payload;
};

/**
 * Triggered when a project request document is updated.
 * Sends the data to a Make.com webhook when the status changes to 'complete'.
 */
export const onProjectRequestUpdate = onDocumentUpdated("project_requests/{docId}", async (event) => {
  const newValue = event.data?.after.data();
  const previousValue = event.data?.before.data();

  if (!newValue || !previousValue) {
    logger.warn("No data found in Firestore event");
    return;
  }

  // Only trigger if status changed to complete
  if (newValue.status === "complete" && previousValue.status !== "complete") {
    logger.info(`Sending project request ${event.params.docId} to Make.com`);
    
    try {
      const response = await fetch(MAKE_WEBHOOK_URL.value(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildWebhookPayload(event.params.docId, newValue)),
      });

      if (!response.ok) {
        throw new Error(`Make.com webhook failed with status ${response.status}`);
      }

      logger.info(`Successfully sent project request ${event.params.docId} to Make.com`);
    } catch (error) {
      logger.error(`Error sending project request ${event.params.docId} to Make.com`, error);
    }
  }
});
