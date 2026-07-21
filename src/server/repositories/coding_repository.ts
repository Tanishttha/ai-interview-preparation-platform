import { prisma } from '../config/db';

export class CodingRepository {
  async getAllQuestions(category?: string, difficulty?: string) {
    return prisma.codingQuestion.findMany({
      where: {
        AND: [
          category ? { category } : {},
          difficulty ? { difficulty } : {}
        ]
      }
    });
  }

  async findQuestionById(id: string) {
    return prisma.codingQuestion.findUnique({ where: { id } });
  }

  async createSubmission(data: any) {
    return prisma.submission.create({
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
  }

  async updateProblemProgress(userId: string, problemId: string, accepted: boolean) {
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

    throw new Error('Problem progress model is not configured in Prisma schema.');
  }

  async getSubmissionsByUserId(userId: string) {
    return prisma.submission.findMany({
      where: { userId },
      include: { question: true }
    });
  }
}
