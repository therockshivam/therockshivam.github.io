// Firebase Web SDK Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-storage.js";
import { initializeAppCheck, ReCaptchaV3Provider } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app-check.js";

/**
 * Firebase Configuration Object
 * Replace placeholder values with your actual Firebase Web App credentials from the Firebase Console.
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCxee1JBU3JaOy958EfGd0Z04fsNlInvlk",
  authDomain: "therockshivam-26b1b.firebaseapp.com",
  projectId: "therockshivam-26b1b",
  storageBucket: "therockshivam-26b1b.firebasestorage.app",
  messagingSenderId: "457478128845",
  appId: "1:457478128845:web:bff4fc8c930721a3de5584",
  // measurementId: "G-BGK56GQTJP"
};

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth, Firestore, and Storage
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Initialize App Check (Defensive fallback if site key configured)
export let appCheck = null;
if (window.RECAPTCHA_SITE_KEY) {
  try {
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(window.RECAPTCHA_SITE_KEY),
      isTokenAutoRefreshEnabled: true
    });
    console.log("Firebase App Check initialized.");
  } catch (err) {
    console.warn("App Check initialization skipped/failed:", err);
  }
}
