import { prisma } from '../config/db';

export class InterviewRepository {
  async createMockInterview(data: any) {
    return prisma.mockInterview.create({ data });
  }

  async getHistoryByUserId(userId: string) {
    return prisma.mockInterview.findMany({
      where: { userId },
      include: { transcripts: true },
      orderBy: { createdAt: 'desc' }
    });
  }
}
