import {
  initializeApp
} from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup as fbSignInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged as fbOnAuthStateChanged,
  signInWithEmailAndPassword as fbSignInWithEmailAndPassword,
  createUserWithEmailAndPassword as fbCreateUserWithEmailAndPassword,
  updateProfile as fbUpdateProfile,
  browserLocalPersistence,
  setPersistence,
  sendPasswordResetEmail as fbSendPasswordResetEmail
} from "firebase/auth";

// Check if we have Firebase configuration in environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredEnv = {
  VITE_FIREBASE_API_KEY: firebaseConfig.apiKey,
  VITE_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  VITE_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  VITE_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  VITE_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  VITE_FIREBASE_APP_ID: firebaseConfig.appId,
};

console.group('[Firebase] Startup');
console.log('Firebase config:', firebaseConfig);
Object.entries(requiredEnv).forEach(([k,v])=>{
  if(!v) console.error(`[Firebase] Missing environment variable: ${k}`);
});

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.authDomain && 
  firebaseConfig.projectId
);

console.log('[Firebase] isFirebaseConfigured =', isFirebaseConfigured);

let app: any = null;
let auth: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    console.log('[Firebase] Initializing app...');
    app = initializeApp(firebaseConfig);
    console.log('[Firebase] App initialized', app);
    auth = getAuth(app);
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        console.log('[Firebase] Auth persistence set to LOCAL');
      })
      .catch((err) => {
        console.error('[Firebase] Failed to set persistence:', err);
      });
    console.log('[Firebase] Auth instance', auth);
    googleProvider = new GoogleAuthProvider();

    googleProvider.setCustomParameters({
      prompt: "select_account"
    });

    console.log('[Firebase] Google provider created', googleProvider);
    console.groupEnd();
  } catch (error) {
    console.error('[Firebase] Failed to initialize Firebase SDK:', error);
    console.groupEnd();
  }
}

// Unified interface for auth users in our frontend
export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  college?: string;
}

// Simulated Auth Engine for offline development and local environments
class SimulatedAuth {
  private listeners: ((user: AuthUser | null) => void)[] = [];
  private currentUser: AuthUser | null = null;

  constructor() {
    const saved = localStorage.getItem("prepai_simulated_user");
    if (saved) {
      try {
        this.currentUser = JSON.parse(saved);
      } catch (e) {
        this.currentUser = null;
      }
    }
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void) {
    this.listeners.push(callback);
    callback(this.currentUser);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.currentUser));
  }

  async signInWithGoogle() {
    console.count("Google login clicked");
    const simulatedUser: AuthUser = {
      uid: "google-simulated-user",
      displayName: "Google Candidate",
      email: "google-candidate@example.com",
      photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      college: "NSUT Delhi"
    };
    this.currentUser = simulatedUser;
    localStorage.setItem("prepai_simulated_user", JSON.stringify(simulatedUser));
    this.notify();
    return { user: simulatedUser };
  }

  async signInWithEmail(email: string) {
    const name = email.split('@')[0];
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    const simulatedUser: AuthUser = {
      uid: `email-simulated-${Date.now()}`,
      displayName: capitalized,
      email: email,
      photoURL: null,
      college: "Global University"
    };
    this.currentUser = simulatedUser;
    localStorage.setItem("prepai_simulated_user", JSON.stringify(simulatedUser));
    this.notify();
    return { user: simulatedUser };
  }

  async signUpWithEmail(name: string, email: string) {
    const simulatedUser: AuthUser = {
      uid: `email-simulated-${Date.now()}`,
      displayName: name,
      email: email,
      photoURL: null,
      college: "Global University"
    };
    this.currentUser = simulatedUser;
    localStorage.setItem("prepai_simulated_user", JSON.stringify(simulatedUser));
    this.notify();
    return { user: simulatedUser };
  }

  async signOut() {
    this.currentUser = null;
    localStorage.removeItem("prepai_simulated_user");
    this.notify();
  }
}

const simulatedAuthInstance = new SimulatedAuth();

