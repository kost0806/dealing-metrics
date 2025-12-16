import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase only on client side
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// Only initialize Firebase in the browser
if (typeof window !== 'undefined') {
  // Validate configuration
  const hasAllEnvVars = Object.values(firebaseConfig).every(value => value);

  if (!hasAllEnvVars) {
    console.error('Missing Firebase environment variables');
    console.error('Please check your .env.local file');
  } else {
    // Initialize Firebase only once
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);

    // Log configuration status (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Firebase initialized successfully');
      console.log('Project ID:', firebaseConfig.projectId);
    }
  }
}

export { auth, db };
