import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Read environment variables loaded by Vite
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if all essential keys are provided
const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.trim() !== "" &&
  firebaseConfig.projectId && 
  firebaseConfig.projectId.trim() !== "" &&
  firebaseConfig.appId && 
  firebaseConfig.appId.trim() !== "";

let app;
let db: any = null;
let auth: any = null;
let isFirebaseEnabled = false;

if (isConfigValid) {
  try {
    // Prevent double initialization
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    db = getFirestore(app);
    auth = getAuth(app);
    isFirebaseEnabled = true;
    console.log("🔥 Firebase initialized successfully in live-connect mode.");
  } catch (error) {
    console.error("❌ Failed to initialize Firebase SDK:", error);
  }
} else {
  console.warn(
    "⚠️ Firebase configuration keys are empty. The application is running in " +
    "local fallback mode (storing registrations locally in the browser)."
  );
}

export { db, auth, isFirebaseEnabled };
