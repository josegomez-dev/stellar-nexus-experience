import { db } from './firebase';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';
import { COLLECTIONS } from './firebase-types';

export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');

    // Test 1: Try to read from a collection
    const testCollection = collection(db, COLLECTIONS.DEMO_FEEDBACK);
    const snapshot = await getDocs(testCollection);
    console.log('✅ Firebase read test passed. Documents found:', snapshot.size);

    // Test 2: Try to write a test document
    const testDoc = {
      demoId: 'test-demo',
      demoName: 'Test Demo',
      userId: 'test-user',
      rating: 5,
      feedback: 'Test feedback from Firebase connection test',
      completionTime: 1,
      difficulty: 'easy' as const,
      wouldRecommend: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(testCollection, testDoc);
    console.log('✅ Firebase write test passed. Document ID:', docRef.id);

    return {
      success: true,
      readTest: true,
      writeTest: true,
      documentsFound: snapshot.size,
      testDocId: docRef.id,
    };
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const testFeedbackSubmission = async (testFeedback: any) => {
  try {
    console.log('🧪 Testing feedback submission...', testFeedback);

    const feedbackRef = await addDoc(collection(db, COLLECTIONS.DEMO_FEEDBACK), {
      ...testFeedback,
      createdAt: serverTimestamp(),
    });

    console.log('✅ Feedback submission test passed. Document ID:', feedbackRef.id);
    return { success: true, docId: feedbackRef.id };
  } catch (error) {
    console.error('❌ Feedback submission test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
