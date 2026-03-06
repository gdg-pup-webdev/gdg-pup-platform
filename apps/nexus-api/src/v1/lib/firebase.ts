import {
  initializeApp,
  getApps,
  cert,
  ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// const FIREBASE_STORAGE_BUCKET = process.env.FIREBASE_STORAGE_BUCKET;
const serviceAccount = {
  project_id: process.env.FIREBASE_PROJECT_ID, // must be project_id
  client_email: process.env.FIREBASE_CLIENT_EMAIL, // must be client_email
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // must be private_key
};

const app = getApps().length
  ? getApps()[0]
  : initializeApp({
      credential: cert(serviceAccount as string | ServiceAccount),
      // storageBucket: FIREBASE_STORAGE_BUCKET,
    });

export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app).bucket(FIREBASE_STORAGE_BUCKET);
