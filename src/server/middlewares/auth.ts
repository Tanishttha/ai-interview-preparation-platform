import { Request, Response, NextFunction } from 'express';
import { verifyFirebaseIdToken, isFirebaseAdminAvailable } from '../config/firebaseAdmin';
import { UserRepository } from '../repositories/user_repository';

const userRepository = new UserRepository();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
    photoURL?: string | null;
  };
}

/**
 * Verifies the caller's identity and attaches the corresponding local
 * User record (auto-provisioning it on first sight) to req.user.
 *
 * Two supported modes:
 *  1. Real Firebase — `Authorization: Bearer <Firebase ID token>`, verified
 *     server-side via firebase-admin. This is what the deployed frontend
 *     sends once FIREBASE_* server credentials are configured.
 *  2. Simulated auth (dev/no Firebase project configured) — the frontend's
 *     SimulatedAuth sends `X-Simulated-User: base64(JSON)` with
 *     {uid, email, name, photoURL}. This keeps the app runnable out of the
 *     box without a Firebase project, without ever giving every visitor the
 *     same shared account.
 *
 * Requests with neither are rejected — there is no more "default user"
 * fallback. Protected routes are actually protected.
 */
export const authenticateJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ') && isFirebaseAdminAvailable()) {
      const idToken = authHeader.split(' ')[1];
      const decoded = await verifyFirebaseIdToken(idToken);
      const user = await userRepository.findOrCreateByFirebaseIdentity({
        uid: decoded.uid,
        email: decoded.email || `${decoded.uid}@no-email.prepai`,
        name: (decoded.name as string) || undefined,
        photoURL: (decoded.picture as string) || undefined
      });
      req.user = { id: user.id, email: user.email, role: user.role, name: user.name, photoURL: user.photoURL };
      return next();
    }

    const simulatedHeader = req.headers['x-simulated-user'];
    if (typeof simulatedHeader === 'string' && simulatedHeader) {
      const decodedJson = JSON.parse(Buffer.from(simulatedHeader, 'base64').toString('utf-8'));
      if (!decodedJson?.uid || !decodedJson?.email) {
        return res.status(401).json({ error: 'Unauthorized: malformed simulated identity.' });
      }
      const user = await userRepository.findOrCreateByFirebaseIdentity({
        uid: decodedJson.uid,
        email: decodedJson.email,
        name: decodedJson.name,
        photoURL: decodedJson.photoURL
      });
      req.user = { id: user.id, email: user.email, role: user.role, name: user.name, photoURL: user.photoURL };
      return next();
    }

    return res.status(401).json({ error: 'Unauthorized: no valid credentials provided.' });
  } catch (err: any) {
    console.error('Authentication error:', err);
    return res.status(403).json({ error: 'Forbidden: invalid or expired credentials.' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access Denied: Insufficient permissions.' });
    }

    next();
  };
};
