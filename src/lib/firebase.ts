// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// import { getAnalytics, logEvent as logAnalyticsEvent, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// Initialize Analytics and export logEvent function
// let analytics: any;

// if (typeof window !== 'undefined') {
//     isSupported().then((supported) => {
//         if (supported) {
//             analytics = getAnalytics(app);
//         }
//     });
// }

export const logEvent = (eventName: string, eventParams?: { [key: string]: any }) => {
    // if (analytics) {
    //     logAnalyticsEvent(analytics, eventName, eventParams);
    // }
    console.log(`[Analytics Disabled] Event: ${eventName}`, eventParams);
};

export { app, db };
