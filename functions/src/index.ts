import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated, onDocumentWritten } from "firebase-functions/v2/firestore";
import { setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

setGlobalOptions({ region: "europe-west4" });
import { getAbandonmentEmailHtml, abandonmentEmailTranslations } from "./templates/abandonment-email";

initializeApp();

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
      const l: 'en' | 'nl' | 'de' | 'es' = (lang === 'nl' || lang === 'de' || lang === 'es') ? lang : 'en';
      const subject = abandonmentEmailTranslations[l].subject;
      const emailHtml = getAbandonmentEmailHtml(docId, currentYear, lang);
      
      // Create a separate mail dispatch trigger document in the same collection
      const mailDocRef = db.collection("project_requests").doc(`${docId}_abandonment`);
      
      batch.set(mailDocRef, {
        status: "incomplete",
        to: email,
        userEmail: email,
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

export const notifyOnEmailQueued = onDocumentWritten("project_requests/{docId}", async (event) => {
  const before = event.data?.before.data();
  const after = event.data?.after.data();

  // Only notify if message field just appeared (added in this write)
  const hasMessageBefore = !!before?.message?.subject;
  const hasMessageAfter = !!after?.message?.subject;

  if (hasMessageBefore || !hasMessageAfter) {
    logger.info(`Skipping: message existed before=${hasMessageBefore}, exists now=${hasMessageAfter}`);
    return;
  }

  const data = after;
  logger.info(`Sending notification for doc: ${event.params.docId}`, { to: data?.to, subject: data?.message?.subject });

  if (!data?.to) {
    logger.warn(`Skipping: missing to field`);
    return;
  }

  const notifyUrl = "https://ntfy.sh/tovy-emails";
  const docId = event.params.docId;
  const requestId = docId.replace(/_abandonment$/, "");

  try {
    logger.info(`Sending ntfy notification to ${notifyUrl}`, {
      title: "Email Queued",
      priority: "5",
      subject: data.message.subject,
      to: data.to
    });

    const response = await fetch(notifyUrl, {
      method: "POST",
      headers: {
        "Title": "Email Queued",
        "Priority": "5",
        "Tags": "email,abandonment",
        "Click": `https://tovy.eu/requests/${requestId}`
      },
      body: `${data.message.subject}\n\nTo: ${data.to}`
    });

    if (response.ok) {
      logger.info(`ntfy notification sent successfully`);
    } else {
      logger.error(`ntfy returned ${response.status}: ${await response.text()}`);
    }
  } catch (error) {
    logger.error("Failed to send ntfy notification:", error);
  }
});
