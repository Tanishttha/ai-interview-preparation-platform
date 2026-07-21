import { prisma } from '../config/db';

export class ResumeRepository {
  async save(data: any) {
    return prisma.resume.create({ data });
  }

  async getLatestByUserId(userId: string) {
    return prisma.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getProfile(userId: string) {
    return (prisma as any).resumeProfile.findUnique({
      where: { userId }
    });
  }

  async saveProfile(userId: string, data: any) {
    return (prisma as any).resumeProfile.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data }
    });
  }
}
