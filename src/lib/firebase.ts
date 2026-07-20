import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  browserLocalPersistence,
  browserPopupRedirectResolver,
  setPersistence,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  signInWithPopup as fbSignInWithPopup
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId
);

let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    console.log('[Firebase] App initialized:', firebaseConfig.projectId, 'authDomain:', firebaseConfig.authDomain);

    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    setPersistence(auth, browserLocalPersistence)
      .then(() => console.log('[Firebase] Persistence set to local'))
      .catch((err) => console.error('[Firebase] Persistence error:', err));
  } catch (error) {
    console.error('[Firebase] Init error:', error);
  }
}

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  college?: string;
}

// Google Popup Sign-In
// Firebase to persist a "pending redirect" record across a full page reload.
// Safari's ITP and Chrome's storage partitioning both isolate that storage on
// dev origins, so the credential comes back from Google but Firebase can't
// correlate it with the pending operation — no error is thrown, it's just
// surviving a navigation/reload, and is unaffected by that partitioning.
//
// fire synchronously within the click handler's call stack to be trusted as
// a real user gesture. We used to `await setPersistence(...)` right before
// this call — that await broke the gesture chain, so Safari/Chrome treated
// the popup as untrusted and Firebase reported a false
// "auth/popup-closed-by-user" almost instantly, even though nothing was
// actually closed by the user. Persistence is already set once at module
// load above, so we don't need (and must not add) any await before this call.
export const signInWithGoogle = async (): Promise<{ user: AuthUser }> => {
  if (isFirebaseConfigured && auth && googleProvider) {
    console.log('[Google Sign-In] Opening popup sign-in...');

    const result = await fbSignInWithPopup(
      auth,
      googleProvider,
      browserPopupRedirectResolver
    );
    console.log('[Google Sign-In] Popup success:', result.user.email);

    return {
      user: {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        college: "Global University"
      }
    };
  } else {
    throw new Error('Firebase is not configured.');
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<{ user: AuthUser }> => {
  if (isFirebaseConfigured && auth) {
    const result = await fbSignInWithEmailAndPassword(auth, email, password);
    return {
      user: {
        uid: result.user.uid,
        displayName: result.user.displayName,
        email: result.user.email,
        photoURL: result.user.photoURL,
        college: "Global University"
      }
    };
  }
  throw new Error('Firebase not configured.');
};

export const signUpWithEmail = async (name: string, email: string, password: string): Promise<{ user: AuthUser }> => {
  if (isFirebaseConfigured && auth) {
    const result = await fbCreateUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      try {
        await fbUpdateProfile(result.user, { displayName: name });
      } catch (err) {
        console.warn("Failed to update display name:", err);
      }
    }
    return {
      user: {
        uid: result.user.uid,
        displayName: name,
        email: result.user.email,
        photoURL: null,
        college: "Global University"
      }
    };
  }
  throw new Error('Firebase not configured.');
};

export const signOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  }
};

export const sendPasswordReset = async (email: string): Promise<{ simulated: boolean }> => {
  if (isFirebaseConfigured && auth) {
    await fbSendPasswordResetEmail(auth, email);
    return { simulated: false };
  }
  return { simulated: true };
};

export const onAuthChanged = (callback: (user: AuthUser | null) => void) => {
  if (isFirebaseConfigured && auth) {
    return fbOnAuthStateChanged(auth, (fbUser) => {
      console.log("[Firebase Auth State]", fbUser);
      if (fbUser) {
        callback({
          uid: fbUser.uid,
          displayName: fbUser.displayName,
          email: fbUser.email,
          photoURL: fbUser.photoURL,
          college: "Global University"
        });
      } else {
        callback(null);
      }
    });
  }
  return () => {};
};

export const getAuthHeader = async (): Promise<Record<string, string>> => {
  if (isFirebaseConfigured && auth?.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${idToken}` };
  }
  return {};
};