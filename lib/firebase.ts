// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCVq9jAmW912-4SClPuip6bbPy5fnWE7no",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "nexus-55966.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "nexus-55966",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "nexus-55966.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "48419163339",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:48419163339:web:637eadbce2dadb24605f4e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-80T26CG9PM"
};

// Initialize Firebase
console.log('🔥 Initializing Firebase...');
console.log('Firebase config:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  hasApiKey: !!firebaseConfig.apiKey
});

const app = initializeApp(firebaseConfig);
console.log('✅ Firebase app initialized');

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
console.log('✅ Firestore and Auth initialized');

// Initialize Analytics (only in browser and if supported)
let analytics: any = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };

// Connect to emulators in development (only if explicitly enabled)
if (process.env.NODE_ENV === 'development' && 
    process.env.FIREBASE_USE_EMULATOR === 'true' && 
    typeof window !== 'undefined') {
  // Only connect to emulators if not already connected
  try {
    console.log('🔧 Connecting to Firebase emulators...');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
    console.log('✅ Connected to Firebase emulators');
  } catch (error) {
    // Emulators already connected or not available
    console.log('⚠️ Firebase emulators not available or already connected:', error);
  }
}

export default app;
