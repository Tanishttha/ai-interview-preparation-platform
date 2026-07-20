import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export class InterviewRepository {
  async createMockInterview(data: any) {
    if (isPrismaActive && prisma) {
      return prisma.mockInterview.create({ data });
    } else {
      const db = readDb();
      db.mockInterviews = db.mockInterviews || [];
      const newInterview = {
        id: `int_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      db.mockInterviews.push(newInterview);
      db.xp = (db.xp || 0) + 150; // Give XP
      writeDb(db);
      return newInterview;
    }
  }

  async getHistoryByUserId(userId: string) {
    if (isPrismaActive && prisma) {
      return prisma.mockInterview.findMany({
        where: { userId },
        include: { transcripts: true },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      const db = readDb();
      db.mockInterviews = db.mockInterviews || [];
      return db.mockInterviews.filter((i: any) => i.userId === userId || !i.userId);
    }
  }
}
