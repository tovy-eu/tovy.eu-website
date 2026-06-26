import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

setGlobalOptions({ region: "europe-west4" });
import { getAbandonmentEmailHtml, abandonmentEmailTranslations } from "./templates/abandonment-email";

initializeApp();

const MAKE_WEBHOOK_URL = defineString("MAKE_WEBHOOK_URL");

// Only these fields are ever forwarded to the downstream Make.com automation.
// Anything else a client manages to write to the document is dropped here so it
// cannot be injected into CRM/email flows.
const WEBHOOK_ALLOWED_FIELDS = [
  "email", "companySize", "hasProblem", "problemDescription", "idealState",
  "hasDataTeam", "hasCentralDatabase", "hasCloudPlatform", "solutionsInUse",
  "timeline", "budget", "firstName", "lastName", "company", "phone", "consent",
  "lead_score", "routing_path", "visitor_id", "trace_id", "status", "lang",
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

/**
 * Scheduled cron task executing every 15 minutes.
 * Queries Firestore for incomplete project requests older than 2 hours and queues
 * a visually consistent email abandonment reminder document.
 */
export const checkAbandonmentEmails = onSchedule("every 15 minutes", async (event) => {
  const db = getFirestore();
  
  // Calculate threshold: 2 hours ago
  const threshold = new Date(Date.now() - 2 * 60 * 60 * 1000);
  
  logger.info(`Running scheduled check for incomplete project requests older than: ${threshold.toISOString()}`);
  
  try {
    const snapshot = await db.collection("project_requests")
      .where("status", "==", "incomplete")
      .get();
      
    if (snapshot.empty) {
      logger.info("No incomplete project requests found.");
      return;
    }
    
    // Filter documents in memory to be robust against missing composite indexes
    const abandonedDocs = snapshot.docs.filter(doc => {
      const data = doc.data();
      const lastUpdated = data.last_updated ? data.last_updated.toDate() : (data.timestamp ? data.timestamp.toDate() : null);
      if (!lastUpdated) return false;
      
      return lastUpdated <= threshold;
    });
    
    if (abandonedDocs.length === 0) {
      logger.info("No newly abandoned project requests found (all matching requests were already sent).");
      return;
    }
    
    logger.info(`Found ${abandonedDocs.length} abandoned project requests to process.`);
    
    const batch = db.batch();
    
    for (const doc of abandonedDocs) {
      const data = doc.data();
      const docId = doc.id;
      const email = data.email || data.userEmail;
      
      if (!email) {
        logger.warn(`Document ${docId} has no email address. Skipping.`);
        batch.update(doc.ref, { status: "abandoned", abandonment_sent: true, last_updated: new Date() });
        continue;
      }
      
      logger.info(`Queueing abandonment email reminder to: ${email} (Document: ${docId})`);
      
      const currentYear = new Date().getFullYear();
      const lang = data.lang || 'en';
      const l = (lang === 'nl' || lang === 'de' || lang === 'es') ? lang : 'en';
      const subject = abandonmentEmailTranslations[l].subject;
      const emailHtml = getAbandonmentEmailHtml(docId, currentYear, lang);
      
      // Create a separate mail dispatch trigger document in the same collection
      const mailDocRef = db.collection("project_requests").doc(`${docId}_abandonment`);
      
      batch.set(mailDocRef, {
        to: email,
        message: {
          subject: subject,
          html: emailHtml,
        },
        delivery: {
          state: "PENDING"
        },
        is_abandonment_mail: true,
        original_request_id: docId,
        timestamp: new Date()
      });
      
      // Update original doc to mark reminder as sent
      batch.update(doc.ref, { 
        status: "abandoned",
        abandonment_sent: true, 
        last_updated: new Date() 
      });
    }
    
    await batch.commit();
    logger.info("Successfully processed and queued abandonment email reminders.");
    
  } catch (error) {
    logger.error("Error executing checkAbandonmentEmails scheduled task:", error);
  }
});
