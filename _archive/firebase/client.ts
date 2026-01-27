import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';

// Firebase Client SDK configuration
// Used for client-side operations

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;

function getFirebaseClient() {
  if (typeof window === 'undefined') {
    // Don't initialize on server
    throw new Error('Firebase client SDK should only be used on the client side');
  }

  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  if (!db) {
    db = getFirestore(app);
  }

  if (!auth) {
    auth = getAuth(app);
  }

  return { app, db, auth };
}

// Export getters for lazy initialization
export const getClientApp = () => getFirebaseClient().app;
export const getClientDb = () => getFirebaseClient().db;
export const getClientAuth = () => getFirebaseClient().auth;
