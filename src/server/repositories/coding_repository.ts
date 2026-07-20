import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export class CodingRepository {
  async getAllQuestions(category?: string, difficulty?: string) {
    if (isPrismaActive && prisma) {
      return prisma.codingQuestion.findMany({
        where: {
          AND: [
            category ? { category } : {},
            difficulty ? { difficulty } : {}
          ]
        }
      });
    } else {
      const db = readDb();
      let list = db.codingQuestions || [];
      if (category) {
        list = list.filter((q: any) => q.category.toLowerCase() === category.toLowerCase());
      }
      if (difficulty) {
        list = list.filter((q: any) => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      }
      return list;
    }
  }

  async findQuestionById(id: string) {
    if (isPrismaActive && prisma) {
      return prisma.codingQuestion.findUnique({ where: { id } });
    } else {
      const db = readDb();
      return db.codingQuestions.find((q: any) => q.id === id) || null;
    }
  }

  async createSubmission(data: any) {
    if (isPrismaActive && prisma) {
      return prisma.submission.create({ data });
    } else {
      const db = readDb();
      db.submissions = db.submissions || [];
      const newSubmission = {
        id: `sub_${Date.now()}`,
        ...data,
        createdAt: new Date().toISOString()
      };
      db.submissions.push(newSubmission);
      // Automatically increment problems solved in db
      if (data.status === 'Accepted') {
        db.problemsSolved = (db.problemsSolved || 0) + 1;
        db.xp = (db.xp || 0) + 100;
      }
      writeDb(db);
      return newSubmission;
    }
  }

  async getSubmissionsByUserId(userId: string) {
    if (isPrismaActive && prisma) {
      return prisma.submission.findMany({
        where: { userId },
        include: { question: true }
      });
    } else {
      const db = readDb();
      db.submissions = db.submissions || [];
      return db.submissions.filter((s: any) => s.userId === userId);
    }
  }
}
