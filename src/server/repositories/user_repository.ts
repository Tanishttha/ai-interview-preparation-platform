import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export interface UserDTO {
  id: string;
  email: string;
  firebaseUid?: string | null;
  passwordHash?: string | null;
  name: string;
  role: string;
  photoURL?: string | null;
}

export class UserRepository {
  async findByEmail(email: string): Promise<UserDTO | null> {
    if (isPrismaActive && prisma) {
      return prisma.user.findUnique({ where: { email } }) as any;
    } else {
      const db = readDb();
      const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
      return user || null;
    }
  }

  async findById(id: string): Promise<UserDTO | null> {
    if (isPrismaActive && prisma) {
      return prisma.user.findUnique({ where: { id } }) as any;
    } else {
      const db = readDb();
      const user = db.users.find((u: any) => u.id === id);
      return user || null;
    }
  }

  async findByFirebaseUid(firebaseUid: string): Promise<UserDTO | null> {
    if (isPrismaActive && prisma) {
      return prisma.user.findUnique({ where: { firebaseUid } }) as any;
    } else {
      const db = readDb();
      const user = db.users.find((u: any) => u.firebaseUid === firebaseUid);
      return user || null;
    }
  }

  /**
   * Finds the local User row backing a given Firebase identity, creating it
   * on first sight (auto-provisioning) and backfilling firebaseUid if a user
   * with a matching email already exists (e.g. was seeded manually).
   */
  async findOrCreateByFirebaseIdentity(identity: {
    uid: string;
    email: string;
    name?: string | null;
    photoURL?: string | null;
  }): Promise<UserDTO> {
    const byUid = await this.findByFirebaseUid(identity.uid);
    if (byUid) return byUid;

    const byEmail = await this.findByEmail(identity.email);
    if (byEmail) {
      // Link this Firebase identity to the existing account
      if (isPrismaActive && prisma) {
        return prisma.user.update({
          where: { id: byEmail.id },
          data: { firebaseUid: identity.uid, photoURL: byEmail.photoURL || identity.photoURL || null }
        }) as any;
      } else {
        const db = readDb();
        const idx = db.users.findIndex((u: any) => u.id === byEmail.id);
        if (idx !== -1) {
          db.users[idx].firebaseUid = identity.uid;
          db.users[idx].photoURL = db.users[idx].photoURL || identity.photoURL || null;
          writeDb(db);
          return db.users[idx];
        }
        return byEmail;
      }
    }

    return this.create({
      email: identity.email,
      firebaseUid: identity.uid,
      name: identity.name || identity.email.split('@')[0],
      passwordHash: null,
      role: 'CANDIDATE',
      photoURL: identity.photoURL || null
    });
  }

  async create(user: Omit<UserDTO, 'id'>): Promise<UserDTO> {
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newUser = { ...user, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

    if (isPrismaActive && prisma) {
      return prisma.user.create({ data: user as any }) as any;
    } else {
      const db = readDb();
      db.users.push(newUser);
      writeDb(db);
      return newUser;
    }
  }

  async getProfile(userId: string) {
    if (isPrismaActive && prisma) {
      return prisma.profile.findUnique({ where: { userId } });
    } else {
      const db = readDb();
      db.profiles = db.profiles || [];
      let profile = db.profiles.find((p: any) => p.userId === userId);
      if (!profile) {
        profile = {
          id: `p_${Date.now()}`,
          userId,
          college: "Global University",
          graduationYear: 2026,
          bio: "Software engineering enthusiast",
          githubUrl: "",
          linkedinUrl: "",
          yearsOfExp: 0,
          targetRole: "Software Engineer",
          targetSalary: "",
          cgpa: 8.2,
          branch: "Computer Science",
          problemsSolved: 142,
          resumeScore: 89,
          targetCompany: "Google"
        };
        db.profiles.push(profile);
        writeDb(db);
      }
      return profile;
    }
  }

  async updateProfile(userId: string, data: any) {
    if (isPrismaActive && prisma) {
      return prisma.profile.upsert({
        where: { userId },
        update: data,
        create: { userId, ...data }
      });
    } else {
      const db = readDb();
      db.profiles = db.profiles || [];
      const idx = db.profiles.findIndex((p: any) => p.userId === userId);
      const updatedProfile = {
        id: idx !== -1 ? db.profiles[idx].id : `p_${Date.now()}`,
        userId,
        ...(idx !== -1 ? db.profiles[idx] : {}),
        ...data,
        updatedAt: new Date().toISOString()
      };
      if (idx !== -1) {
        db.profiles[idx] = updatedProfile;
      } else {
        db.profiles.push(updatedProfile);
      }
      writeDb(db);
      return updatedProfile;
    }
  }
}