// Unified signInWithGoogle
export const signInWithGoogle = async (): Promise<{ user: AuthUser }> => {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      console.count("Google login clicked");
      console.log('[Google Sign-In] Started');
      console.log('[Google Sign-In] Auth:', auth);
      console.log('[Google Sign-In] Provider:', googleProvider);
      console.count("signInWithPopup called");
      console.log("[Google Sign-In] About to open popup...");
      const result = await fbSignInWithPopup(auth, googleProvider);
      console.log("[Google Sign-In] Popup resolved successfully");
      console.log('[Google Sign-In] Sign-in success', result);
      const user = result.user;
      console.log('[Google Sign-In] Obtained user:', user);
      const idToken = await user.getIdToken();
      console.log('[Google Sign-In] Got ID token');
      const apiUrl = import.meta.env.VITE_API_URL || '';
      console.log('[Google Sign-In] Sending ID token to backend:', apiUrl + '/api/auth/google');
      const response = await fetch(`${apiUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ idToken })
      });
      console.log('[Google Sign-In] Backend response status:', response.status);
      let parsedResponse: any;
      try {
        parsedResponse = await response.clone().json();
      } catch {
        parsedResponse = await response.text();
      }
      console.log('[Google Sign-In] Backend response body:', parsedResponse);
      if (!response.ok) {
        throw new Error(`[Google Sign-In] Backend rejected Google sign-in. Status: ${response.status}`);
      }
      return {
        user: {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          college: "Global University"
        }
      };
    } catch (error: any) {
      if (error && typeof error === 'object' && error.code) {
        if (error.code === 'auth/popup-blocked') {
          console.error('[Google Sign-In] Popup was blocked by the browser. Please allow popups for this site.');
        } else if (error.code === 'auth/popup-closed-by-user') {
          console.error('[Google Sign-In] Popup was closed by the user before completing sign-in.');
        } else if (error.code === 'auth/cancelled-popup-request') {
          console.error('[Google Sign-In] Cancelled popup request: another popup is already open.');
        }
      }
      console.warn('[Google Sign-In] Make sure Firebase Authentication > Sign-in method > Google is enabled, and Authentication > Settings > Authorized domains includes localhost and your current domain.');
      console.error('[Google Sign-In] Error during sign-in:', error);
      throw error;
    }
  } else {
    console.error('[Firebase] Firebase is not configured. Google Sign-In cannot start. Fix missing VITE_FIREBASE_* variables instead of using simulated auth.');
    throw new Error('Firebase is not configured.');
  }
};

// Unified signInWithEmail
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
  } else {
    return await simulatedAuthInstance.signInWithEmail(email);
  }
};

// Unified signUpWithEmail
export const signUpWithEmail = async (name: string, email: string, password: string): Promise<{ user: AuthUser }> => {
  if (isFirebaseConfigured && auth) {
    const result = await fbCreateUserWithEmailAndPassword(auth, email, password);
    if (result.user) {
      try {
        await fbUpdateProfile(result.user, { displayName: name });
      } catch (err) {
        console.warn("Failed to update profile display name:", err);
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
  } else {
    return await simulatedAuthInstance.signUpWithEmail(name, email);
  }
};

// Unified signOutUser
export const signOutUser = async (): Promise<void> => {
  if (isFirebaseConfigured && auth) {
    await fbSignOut(auth);
  } else {
    await simulatedAuthInstance.signOut();
  }
};

// Unified password reset. Real email via Firebase when configured; in
// simulated mode there's no real email system to send from, so we say so
// explicitly rather than pretending an email went out.
export const sendPasswordReset = async (email: string): Promise<{ simulated: boolean }> => {
  if (isFirebaseConfigured && auth) {
    await fbSendPasswordResetEmail(auth, email);
    return { simulated: false };
  }
  return { simulated: true };
};

// Unified onAuthChanged
export const onAuthChanged = (callback: (user: AuthUser | null) => void) => {
  if (isFirebaseConfigured && auth) {
    return fbOnAuthStateChanged(auth, (fbUser) => {
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
  } else {
    return simulatedAuthInstance.onAuthStateChanged(callback);
  }
};

// Produces the header(s) the backend needs to identify the caller.
// - Real Firebase: a verifiable ID token as a Bearer token.
// - Simulated mode: the user's identity, base64-encoded, trusted only when
//   the backend has no real Firebase Admin credentials configured either.
// Returns {} when signed out — callers hitting protected routes will then
// correctly get a 401 from the backend instead of silently impersonating
// someone else.
export const getAuthHeader = async (): Promise<Record<string, string>> => {
  if (isFirebaseConfigured && auth?.currentUser) {
    const idToken = await auth.currentUser.getIdToken();
    return { Authorization: `Bearer ${idToken}` };
  }

  const saved = localStorage.getItem("prepai_simulated_user");
  if (saved) {
    try {
      const encoded = btoa(unescape(encodeURIComponent(saved)));
      return { "X-Simulated-User": encoded };
    } catch {
      return {};
    }
  }

  return {};
};
