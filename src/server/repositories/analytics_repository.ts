import { prisma, isPrismaActive, readDb, writeDb } from '../config/db';

export class AnalyticsRepository {
  async getProgressByUserId(userId: string) {
    if (isPrismaActive && prisma) {
      return prisma.analyticsProgress.findMany({
        where: { userId },
        orderBy: { date: 'asc' }
      });
    } else {
      const db = readDb();
      return {
        xp: db.xp || 2150,
        problemsSolved: db.problemsSolved || 142,
        interviewsCount: (db.mockInterviews || []).length || 3,
        weakAreas: ["Dynamic Programming", "System Design (Scaling)"],
        strongAreas: ["Hash Tables", "String Manipulations", "React Rendering Loops"]
      };
    }
  }

  async getLeaderboard() {
    if (isPrismaActive && prisma) {
      return prisma.leaderboardEntry.findMany({
        orderBy: { rank: 'asc' }
      });
    } else {
      // Return high fidelity mock list
      return [
        { rank: 1, name: "Pranjal Sharma", college: "IIT Delhi", xp: 3200 },
        { rank: 2, name: "Ananya Iyer", college: "NSUT Delhi", xp: 2950 },
        { rank: 3, name: "Tanishq Sehgal", college: "DTU Delhi", xp: 2710 },
        { rank: 4, name: "Mehak", college: "NSUT Delhi", xp: 2150 },
        { rank: 5, name: "Rohit Verma", college: "BITS Pilani", xp: 1980 }
      ];
    }
  }
}
