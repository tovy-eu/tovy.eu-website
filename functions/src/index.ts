import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import fetch from "node-fetch";
import { defineString } from "firebase-functions/params";

// Define the secret so the function knows it needs to load it from the .env file.
const apiSecret = defineString("API_SECRET");

// The Measurement ID is not a secret and is safe to have in the code.
const MEASUREMENT_ID = "G-VL0FR2B3DH";

// This is the base URL for the GTM server
const GTM_SERVER_CONTAINER_URL = "https://www.googletagmanager.com";

// The function will now load the secret from the .env file.
export const metrics = onRequest({ cors: true }, async (request, response) => {
  // Adding a log to force a redeployment
  logger.info("Metrics function triggered");

  const isGtmPreview = request.query.id && (request.query.id as string).startsWith('GTM-');

  // Handle GTM preview mode requests
  if (isGtmPreview) {
    let gtmUrl = GTM_SERVER_CONTAINER_URL;
    const queryParams = new URLSearchParams(request.query as any).toString();

    if (request.path.endsWith("/ns.html")) {
      gtmUrl += `/ns.html?${queryParams}`;
    } else {
      gtmUrl += `/gtm.js?${queryParams}`;
    }

    try {
      const gtmResponse = await fetch(gtmUrl);
      gtmResponse.headers.forEach((value, name) => {
        response.setHeader(name, value);
      });
      response.status(gtmResponse.status).send(gtmResponse.body);
    } catch (error) {
      logger.error(`Error fetching GTM resource: ${gtmUrl}`, error);
      response.status(500).send("Error fetching GTM resource.");
    }
    return; 
  }

  if (request.method !== "POST") {
    response.status(204).send();
    return;
  }
  
  // Access the secret's value securely at runtime.
  const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${apiSecret.value()}`;

  try {
    const proxyResponse = await fetch(ga4Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    });

    proxyResponse.headers.forEach((value, name) => {
        response.setHeader(name, value);
    });
    response.status(proxyResponse.status).send(proxyResponse.body);

  } catch (error) {
    logger.error("Error proxying request to Google Analytics", error);
    response.status(500).send("Error proxying request.");
  }
});
