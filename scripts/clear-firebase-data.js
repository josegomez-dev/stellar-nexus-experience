#!/usr/bin/env node

/**
 * Firebase Data Cleanup Script
 *
 * This script clears all Firebase collections for fresh testing.
 * Run with: node scripts/clear-firebase-data.js
 */

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  writeBatch,
} = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCVq9jAmW912-4SClPuip6bbPy5fnWE7no',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'nexus-55966.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'nexus-55966',
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'nexus-55966.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '48419163339',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:48419163339:web:637eadbce2dadb24605f4e',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || 'G-80T26CG9PM',
};

// Collections to clear
const COLLECTIONS = {
  USERS: 'users',
  DEMO_PROGRESS: 'demo_progress',
  BADGES: 'badges',
  USER_BADGES: 'user_badges',
  TRANSACTIONS: 'transactions',
  LEADERBOARD: 'leaderboard',
  DEMO_STATS: 'demo_stats',
  DEMO_CLAPS: 'demo_claps',
  DEMO_FEEDBACK: 'demo_feedback',
};

async function clearCollection(db, collectionName) {
  console.log(`🗑️  Clearing collection: ${collectionName}`);

  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      console.log(`   ✅ Collection ${collectionName} is already empty`);
      return 0;
    }

    const batch = writeBatch(db);
    let deletedCount = 0;

    snapshot.forEach(docSnapshot => {
      batch.delete(doc(db, collectionName, docSnapshot.id));
      deletedCount++;
    });

    await batch.commit();
    console.log(`   ✅ Deleted ${deletedCount} documents from ${collectionName}`);
    return deletedCount;
  } catch (error) {
    console.error(`   ❌ Error clearing ${collectionName}:`, error.message);
    return 0;
  }
}

async function clearAllFirebaseData() {
  console.log('🚀 Starting Firebase data cleanup...\n');

  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let totalDeleted = 0;

    // Clear all collections
    for (const [key, collectionName] of Object.entries(COLLECTIONS)) {
      const deletedCount = await clearCollection(db, collectionName);
      totalDeleted += deletedCount;
    }

    console.log(`\n🎉 Firebase cleanup completed!`);
    console.log(`📊 Total documents deleted: ${totalDeleted}`);
    console.log(`\n✨ Your Firebase database is now clean and ready for fresh testing!`);
  } catch (error) {
    console.error('❌ Error during Firebase cleanup:', error);
    process.exit(1);
  }
}

// Run the cleanup
if (require.main === module) {
  clearAllFirebaseData()
    .then(() => {
      console.log('\n🔚 Script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { clearAllFirebaseData, clearCollection };
