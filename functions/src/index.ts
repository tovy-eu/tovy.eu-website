import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { defineString } from "firebase-functions/params";

const MEASUREMENT_ID = defineString("GA4_MEASUREMENT_ID");

export const metrics = onRequest(
    { secrets: ["GA4_API_SECRET"], memory: "512MiB" },
    async (request, response) => {
        logger.info("Metrics function triggered");

        const apiSecret = process.env.GA4_API_SECRET;

        if (!apiSecret) {
            logger.error("GA4_API_SECRET environment variable not set.");
            response.status(500).send("Internal Server Error: Secret not configured.");
            return;
        }

        if (request.method !== "POST") {
            response.status(204).send(); // Reverted to 204 as is standard for this method
            return;
        }

        const originalQuery = request.url.split('?')[1];
       
        let ga4Url = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID.value()}&api_secret=${apiSecret}`;

        if (originalQuery) {
            ga4Url += `&${originalQuery}`;
        }
     
        try {
            const proxyResponse = await fetch(ga4Url, {
                method: "POST",
                headers: {
                    "Content-Type": request.headers["content-type"] || "application/json",
                },
                body: request.rawBody,
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
    }
);
