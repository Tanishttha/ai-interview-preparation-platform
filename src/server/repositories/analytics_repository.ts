import { prisma } from '../config/db';

export class AnalyticsRepository {
  async getProgressByUserId(userId: string) {
    return prisma.analyticsProgress.findMany({
      where: { userId },
      orderBy: { date: 'asc' }
    });
  }

  async getLeaderboard() {
    return prisma.leaderboardEntry.findMany({
      orderBy: { rank: 'asc' }
    });
  }
}
