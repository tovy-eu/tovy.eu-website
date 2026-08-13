// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  // measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp;
let db: Firestore;

// Initialize Firebase with safety checks for missing config
try {
  if (!getApps().length) {
    if (!firebaseConfig.projectId) {
      console.warn("Firebase Project ID is missing. Firebase features may not work correctly.");
      app = initializeApp({ ...firebaseConfig, projectId: "placeholder-id" });
    } else {
      app = initializeApp(firebaseConfig);
    }
  } else {
    app = getApp();
  }

  // Initialize Firestore first (the only export actually used by the app), and
  // with ignoreUndefinedProperties so writes don't throw when an optional form
  // field is undefined. Fall back to getFirestore if it was already initialized.
  try {
    db = initializeFirestore(app, { ignoreUndefinedProperties: true });
  } catch {
    db = getFirestore(app);
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { app, db };
