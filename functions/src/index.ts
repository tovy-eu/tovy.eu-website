/**
 * @fileOverview Privacy-First Analytics Proxy for Tovy (ssGTM).
 * Detects Global Privacy Control (GPC) signals and enforces compliance at the edge.
 */

import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import fetch from "node-fetch";

// The endpoint for your ssGTM container on Google Cloud Run
const SSGTM_ENDPOINT = "https://metrics.tovy.ai"; // Ensure this maps to your Cloud Run URL

export const privacyProxy = onRequest({
  region: "europe-west1",
  memory: "256MiB",
  maxInstances: 10,
}, async (req, res) => {
  const gpcEnabled = req.headers["sec-gpc"] === "1";
  const targetUrl = `${SSGTM_ENDPOINT}${req.url}`;

  logger.info(`Proxying request to ssGTM: ${req.method} ${req.url}`, { gpcEnabled });

  // Prepare headers for the proxied request
  const headers = { ...req.headers } as Record<string, string>;
  
  // If Global Privacy Control is enabled, strip all cookies before proxying
  if (gpcEnabled) {
    logger.warn("GPC Detected: Stripping cookies for user privacy.");
    delete headers["cookie"];
    delete headers["set-cookie"];
    
    // Signal GPC acknowledgment to the browser
    res.setHeader("GPC-Acknowledged", "true");
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: req.method !== "GET" && req.method !== "HEAD" ? req.rawBody : undefined,
    });

    // Pass through status and headers from ssGTM
    res.status(response.status);
    response.headers.forEach((value, key) => {
      // Don't leak internal Cloud Run headers
      if (!key.toLowerCase().startsWith("x-cloud-")) {
        res.setHeader(key, value);
      }
    });

    const body = await response.buffer();
    res.send(body);
  } catch (error) {
    logger.error("Error proxying to ssGTM", error);
    res.status(502).send("Bad Gateway");
  }
});