import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services - Using initializeFirestore with long polling and disabling fetch streams for better connection stability
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
} as any, firebaseConfig.firestoreDatabaseId); 
export const auth = getAuth(app);
export const storage = getStorage(app);

// Connectivity check as required by Firebase integration guidelines
// Runs in background to avoid blocking the main thread
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'connection-test'));
    console.log("Firebase connection established successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. Client is offline.");
    }
  }
}

testConnection();
