import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const welcomeId = "tw1t1z03JeGLOsHye58i";
    const abandonmentId = "OvCD6OjkvA0rTxzVxDhQ";

    console.log("=== VERIFYING WELCOME EMAIL FLOW ===");
    const welcomeSnap = await getDoc(doc(db, "project_requests", welcomeId));
    if (welcomeSnap.exists()) {
      const data = welcomeSnap.data();
      console.log(`Original Doc ID: ${welcomeId}`);
      console.log(`Status: ${data.status}`);
      console.log(`Delivery Info:`, data.delivery);
    } else {
      console.log(`Welcome doc ${welcomeId} not found.`);
    }

    console.log("\n=== VERIFYING ABANDONMENT EMAIL FLOW ===");
    const abandonmentSnap = await getDoc(doc(db, "project_requests", abandonmentId));
    if (abandonmentSnap.exists()) {
      const data = abandonmentSnap.data();
      console.log(`Original Doc ID: ${abandonmentId}`);
      console.log(`Status: ${data.status}`);
      console.log(`Abandonment Sent Flag: ${data.abandonment_sent}`);
      console.log(`Last Updated:`, data.last_updated?.toDate());
      
      const mailDocId = `${abandonmentId}_abandonment`;
      const mailSnap = await getDoc(doc(db, "project_requests", mailDocId));
      if (mailSnap.exists()) {
        const mailData = mailSnap.data();
        console.log(`Mail Doc ID: ${mailDocId}`);
        console.log(`To: ${mailData.to}`);
        console.log(`Subject: ${mailData.message?.subject}`);
        console.log(`Delivery Info:`, mailData.delivery);
      } else {
        console.log(`Mail dispatch doc ${mailDocId} not found. (The scheduled function may not have processed it or skipped it.)`);
      }
    } else {
      console.log(`Abandonment doc ${abandonmentId} not found.`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Verification failed:", error);
    process.exit(1);
  }
}

run();
