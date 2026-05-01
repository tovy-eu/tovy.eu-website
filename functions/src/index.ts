import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import fetch from "node-fetch";

// These are the details for your GA4 property
const MEASUREMENT_ID = "G-P3JJ2J5C3B";
const API_SECRET = "TjOB82ukQ-Sgpdz2iYyH5g";

// This is the GTM container ID to which your server-side container will forward requests
const GTM_SERVER_CONTAINER_URL = "https://www.googletagmanager.com";

export const metrics = onRequest({ cors: true }, async (request, response) => {
  // Check if the request is for the GTM preview script
  if (request.path.startsWith("/gtm.js")) {
    const gtmUrl = `${GTM_SERVER_CONTAINER_URL}${request.originalUrl.replace("/metrics", "")}`;
    try {
      const gtmResponse = await fetch(gtmUrl);
      gtmResponse.headers.forEach((value, name) => {
        response.setHeader(name, value);
      });
      response.status(gtmResponse.status).send(gtmResponse.body);
    } catch (error) {
      logger.error("Error fetching GTM script", error);
      response.status(500).send("Error fetching GTM script.");
    }
    return;
  }

  // If it's not a GTM script request, handle it as an analytics hit
  const ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;

  try {
    // Forward the request to Google Analytics
    const proxyResponse = await fetch(ga4Url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request.body),
    });

    // Send GA's response back to the original client
    proxyResponse.headers.forEach((value, name) => {
        response.setHeader(name, value);
    });
    response.status(proxyResponse.status).send(proxyResponse.body);

  } catch (error) {
    logger.error("Error proxying request to Google Analytics", error);
    response.status(500).send("Error proxying request.");
  }
});
