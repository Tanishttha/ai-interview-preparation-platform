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
      try {
        const prismaClient = prisma as any;
        return await prismaClient.submission.create({
          data: {
            userId: data.userId,
            questionId: data.problemId || data.questionId,
            code: data.sourceCode || data.code,
            language: data.language,
            status: data.verdict || data.status,
            runtime: typeof data.runtime === 'number' ? data.runtime : undefined,
            memory: typeof data.memory === 'number' ? data.memory : undefined,
            feedback: data.feedback,
            createdAt: data.submittedAt ? new Date(data.submittedAt) : undefined
          }
        });
      } catch (error) {
        console.warn('Prisma submission write failed, falling back to local storage.', error);
      }
    }

    const db = readDb();
    db.submissions = db.submissions || [];
    const newSubmission = {
      id: `sub_${Date.now()}`,
      userId: data.userId,
      problemId: data.problemId || data.questionId,
      language: data.language,
      sourceCode: data.sourceCode || data.code,
      verdict: data.verdict || data.status,
      runtime: data.runtime,
      memory: data.memory,
      passedTests: data.passedTests,
      totalTests: data.totalTests,
      submittedAt: data.submittedAt || new Date().toISOString(),
      feedback: data.feedback,
      createdAt: new Date().toISOString()
    };
    db.submissions.push(newSubmission);
    writeDb(db);
    return newSubmission;
  }

  async updateProblemProgress(userId: string, problemId: string, accepted: boolean) {
    if (isPrismaActive && prisma) {
      try {
        const prismaClient = prisma as any;
        if (prismaClient.problemProgress) {
          const existing = await prismaClient.problemProgress.findUnique({ where: { userId } }).catch(() => null);
          return await prismaClient.problemProgress.upsert({
            where: { userId },
            update: {
              solvedProblems: accepted ? { increment: 1 } : undefined,
              lastSolvedAt: accepted ? new Date() : undefined,
              updatedAt: new Date()
            },
            create: {
              userId,
              solvedProblems: accepted ? 1 : 0,
              totalProblems: 0,
              lastSolvedAt: accepted ? new Date() : null
            }
          });
        }

        if (prismaClient.analyticsProgress) {
          const record = await prismaClient.analyticsProgress.create({
            data: {
              userId,
              xpGained: accepted ? 100 : 0,
              problemsSolved: accepted ? 1 : 0,
              interviewsDone: 0,
              studyMinutes: 0,
              weakAreas: [],
              strongAreas: []
            }
          });
          return record;
        }
      } catch (error) {
        console.warn('Prisma progress update failed, falling back to local storage.', error);
      }
    }

    const db = readDb();
    db.problemProgress = db.problemProgress || {};
    const progress = db.problemProgress[userId] || {
      userId,
      problemIds: [],
      solvedProblems: 0,
      totalProblems: 0,
      lastSolvedAt: null
    };
    if (!progress.problemIds.includes(problemId)) {
      progress.problemIds.push(problemId);
    }
    progress.totalProblems = Math.max(progress.totalProblems, progress.problemIds.length);
    if (accepted) {
      progress.solvedProblems = Math.max(progress.solvedProblems, progress.problemIds.length);
      progress.lastSolvedAt = new Date().toISOString();
      db.problemsSolved = (db.problemsSolved || 0) + 1;
      db.xp = (db.xp || 0) + 100;
    }
    db.problemProgress[userId] = progress;
    writeDb(db);
    return progress;
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
