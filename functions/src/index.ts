import { onRequest } from "firebase-functions/v2/https";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions";

setGlobalOptions({ region: "europe-west4" });

/**
 * Proxy for project intake form submissions.
 * Adds the webhook secret server-side so it's never exposed to the browser.
 */
export const submitIntake = onRequest(
  { cors: ["https://www.tovy.eu", "https://tovy.eu"] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).send("Method Not Allowed");
      return;
    }

    const url = process.env.TOVY_OS_URL ?? "";
    const secret = process.env.TOVY_OS_WEBHOOK_SECRET ?? "";

    // Firebase Hosting/GFE puts the real visitor IP first in X-Forwarded-For.
    // Without this the backend only sees the function's egress IP and rate-limits
    // every visitor as one shared bucket. ponytail: leftmost XFF is spoofable —
    // enough to keep real users in distinct buckets; bot abuse needs a CAPTCHA.
    const clientIp =
      req.headers["x-forwarded-for"]?.toString().split(",")[0].trim() ||
      req.ip ||
      "unknown";

    try {
      const upstream = await fetch(`${url}/webhook/website`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Secret": secret,
          "X-Client-IP": clientIp,
        },
        body: JSON.stringify(req.body),
      });

      const data = await upstream.json();
      res.status(upstream.status).json(data);
    } catch (err) {
      logger.error("submitIntake upstream error", err);
      res.status(502).json({ error: "Upstream error" });
    }
  }
);

