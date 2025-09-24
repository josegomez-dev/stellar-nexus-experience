/**
 * Browser Console Firebase Data Cleanup Script
 * 
 * Copy and paste this script into your browser console while on the app
 * to clear all Firebase data for fresh testing.
 */

(async function clearFirebaseData() {
  console.log('🚀 Starting Firebase data cleanup...');
  
  // Import Firebase functions (assuming they're available in the app)
  const { getFirestore, collection, getDocs, deleteDoc, doc, writeBatch } = window.firebase || {};
  
  if (!getFirestore) {
    console.error('❌ Firebase functions not available. Make sure you\'re on the app page.');
    return;
  }

  const db = getFirestore();
  
  const collections = [
    'users',
    'demo_progress', 
    'badges',
    'user_badges',
    'transactions',
    'leaderboard',
    'demo_stats',
    'demo_claps',
    'demo_feedback'
  ];

  let totalDeleted = 0;

  for (const collectionName of collections) {
    try {
      console.log(`🗑️  Clearing collection: ${collectionName}`);
      
      const collectionRef = collection(db, collectionName);
      const snapshot = await getDocs(collectionRef);
      
      if (snapshot.empty) {
        console.log(`   ✅ Collection ${collectionName} is already empty`);
        continue;
      }

      const batch = writeBatch(db);
      let deletedCount = 0;

      snapshot.forEach((docSnapshot) => {
        batch.delete(doc(db, collectionName, docSnapshot.id));
        deletedCount++;
      });

      await batch.commit();
      console.log(`   ✅ Deleted ${deletedCount} documents from ${collectionName}`);
      totalDeleted += deletedCount;
      
    } catch (error) {
      console.error(`   ❌ Error clearing ${collectionName}:`, error.message);
    }
  }

  console.log(`\n🎉 Firebase cleanup completed!`);
  console.log(`📊 Total documents deleted: ${totalDeleted}`);
  console.log(`\n✨ Your Firebase database is now clean and ready for fresh testing!`);
  
  // Refresh the page to see the clean state
  console.log(`\n🔄 Refreshing page to show clean state...`);
  setTimeout(() => window.location.reload(), 2000);
})();
