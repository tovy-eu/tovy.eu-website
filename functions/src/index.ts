import { onRequest } from "firebase-functions/v2/https";
import { logger } from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { lookup } from "dns";

const MEASUREMENT_ID = defineString("GA4_MEASUREMENT_ID");

const GOOGLEBOT_UA = "Googlebot";
const GOOGLEBOT_REVERSE_DNS_SUFFIX = ".googlebot.com";

const verifyGooglebot = (ip: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    lookup(ip, (err, address, family) => {
      if (err) {
        return reject(err);
      }

      if (!address.endsWith(GOOGLEBOT_REVERSE_DNS_SUFFIX)) {
        return resolve(false);
      }

      lookup(address, (err, forwardAddress, family) => {
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

export const metrics = onRequest(
  { secrets: ["GA4_API_SECRET"], memory: "512MiB" },
  async (request, response) => {
    response.set("X-Robots-Tag", "noindex");
    logger.info("Metrics function triggered");

    const userAgent = request.headers["user-agent"] || "";
    if (userAgent.includes(GOOGLEBOT_UA)) {
      const ip = request.ip;
      try {
        const isGooglebot = await verifyGooglebot(ip);
        if (!isGooglebot) {
          logger.warn("Spoofed Googlebot detected", {
            ip,
            userAgent,
          });
          response.status(403).send("Forbidden");
          return;
        }
      } catch (error) {
        logger.error("Error verifying Googlebot", error);
      }
    }

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
