const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// In production, use service account file or environment variables
try {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
    // If using a service account file:
    // credential: admin.credential.cert(require('path/to/serviceAccountKey.json'))
  });
  
  console.log('Firebase Admin SDK initialized successfully');
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };
