import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Load Environment Variables from .env
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env');

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      else if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

// 2. Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error("[ERROR] Firebase configuration is missing in your .env file.");
  process.exit(1);
}

console.log(`[+] Initializing Firebase Client App for project: ${firebaseConfig.projectId}`);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  const testId = `TestNotification-${Math.random().toString(36).substring(2, 10)}`;
  const targetEmail = `test-${Math.random().toString(36).substring(2, 6)}@tovy.eu`;

  console.log(`\n[+] Starting Automated Notification Test (ID: ${testId})`);
  
  // 1. Establish ntfy baseline
  console.log("[+] Fetching existing ntfy messages baseline...");
  let lastMessageId = null;
  try {
    const res = await fetch("https://ntfy.sh/tovy-emails/json?poll=1&since=latest");
    if (res.ok) {
      const text = await res.text();
      const lines = text.trim().split("\n").filter(Boolean);
      if (lines.length > 0) {
        const lastMsg = JSON.parse(lines[lines.length - 1]);
        lastMessageId = lastMsg.id;
        console.log(`[✔] Baseline established. Last message ID: ${lastMessageId}`);
      } else {
        console.log("[i] No messages on ntfy.sh yet. Baseline is empty.");
      }
    }
  } catch (err) {
    console.warn("[!] Failed to fetch ntfy baseline, proceeding anyway:", err.message);
  }

  // 2. Insert dummy Firestore record
  console.log(`\n[+] Ingesting dummy Firestore record via Client SDK...`);
  let docRef;
  try {
    docRef = await addDoc(collection(db, "project_requests"), {
      email: targetEmail,
      to: targetEmail,
      userEmail: targetEmail,
      firstName: testId,
      lastName: "AutomatedTest",
      company: "Tovy Test Notification Corp",
      timeline: "Immediate (< 1 month)",
      budget: "€10k - €25k",
      status: "incomplete",
      timestamp: new Date(),
    });
    console.log(`[✔] Dummy record created. Doc ID: ${docRef.id}`);
  } catch (err) {
    console.error("[ERROR] Failed to ingest dummy record:", err);
    process.exit(1);
  }

  // 3. Poll ntfy.sh for the notification
  console.log(`\n[+] Polling ntfy.sh for notification (matching: ${testId} or Doc ID: ${docRef.id})...`);
  const maxRetries = 10;
  let success = false;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`[attempt ${attempt}/${maxRetries}] Fetching ntfy messages...`);
    try {
      const res = await fetch("https://ntfy.sh/tovy-emails/json?poll=1");
      if (res.ok) {
        const text = await res.text();
        const lines = text.trim().split("\n").filter(Boolean);
        
        for (const line of lines) {
          try {
            const msgObj = JSON.parse(line);
            
            // Check if this message was sent after our baseline, or matches our test signature
            if (msgObj.message && (msgObj.message.includes(testId) || msgObj.message.includes(docRef.id))) {
              console.log(`\n[🎉 SUCCESS] Notification received on ntfy!`);
              console.log(`-------------------------------------------`);
              console.log(`ID:       ${msgObj.id}`);
              console.log(`Time:     ${new Date(msgObj.time * 1000).toISOString()}`);
              console.log(`Title:    ${msgObj.title || "N/A"}`);
              console.log(`Message:  ${msgObj.message}`);
              console.log(`Tags:     ${msgObj.tags?.join(", ") || "N/A"}`);
              console.log(`Click:    ${msgObj.click || "N/A"}`);
              console.log(`-------------------------------------------`);
              success = true;
              break;
            }
          } catch (e) {
            // Ignore parse errors on individual lines
          }
        }
      }
    } catch (err) {
      console.warn(`[!] Polling error on attempt ${attempt}:`, err.message);
    }

    if (success) break;
    await delay(3000); // Wait 3s between retries
  }

  // 4. Mark dummy record as completed/tested (deletes are restricted for clients)
  console.log(`\n[+] Marking dummy Firestore record as test-completed (ID: ${docRef.id})...`);
  try {
    await updateDoc(doc(db, "project_requests", docRef.id), {
      status: "test-completed"
    });
    console.log("[✔] Dummy record status updated to 'test-completed'.");
  } catch (err) {
    console.warn("[!] Failed to update dummy record status:", err.message);
  }

  if (success) {
    console.log("\n[✔] Test passed! The notification flow is functional end-to-end.\n");
    process.exit(0);
  } else {
    console.log("\n[❌ FAIL] Notification did not arrive on ntfy.sh within the timeout period.\n");
    process.exit(1);
  }
}

run();
