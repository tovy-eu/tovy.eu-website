"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metrics = void 0;
const https_1 = require("firebase-functions/v2/https");
const firebase_functions_1 = require("firebase-functions");
const node_fetch_1 = require("node-fetch");
const params_1 = require("firebase-functions/params");
// Define the secret so the function knows it needs to load it from the .env file.
const apiSecret = (0, params_1.defineString)("API_SECRET");
// The Measurement ID is not a secret and is safe to have in the code.
const MEASUREMENT_ID = "G-VL0FR2B3DH";
// This is the base URL for the GTM server
const GTM_SERVER_CONTAINER_URL = "https://www.googletagmanager.com";
// The function will now load the secret from the .env file.
exports.metrics = (0, https_1.onRequest)({ cors: true }, async (request, response) => {
    // Adding a log to force a redeployment
    firebase_functions_1.logger.info("Metrics function triggered");
    const isGtmPreview = request.query.id && request.query.id.startsWith('GTM-');
    // Handle GTM preview mode requests
    if (isGtmPreview) {
        let gtmUrl = GTM_SERVER_CONTAINER_URL;
        const queryParams = new URLSearchParams(request.query).toString();
        if (request.path.endsWith("/ns.html")) {
            gtmUrl += `/ns.html?${queryParams}`;
        }
        else {
            gtmUrl += `/gtm.js?${queryParams}`;
        }
        try {
            const gtmResponse = await (0, node_fetch_1.default)(gtmUrl);
            gtmResponse.headers.forEach((value, name) => {
                response.setHeader(name, value);
            });
            response.status(gtmResponse.status).send(gtmResponse.body);
        }
        catch (error) {
            firebase_functions_1.logger.error(`Error fetching GTM resource: ${gtmUrl}`, error);
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
        const proxyResponse = await (0, node_fetch_1.default)(ga4Url, {
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
    }
    catch (error) {
        firebase_functions_1.logger.error("Error proxying request to Google Analytics", error);
        response.status(500).send("Error proxying request.");
    }
});
//# sourceMappingURL=index.js.map