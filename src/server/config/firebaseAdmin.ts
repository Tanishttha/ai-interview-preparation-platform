import admin from 'firebase-admin';

let initialized = false;
let available = false;

/**
 * Firebase Admin needs service account credentials to verify ID tokens.
 * Supports either:
 *  - FIREBASE_SERVICE_ACCOUNT: full JSON blob (as a single-line env var), or
 *  - FIREBASE_PROJECT_ID / FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY separately.
 * If none are present, `available` stays false and callers should fall back
 * to the simulated-auth dev path (see middlewares/auth.ts).
 */
function init() {
  if (initialized) return;
  initialized = true;

  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
      available = true;
    } else if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // .env files can't hold literal newlines — they're passed as \n
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        })
      });
      available = true;
    } else {
      console.log(
        'ℹ️  No Firebase Admin credentials configured — falling back to simulated-auth verification for local development.'
      );
    }
  } catch (err) {
    console.error('Failed to initialize Firebase Admin SDK:', err);
    available = false;
  }
}

export function isFirebaseAdminAvailable(): boolean {
  init();
  return available;
}

export async function verifyFirebaseIdToken(idToken: string) {
  init();
  if (!available) throw new Error('Firebase Admin is not configured on this server.');
  return admin.auth().verifyIdToken(idToken);
}
