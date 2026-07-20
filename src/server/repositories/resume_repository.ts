import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export class ResumeRepository {
  async save(data: any) {
    if (isPrismaActive && prisma) {
      return prisma.resume.create({ data });
    } else {
      const db = readDb();
      db.resumes = db.resumes || [];
      const newResume = {
        id: `res_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      db.resumes.push(newResume);
      writeDb(db);
      return newResume;
    }
  }

  async getLatestByUserId(userId: string) {
    if (isPrismaActive && prisma) {
      return prisma.resume.findFirst({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      const db = readDb();
      db.resumes = db.resumes || [];
      const userResumes = db.resumes.filter((r: any) => r.userId === userId);
      if (userResumes.length === 0) return null;
      return userResumes[userResumes.length - 1];
    }
  }

  async getProfile(userId: string) {
    if (isPrismaActive && prisma) {
      try {
        return await (prisma as any).resumeProfile.findUnique({ where: { userId } });
      } catch (e) {
        // Fallback if table doesn't exist
      }
    }
    const db = readDb();
    db.resumeProfiles = db.resumeProfiles || [];
    let profile = db.resumeProfiles.find((rp: any) => rp.userId === userId);
    if (!profile) {
      profile = {
        userId,
        name: 'Mehak Sharma',
        title: 'SDE Candidate',
        email: 'mehak@example.com',
        skills: 'React, Node.js, TypeScript, SQL, Docker, Redis',
        bullets: [
          'Implemented full-text search index filters.',
          'Refactored API controllers to improve database response speeds.'
        ]
      };
      db.resumeProfiles.push(profile);
      writeDb(db);
    }
    return profile;
  }

  async saveProfile(userId: string, data: any) {
    if (isPrismaActive && prisma) {
      try {
        return await (prisma as any).resumeProfile.upsert({
          where: { userId },
          update: data,
          create: { userId, ...data }
        });
      } catch (e) {
        // Fallback if table doesn't exist
      }
    }
    const db = readDb();
    db.resumeProfiles = db.resumeProfiles || [];
    const idx = db.resumeProfiles.findIndex((rp: any) => rp.userId === userId);
    const updated = {
      userId,
      ...data,
      updatedAt: new Date().toISOString()
    };
    if (idx !== -1) {
      db.resumeProfiles[idx] = { ...db.resumeProfiles[idx], ...updated };
    } else {
      db.resumeProfiles.push(updated);
    }
    writeDb(db);
    return updated;
  }
}
