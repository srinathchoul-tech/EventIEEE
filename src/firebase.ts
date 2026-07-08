import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Read environment variables loaded by Vite
const firebaseConfig = {
  apiKey: "AIzaSyDOrCEnpFjreCRhxYOOLESjUHEUoOgjWbs",
  authDomain: "eventieee-7d83f.firebaseapp.com",
  projectId: "eventieee-7d83f",
  storageBucket: "eventieee-7d83f.firebasestorage.app",
  messagingSenderId: "756622414456",
  appId: "1:756622414456:web:685cc0a98f9c3a3abcd38d",
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
