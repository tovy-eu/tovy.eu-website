"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
const params_1 = require("firebase-functions/params");
const MEASUREMENT_ID = (0, params_1.defineString)("GA4_MEASUREMENT_ID");
exports.metrics = (0, https_1.onRequest)({ secrets: ["GA4_API_SECRET"], memory: "512MiB" }, async (request, response) => {
    firebase_functions_1.logger.info("Metrics function triggered");
    const apiSecret = process.env.GA4_API_SECRET;
    if (!apiSecret) {
        firebase_functions_1.logger.error("GA4_API_SECRET environment variable not set.");
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
        proxyResponse.headers.forEach((value, name) => {
            response.setHeader(name, value);
        });
        const responseBody = await proxyResponse.text();
        response.status(proxyResponse.status).send(responseBody);
    }
    catch (error) {
        firebase_functions_1.logger.error("Error proxying request to Google Analytics", error);
        response.status(500).send("Error proxying request.");
    }
});
//# sourceMappingURL=index.js.map