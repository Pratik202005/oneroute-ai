import admin from 'firebase-admin';

// Initialize Firebase Admin with Application Default Credentials
// For Cloud Run, this automatically picks up the service account.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    projectId: 'oneroute-ai'
  });
}

const db = admin.firestore();

export { admin, db };
