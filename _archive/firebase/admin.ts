import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

// Firebase Admin SDK for server-side operations
// This uses a service account key for authentication

let app: App;
let db: Firestore;
let auth: Auth;

function getFirebaseAdmin() {
  if (getApps().length === 0) {
    // Parse the service account from environment variable
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

    if (!serviceAccountJson) {
      throw new Error(
        'FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. ' +
        'Please download your service account key from Firebase Console and set it as an environment variable.'
      );
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch {
      throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Ensure it is valid JSON.');
    }

    app = initializeApp({
      credential: cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
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

// Export initialized instances
export const firebaseAdmin = getFirebaseAdmin;
export const adminDb = () => getFirebaseAdmin().db;
export const adminAuth = () => getFirebaseAdmin().auth;

// Collection names (centralized for consistency)
export const COLLECTIONS = {
  USERS: 'users',
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  TAGS: 'tags',
  ORDERS: 'orders',
  ORDER_ITEMS: 'orderItems',
  CARTS: 'carts',
  CART_ITEMS: 'cartItems',
  REVIEWS: 'reviews',
  WISHLISTS: 'wishlists',
  ADDRESSES: 'addresses',
  DISCOUNT_CODES: 'discountCodes',
  NEWSLETTER_SUBSCRIBERS: 'newsletterSubscribers',
  CONTACT_SUBMISSIONS: 'contactSubmissions',
} as const;

// Type helpers
export type CollectionName = typeof COLLECTIONS[keyof typeof COLLECTIONS];
