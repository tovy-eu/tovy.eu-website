"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onProjectRequestUpdate = exports.metrics = void 0;
const https_1 = require("firebase-functions/v2/https");
const firestore_1 = require("firebase-functions/v2/firestore");
const firebase_functions_1 = require("firebase-functions");
const params_1 = require("firebase-functions/params");
const app_1 = require("firebase-admin/app");
const dns_1 = require("dns");
(0, app_1.initializeApp)();
const MEASUREMENT_ID = (0, params_1.defineString)("GA4_MEASUREMENT_ID");
const MAKE_WEBHOOK_URL = (0, params_1.defineString)("MAKE_WEBHOOK_URL");
const GOOGLEBOT_UA = "Googlebot";
const GOOGLEBOT_REVERSE_DNS_SUFFIX = ".googlebot.com";
// Higher-order function to add the noindex header
const withNoIndex = (handler) => {
    return (req, res) => {
        res.set("X-Robots-Tag", "noindex");
        return handler(req, res);
    };
};
const verifyGooglebot = (ip) => {
    return new Promise((resolve, reject) => {
        (0, dns_1.lookup)(ip, (err, address, family) => {
            if (err) {
                return reject(err);
            }
            if (!address.endsWith(GOOGLEBOT_REVERSE_DNS_SUFFIX)) {
                return resolve(false);
            }
            (0, dns_1.lookup)(address, (err, forwardAddress, family) => {
                if (err) {
                    return reject(err);
                }
                if (ip === forwardAddress) {
                    return resolve(true);
                }
                resolve(false);
            });
        });
    });
};
const metricsHandler = async (request, response) => {
    firebase_functions_1.logger.info("Metrics function triggered");
    const userAgent = request.headers["user-agent"] || "";
    if (userAgent.includes(GOOGLEBOT_UA)) {
        const ip = request.ip;
        if (ip) {
            try {
                const isGooglebot = await verifyGooglebot(ip);
                if (!isGooglebot) {
                    firebase_functions_1.logger.warn("Spoofed Googlebot detected", {
                        ip,
                        userAgent,
                    });
                    response.status(403).send("Forbidden");
                    return;
                }
            }
            catch (error) {
                firebase_functions_1.logger.error("Error verifying Googlebot", error);
            }
        }
    }
    const apiSecret = process.env.GA4_API_SECRET;
    if (!apiSecret) {
        firebase_functions_1.logger.error("GA4_API_SECRET environment variable not set.");
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
};
exports.metrics = (0, https_1.onRequest)({ secrets: ["GA4_API_SECRET"], memory: "512MiB" }, withNoIndex(metricsHandler));
/**
 * Triggered when a project request document is updated.
 * Sends the data to a Make.com webhook when the status changes to 'complete'.
 */
exports.onProjectRequestUpdate = (0, firestore_1.onDocumentUpdated)("project_requests/{docId}", async (event) => {
    const newValue = event.data?.after.data();
    const previousValue = event.data?.before.data();
    if (!newValue || !previousValue) {
        firebase_functions_1.logger.warn("No data found in Firestore event");
        return;
    }
    // Only trigger if status changed to complete
    if (newValue.status === "complete" && previousValue.status !== "complete") {
        firebase_functions_1.logger.info(`Sending project request ${event.params.docId} to Make.com`);
        try {
            const response = await fetch(MAKE_WEBHOOK_URL.value(), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: event.params.docId,
                    ...newValue,
                    triggered_at: new Date().toISOString(),
                }),
            });
            if (!response.ok) {
                throw new Error(`Make.com webhook failed with status ${response.status}`);
            }
            firebase_functions_1.logger.info(`Successfully sent project request ${event.params.docId} to Make.com`);
        }
        catch (error) {
            firebase_functions_1.logger.error(`Error sending project request ${event.params.docId} to Make.com`, error);
        }
    }
});
//# sourceMappingURL=index.js.map