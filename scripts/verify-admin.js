const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Initialize with project ID. It will automatically load credentials from Google Application Default Credentials (ADC).
initializeApp({
  projectId: "studio-5767764867-ecdbc"
});

const db = getFirestore();

async function run() {
  try {
    const welcomeId = "tw1t1z03JeGLOsHye58i";
    const abandonmentId = "OvCD6OjkvA0rTxzVxDhQ";

    console.log("=== VERIFYING WELCOME EMAIL FLOW ===");
    const welcomeSnap = await db.collection("project_requests").doc(welcomeId).get();
    if (welcomeSnap.exists) {
      const data = welcomeSnap.data();
      console.log(`Original Doc ID: ${welcomeId}`);
      console.log(`Status: ${data.status}`);
      console.log(`Delivery Info:`, data.delivery);
    } else {
      console.log(`Welcome doc ${welcomeId} not found.`);
    }

    console.log("\n=== VERIFYING ABANDONMENT EMAIL FLOW ===");
    const abandonmentSnap = await db.collection("project_requests").doc(abandonmentId).get();
    if (abandonmentSnap.exists) {
      const data = abandonmentSnap.data();
      console.log(`Original Doc ID: ${abandonmentId}`);
      console.log(`Status: ${data.status}`);
      console.log(`Abandonment Sent Flag: ${data.abandonment_sent}`);
      console.log(`Last Updated:`, data.last_updated?.toDate());
      
      const mailDocId = `${abandonmentId}_abandonment`;
      const mailSnap = await db.collection("project_requests").doc(mailDocId).get();
      if (mailSnap.exists) {
        const mailData = mailSnap.data();
        console.log(`Mail Doc ID: ${mailDocId}`);
        console.log(`To: ${mailData.to}`);
        console.log(`Subject: ${mailData.message?.subject}`);
        console.log(`Delivery Info:`, mailData.delivery);
      } else {
        console.log(`Mail dispatch doc ${mailDocId} not found.`);
      }
    } else {
      console.log(`Abandonment doc ${abandonmentId} not found.`);
    }
  } catch (error) {
    console.error("Admin verification failed:", error);
  }
}

run();
