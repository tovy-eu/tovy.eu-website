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

const targetEmail = process.argv[2] || "info@tovy.eu";

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

console.log(`[+] Initializing Firebase App for project: ${firebaseConfig.projectId}`);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    // --- 1. Test Welcome Email ---
    console.log(`\n[+] Creating test document for Welcome Email (target: ${targetEmail})...`);
    
    // Create first as incomplete to satisfy rules
    const welcomeDocRef = await addDoc(collection(db, "project_requests"), {
      email: targetEmail,
      to: targetEmail,
      userEmail: targetEmail,
      firstName: "Test-Giel-Welcome",
      lastName: "Nijkamp",
      company: "Tovy Test Welcome",
      timeline: "Immediate (< 1 month)",
      budget: "€10k - €25k",
      status: "incomplete",
      timestamp: new Date(),
    });
    console.log(`[✔] Incomplete document created. ID: ${welcomeDocRef.id}`);

    const welcomeHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Tovy</title>
      </head>
      <body style="background-color: #030712; color: #f8fafc; font-family: sans-serif; padding: 40px;">
        <div style="max-width: 600px; margin: 0 auto; background: rgba(3, 7, 18, 0.85); border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; padding: 40px;">
          <img src="https://tovy.eu/images/tovy-logo-email.png" alt="TOVY" height="32" style="display: block; margin-bottom: 24px;" />
          <p>Hi Test-Giel,</p>
          <h2 style="color: #ffffff;">Welcome to Tovy. This is your first step to automation.</h2>
          <p style="color: #cbd5e1; line-height: 1.6;">This is a test of your welcome email flow.</p>
        </div>
      </body>
      </html>
    `;

    // Now update to complete with message object to trigger welcome email
    await updateDoc(doc(db, "project_requests", welcomeDocRef.id), {
      status: "complete",
      message: {
        subject: "Welcome to Tovy - Project Request Received (Test Send)",
        html: welcomeHtml,
      },
      delivery: {
        state: "PENDING"
      }
    });
    console.log(`[✔] Welcome email trigger doc updated to complete! ID: ${welcomeDocRef.id}`);

    // --- 2. Test Abandonment Email ---
    console.log(`\n[+] Creating test document for Abandonment Email (target: ${targetEmail}, 3 hours old)...`);
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    
    const abandonmentDoc = await addDoc(collection(db, "project_requests"), {
      email: targetEmail,
      to: targetEmail,
      userEmail: targetEmail,
      firstName: "Test-Giel-Abandonment",
      lastName: "Nijkamp",
      company: "Tovy Test Abandonment",
      timeline: "Immediate (< 1 month)",
      budget: "€10k - €25k",
      status: "incomplete",
      timestamp: threeHoursAgo,
      last_updated: threeHoursAgo,
    });
    console.log(`[✔] Abandonment candidate doc created! ID: ${abandonmentDoc.id}`);
    
    console.log(`\n[✔] Both documents successfully written to Firestore.`);
    console.log(`[i] Welcome doc will be picked up immediately by the firebase-send-email extension.`);
    console.log(`[i] Abandonment doc will be picked up by checkAbandonmentEmails function next time it runs (every 15 min, or triggered manually).`);
    
    process.exit(0);
  } catch (error) {
    console.error("[ERROR] Failed to run test script:", error);
    process.exit(1);
  }
}

run();
