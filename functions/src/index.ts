import { onSchedule } from "firebase-functions/v2/scheduler";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
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
export const checkAbandonmentEmails = onSchedule("every 15 minutes", async (_event) => {
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

export const notifyOnRecordCreated = onDocumentCreated("project_requests/{docId}", async (event) => {
  const data = event.data?.data();
  const docId = event.params.docId;

  logger.info(`notifyOnRecordCreated triggered for docId: ${docId}`, { data });

  const name = data?.firstName || "Unknown";
  const email = data?.email || data?.to || "no-email";

  let title = "New Project Request";
  let body = `New form submission from ${name} (${email})\nDoc ID: ${docId}`;
  let tags = "project-request";

  if (data?.is_abandonment_mail) {
    title = "Abandonment Email Queued";
    body = `Abandonment email reminder queued for ${email}\nDoc ID: ${docId}`;
    tags = "email,abandonment";
  } else if (data?.delivery?.state === "PENDING" || data?.message) {
    title = "Email Notification Queued";
    body = `Email dispatch queued for ${email}\nDoc ID: ${docId}`;
    tags = "email,queued";
  }

  try {
    logger.info(`Sending ntfy notification for ${title}...`);
    await fetch("https://ntfy.sh/tovy-emails", {
      method: "POST",
      headers: {
        "Title": title,
        "Priority": "5",
        "Tags": tags,
        "Click": `https://tovy.eu/requests/${docId}`
      },
      body: body
    });
    logger.info("Notification sent successfully");
  } catch (err) {
    logger.error(`Failed to send notification: ${err}`);
  }
});
